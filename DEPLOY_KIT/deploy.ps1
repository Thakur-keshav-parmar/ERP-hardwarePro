# =============================================================================
#  HardwarePro IMS — ONE-COMMAND DEPLOY SCRIPT
#  Run:  .\deploy.ps1
#  Time: ~8 minutes
# =============================================================================

$KIT    = $PSScriptRoot
$CONFIG = Get-Content "$KIT\config.json" | ConvertFrom-Json
$REGION = $CONFIG.aws.region

# ── Validate config filled in ─────────────────────────────────────────────────
$missing = @()
if ($CONFIG.razorpay.key_id     -like "YOUR_*") { $missing += "razorpay.key_id" }
if ($CONFIG.razorpay.key_secret -like "YOUR_*") { $missing += "razorpay.key_secret" }
if ($CONFIG.twilio.account_sid  -like "YOUR_*") { $missing += "twilio.account_sid" }
if ($CONFIG.twilio.auth_token   -like "YOUR_*") { $missing += "twilio.auth_token" }
if ($CONFIG.groq.api_key        -like "YOUR_*") { $missing += "groq.api_key" }

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "ERROR: Fill in config.json first. Missing values:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    Write-Host ""
    Write-Host "Open config.json and replace all YOUR_* placeholders, then run again."
    exit 1
}

# ── Run all steps in order ────────────────────────────────────────────────────
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  HardwarePro IMS — AWS Deployment" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$steps = @(
    "01_iam_role.ps1",
    "02_dynamodb_tables.ps1",
    "03_lambda_functions.ps1",
    "04_api_gateway.ps1",
    "05_s3_frontend.ps1",
    "06_cloudfront.ps1",
    "07_warmup_rule.ps1",
    "08_verify.ps1"
)

foreach ($step in $steps) {
    Write-Host ""
    & "$KIT\steps\$step" -Config $CONFIG -Kit $KIT -Region $REGION
    if ($LASTEXITCODE -ne 0) {
        Write-Host "STEP FAILED: $step — check error above." -ForegroundColor Red
        exit 1
    }
}

# ── Final output ──────────────────────────────────────────────────────────────
$out = Get-Content "$KIT\LAST_DEPLOY.json" | ConvertFrom-Json
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  DEPLOYMENT COMPLETE" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Live URL  : $($out.cloudfront_url)" -ForegroundColor White
Write-Host "  API Base  : $($out.api_url)" -ForegroundColor White
Write-Host "  S3 Bucket : $($out.s3_bucket)" -ForegroundColor White
Write-Host ""
Write-Host "  Login → admin / 1234" -ForegroundColor Yellow
Write-Host "  Wait 5-10 min for CloudFront to go live." -ForegroundColor Yellow
Write-Host "  WhatsApp: send 'join exclaimed-year' to +1 415 523 8886" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Green
