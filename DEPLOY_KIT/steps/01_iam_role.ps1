param($Config, $Kit, $Region)
Write-Host "[1/8] IAM Role..." -ForegroundColor Cyan

$trust = '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}'
[System.IO.File]::WriteAllText("$env:TEMP\hwpro_trust.json", $trust)

$existing = aws iam get-role --role-name HardwarePro-Lambda-Role --query "Role.Arn" --output text 2>$null
if ($existing -match "arn:aws") {
    Write-Host "  Role already exists, reusing." -ForegroundColor Gray
    $existing | Out-File "$env:TEMP\hwpro_role_arn.txt" -Encoding utf8
} else {
    $arn = aws iam create-role `
        --role-name HardwarePro-Lambda-Role `
        --assume-role-policy-document "file://$env:TEMP\hwpro_trust.json" `
        --query "Role.Arn" --output text
    Write-Host "  Created role: $arn" -ForegroundColor Green
    $arn | Out-File "$env:TEMP\hwpro_role_arn.txt" -Encoding utf8
}

aws iam attach-role-policy --role-name HardwarePro-Lambda-Role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole 2>&1 | Out-Null
aws iam attach-role-policy --role-name HardwarePro-Lambda-Role --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess 2>&1 | Out-Null
aws iam attach-role-policy --role-name HardwarePro-Lambda-Role --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess 2>&1 | Out-Null

Write-Host "  Waiting 12s for IAM propagation..." -ForegroundColor Gray
Start-Sleep -Seconds 12
Write-Host "  IAM role ready." -ForegroundColor Green
