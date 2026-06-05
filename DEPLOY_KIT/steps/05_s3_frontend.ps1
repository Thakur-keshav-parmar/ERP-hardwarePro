param($Config, $Kit, $Region)
Write-Host "[5/8] S3 + Frontend Upload..." -ForegroundColor Cyan

$ACCOUNT   = (Get-Content "$env:TEMP\hwpro_account.txt" -Raw).Trim()
$apiUrl    = (Get-Content "$env:TEMP\hwpro_api_url.txt" -Raw).Trim()
$bucket    = "hardwarepro-frontend-$ACCOUNT"

# Create bucket
$exists = aws s3api head-bucket --bucket $bucket 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Bucket already exists: $bucket" -ForegroundColor Gray
} else {
    if ($Region -eq "us-east-1") {
        aws s3api create-bucket --bucket $bucket --region $Region 2>&1 | Out-Null
    } else {
        aws s3api create-bucket --bucket $bucket --region $Region `
            --create-bucket-configuration LocationConstraint=$Region 2>&1 | Out-Null
    }
    Write-Host "  Bucket created: $bucket" -ForegroundColor Green
}

# Enable static website hosting
aws s3 website "s3://$bucket" --index-document index.html --error-document index.html 2>&1 | Out-Null

# Public read policy
$policy = "{`"Version`":`"2012-10-17`",`"Statement`":[{`"Effect`":`"Allow`",`"Principal`":`"*`",`"Action`":`"s3:GetObject`",`"Resource`":`"arn:aws:s3:::$bucket/*`"}]}"
[System.IO.File]::WriteAllText("$env:TEMP\hwpro_bucket_policy.json", $policy)
aws s3api put-public-access-block --bucket $bucket `
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false" 2>&1 | Out-Null
aws s3api put-bucket-policy --bucket $bucket --policy "file://$env:TEMP\hwpro_bucket_policy.json" 2>&1 | Out-Null

# Patch API_BASE in index.html and upload
Write-Host "  Patching API_BASE in index.html..." -ForegroundColor Gray
$html = [System.IO.File]::ReadAllText("$Kit\frontend\index.html")

# Replace any existing API Gateway URL or placeholder
$html = [System.Text.RegularExpressions.Regex]::Replace(
    $html,
    "const API_BASE\s*=\s*[`"'][^`"']*[`"']",
    "const API_BASE = '$apiUrl'"
)
$html = [System.Text.RegularExpressions.Regex]::Replace(
    $html,
    "https://[a-z0-9]{10}\.execute-api\.[a-z0-9-]+\.amazonaws\.com/prod",
    $apiUrl
)

# Gzip and upload
$bytes = [System.Text.Encoding]::UTF8.GetBytes($html)
$ms    = New-Object System.IO.MemoryStream
$gz    = New-Object System.IO.Compression.GZipStream($ms, [System.IO.Compression.CompressionMode]::Compress, $true)
$gz.Write($bytes, 0, $bytes.Length); $gz.Close()
$gzPath = "$env:TEMP\hwpro_index.gz"
[System.IO.File]::WriteAllBytes($gzPath, $ms.ToArray())

aws s3 cp $gzPath "s3://$bucket/index.html" `
    --content-type "text/html; charset=utf-8" `
    --content-encoding "gzip" `
    --cache-control "max-age=0, no-cache" 2>&1 | Out-Null

Write-Host "  Frontend uploaded to S3." -ForegroundColor Green

$bucket | Out-File "$env:TEMP\hwpro_bucket.txt" -Encoding utf8
