param($Config, $Kit, $Region)
Write-Host "[4/8] API Gateway..." -ForegroundColor Cyan

$ACCOUNT = (Get-Content "$env:TEMP\hwpro_account.txt" -Raw).Trim()

# Check if API already exists
$existingId = aws apigateway get-rest-apis --query "items[?name=='HardwarePro-API'].id" --output text 2>$null
if ($existingId -and $existingId.Length -gt 3) {
    Write-Host "  API Gateway already exists (ID: $existingId), reusing." -ForegroundColor Gray
    $apiId = $existingId
} else {
    $apiId = aws apigateway create-rest-api `
        --name "HardwarePro-API" `
        --description "HardwarePro IMS REST API" `
        --endpoint-configuration types=REGIONAL `
        --query "id" --output text
    Write-Host "  Created API: $apiId" -ForegroundColor Green
}

$rootId = aws apigateway get-resources --rest-api-id $apiId --query "items[?path=='/'].id" --output text

# Route path → Lambda function name
$routes = [ordered]@{
    "products"        = "HardwarePro-Products"
    "bills"           = "HardwarePro-Bills"
    "users"           = "HardwarePro-Users"
    "settings"        = "HardwarePro-Settings"
    "suppliers"       = "HardwarePro-Suppliers"
    "purchase-orders" = "HardwarePro-PurchaseOrders"
    "stock-logs"      = "HardwarePro-StockLogs"
    "send-whatsapp"   = "HardwarePro-SendWhatsApp"
    "create-order"    = "HardwarePro-CreateOrder"
    "confirm-payment" = "HardwarePro-ConfirmPayment"
    "admin-chat"      = "HardwarePro-AdminChat"
}

foreach ($path in $routes.Keys) {
    $fn    = $routes[$path]
    $fnArn = "arn:aws:lambda:${Region}:${ACCOUNT}:function:${fn}"

    # Get or create resource
    $resId = aws apigateway get-resources --rest-api-id $apiId `
        --query "items[?pathPart=='$path'].id" --output text 2>$null
    if (-not $resId -or $resId.Length -lt 3) {
        $resId = aws apigateway create-resource `
            --rest-api-id $apiId --parent-id $rootId `
            --path-part $path --query "id" --output text
    }

    # ANY method with Lambda proxy
    aws apigateway put-method --rest-api-id $apiId --resource-id $resId `
        --http-method ANY --authorization-type NONE 2>&1 | Out-Null
    aws apigateway put-integration --rest-api-id $apiId --resource-id $resId `
        --http-method ANY --type AWS_PROXY --integration-http-method POST `
        --uri "arn:aws:apigateway:${Region}:lambda:path/2015-03-31/functions/${fnArn}/invocations" 2>&1 | Out-Null

    # OPTIONS for CORS
    aws apigateway put-method --rest-api-id $apiId --resource-id $resId `
        --http-method OPTIONS --authorization-type NONE 2>&1 | Out-Null
    aws apigateway put-integration --rest-api-id $apiId --resource-id $resId `
        --http-method OPTIONS --type MOCK `
        --request-templates '{"application/json":"{\"statusCode\":200}"}' 2>&1 | Out-Null
    aws apigateway put-method-response --rest-api-id $apiId --resource-id $resId `
        --http-method OPTIONS --status-code 200 `
        --response-parameters "method.response.header.Access-Control-Allow-Headers=false,method.response.header.Access-Control-Allow-Methods=false,method.response.header.Access-Control-Allow-Origin=false" 2>&1 | Out-Null
    aws apigateway put-integration-response --rest-api-id $apiId --resource-id $resId `
        --http-method OPTIONS --status-code 200 `
        --response-parameters '{"method.response.header.Access-Control-Allow-Headers":"'"'"'Content-Type,Authorization'"'"'","method.response.header.Access-Control-Allow-Methods":"'"'"'ANY,OPTIONS'"'"'","method.response.header.Access-Control-Allow-Origin":"'"'"'*'"'"'"}' 2>&1 | Out-Null

    # Lambda permission to be called by API Gateway
    aws lambda add-permission --function-name $fn `
        --statement-id "apigw-${path}-$(Get-Random -Max 9999)" `
        --action lambda:InvokeFunction `
        --principal apigateway.amazonaws.com `
        --source-arn "arn:aws:apigateway:${Region}::/restapis/${apiId}/*" 2>&1 | Out-Null

    Write-Host "  Route /$path OK" -ForegroundColor Green
}

# Deploy to prod stage
aws apigateway create-deployment --rest-api-id $apiId --stage-name prod 2>&1 | Out-Null

$apiUrl = "https://${apiId}.execute-api.${Region}.amazonaws.com/prod"
Write-Host "  API live: $apiUrl" -ForegroundColor Green

# Save for next steps
$apiUrl  | Out-File "$env:TEMP\hwpro_api_url.txt" -Encoding utf8
$apiId   | Out-File "$env:TEMP\hwpro_api_id.txt"  -Encoding utf8
