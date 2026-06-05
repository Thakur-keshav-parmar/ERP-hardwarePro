param($Config, $Kit, $Region)
Write-Host "[8/8] Verifying deployment..." -ForegroundColor Cyan

$ACCOUNT = (Get-Content "$env:TEMP\hwpro_account.txt" -Raw).Trim()
$apiUrl  = (Get-Content "$env:TEMP\hwpro_api_url.txt" -Raw).Trim()
$bucket  = (Get-Content "$env:TEMP\hwpro_bucket.txt"  -Raw).Trim()
$cfId    = (Get-Content "$env:TEMP\hwpro_cf_id.txt"   -Raw).Trim()
$cfUrl   = (Get-Content "$env:TEMP\hwpro_cf_url.txt"  -Raw).Trim()

$ok = $true

# Check Lambdas
$count = (aws lambda list-functions --query "Functions[?starts_with(FunctionName,'HardwarePro')]" --output json | ConvertFrom-Json).Count
if ($count -ge 11) { Write-Host "  Lambdas     : $count deployed" -ForegroundColor Green }
else               { Write-Host "  Lambdas     : Only $count found (expected 11)" -ForegroundColor Red; $ok = $false }

# Check DynamoDB
$tcount = (aws dynamodb list-tables --query "TableNames[?starts_with(@,'HardwarePro')]" --output json | ConvertFrom-Json).Count
if ($tcount -ge 9) { Write-Host "  DynamoDB    : $tcount tables" -ForegroundColor Green }
else               { Write-Host "  DynamoDB    : Only $tcount tables (expected 9)" -ForegroundColor Red; $ok = $false }

# Check S3
$s3 = aws s3api head-bucket --bucket $bucket 2>$null
if ($LASTEXITCODE -eq 0) { Write-Host "  S3 Bucket   : $bucket OK" -ForegroundColor Green }
else                     { Write-Host "  S3 Bucket   : NOT FOUND" -ForegroundColor Red; $ok = $false }

# Check API Gateway
$apiId = (Get-Content "$env:TEMP\hwpro_api_id.txt" -Raw).Trim()
$stage = aws apigateway get-stage --rest-api-id $apiId --stage-name prod --query "stageName" --output text 2>$null
if ($stage -eq "prod") { Write-Host "  API Gateway : $apiUrl OK" -ForegroundColor Green }
else                   { Write-Host "  API Gateway : Stage not found" -ForegroundColor Red; $ok = $false }

# Check CloudFront
$cfStatus = aws cloudfront get-distribution --id $cfId --query "Distribution.Status" --output text 2>$null
if ($cfStatus -match "InProgress|Deployed") { Write-Host "  CloudFront  : $cfUrl ($cfStatus)" -ForegroundColor Green }
else                                        { Write-Host "  CloudFront  : NOT FOUND" -ForegroundColor Red; $ok = $false }

# Save LAST_DEPLOY.json
$deploy = @{
    deployed_at   = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    cloudfront_url = $cfUrl
    cloudfront_id  = $cfId
    api_url        = $apiUrl
    s3_bucket      = $bucket
    aws_account    = $ACCOUNT
    aws_region     = $Region
    login          = @{ username = "admin"; password = "1234" }
    whatsapp_join  = "Send 'join exclaimed-year' to +1 (415) 523-8886"
}
$deploy | ConvertTo-Json | Out-File "$Kit\LAST_DEPLOY.json" -Encoding utf8

if ($ok) { Write-Host "  All checks passed." -ForegroundColor Green }
else      { Write-Host "  Some checks failed — review errors above." -ForegroundColor Yellow }
