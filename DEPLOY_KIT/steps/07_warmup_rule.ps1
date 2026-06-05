param($Config, $Kit, $Region)
Write-Host "[7/8] Lambda Warming Rule..." -ForegroundColor Cyan

$ACCOUNT = (Get-Content "$env:TEMP\hwpro_account.txt" -Raw).Trim()

aws events put-rule --name "HardwarePro-WarmAll" `
    --schedule-expression "rate(5 minutes)" `
    --state ENABLED `
    --description "Keep HardwarePro Lambdas warm — eliminates cold starts" 2>&1 | Out-Null

$warmFns = @(
    "HardwarePro-Products","HardwarePro-Bills","HardwarePro-Users",
    "HardwarePro-Settings","HardwarePro-Suppliers","HardwarePro-PurchaseOrders"
)

$i = 0
foreach ($fn in $warmFns) {
    $fnArn   = "arn:aws:lambda:${Region}:${ACCOUNT}:function:${fn}"
    $ruleArn = "arn:aws:events:${Region}:${ACCOUNT}:rule/HardwarePro-WarmAll"

    aws events put-targets --rule "HardwarePro-WarmAll" `
        --targets "Id=warm${i},Arn=${fnArn},Input={}" 2>&1 | Out-Null

    aws lambda add-permission --function-name $fn `
        --statement-id "warmup-$i" `
        --action lambda:InvokeFunction `
        --principal events.amazonaws.com `
        --source-arn $ruleArn 2>&1 | Out-Null

    $i++
}
Write-Host "  Warming rule active — pings every 5 min (no cold starts)." -ForegroundColor Green
