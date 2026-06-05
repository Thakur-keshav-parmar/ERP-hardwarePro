param($Config, $Kit, $Region)
Write-Host "[6/8] CloudFront CDN..." -ForegroundColor Cyan

$bucket = (Get-Content "$env:TEMP\hwpro_bucket.txt" -Raw).Trim()
$origin = "${bucket}.s3-website-${Region}.amazonaws.com"
$ref    = "hwpro-$(Get-Date -Format 'yyyyMMddHHmmss')"

# Check if HardwarePro CloudFront already exists
$existing = aws cloudfront list-distributions `
    --query "DistributionList.Items[?contains(Origins.Items[0].DomainName,'$bucket')].{Id:Id,Domain:DomainName}" `
    --output json 2>$null | ConvertFrom-Json

if ($existing -and $existing.Count -gt 0) {
    $cfId  = $existing[0].Id
    $cfUrl = "https://$($existing[0].Domain)"
    Write-Host "  CloudFront already exists: $cfUrl" -ForegroundColor Gray
} else {
    $cfJson = @"
{
  "CallerReference": "$ref",
  "DefaultRootObject": "index.html",
  "Comment": "HardwarePro IMS Frontend",
  "Enabled": true,
  "PriceClass": "PriceClass_100",
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "S3WebsiteOrigin",
      "DomainName": "$origin",
      "CustomOriginConfig": {
        "HTTPPort": 80, "HTTPSPort": 443,
        "OriginProtocolPolicy": "http-only"
      }
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3WebsiteOrigin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2, "Items": ["HEAD","GET"],
      "CachedMethods": {"Quantity": 2, "Items": ["HEAD","GET"]}
    },
    "Compress": true,
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6"
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {"ErrorCode": 403, "ResponsePagePath": "/index.html", "ResponseCode": "200", "ErrorCachingMinTTL": 300},
      {"ErrorCode": 404, "ResponsePagePath": "/index.html", "ResponseCode": "200", "ErrorCachingMinTTL": 300}
    ]
  }
}
"@

    [System.IO.File]::WriteAllText("$env:TEMP\hwpro_cf.json", $cfJson)

    $result = aws cloudfront create-distribution `
        --distribution-config "file://$env:TEMP\hwpro_cf.json" | ConvertFrom-Json

    $cfId  = $result.Distribution.Id
    $cfUrl = "https://$($result.Distribution.DomainName)"
    Write-Host "  CloudFront created: $cfUrl" -ForegroundColor Green
    Write-Host "  ID: $cfId" -ForegroundColor Gray
    Write-Host "  Note: Takes 5-10 min to propagate globally." -ForegroundColor Yellow
}

$cfId  | Out-File "$env:TEMP\hwpro_cf_id.txt"  -Encoding utf8
$cfUrl | Out-File "$env:TEMP\hwpro_cf_url.txt" -Encoding utf8
