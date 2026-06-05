param($Config, $Kit, $Region)
Write-Host "[3/8] Lambda Functions..." -ForegroundColor Cyan

$roleArn = Get-Content "$env:TEMP\hwpro_role_arn.txt" -Raw | ForEach-Object { $_.Trim() }
$ACCOUNT = aws sts get-caller-identity --query Account --output text

# Function definitions: name, memory, environment variables
$functions = @(
    @{
        Name   = "HardwarePro-Products"
        Memory = 512
        Env    = "Variables={REGION=$Region}"
    },
    @{
        Name   = "HardwarePro-Bills"
        Memory = 512
        Env    = "Variables={REGION=$Region}"
    },
    @{
        Name   = "HardwarePro-Users"
        Memory = 512
        Env    = "Variables={REGION=$Region}"
    },
    @{
        Name   = "HardwarePro-Settings"
        Memory = 512
        Env    = "Variables={REGION=$Region}"
    },
    @{
        Name   = "HardwarePro-Suppliers"
        Memory = 512
        Env    = "Variables={REGION=$Region}"
    },
    @{
        Name   = "HardwarePro-PurchaseOrders"
        Memory = 512
        Env    = "Variables={REGION=$Region}"
    },
    @{
        Name   = "HardwarePro-StockLogs"
        Memory = 128
        Env    = "Variables={REGION=$Region}"
    },
    @{
        Name   = "HardwarePro-SendWhatsApp"
        Memory = 128
        Env    = "Variables={TWILIO_SID=$($Config.twilio.account_sid),TWILIO_TOKEN=$($Config.twilio.auth_token),TWILIO_FROM=$($Config.twilio.whatsapp_from)}"
    },
    @{
        Name   = "HardwarePro-CreateOrder"
        Memory = 128
        Env    = "Variables={RAZORPAY_KEY_ID=$($Config.razorpay.key_id),RAZORPAY_KEY_SECRET=$($Config.razorpay.key_secret)}"
    },
    @{
        Name   = "HardwarePro-ConfirmPayment"
        Memory = 128
        Env    = "Variables={RAZORPAY_KEY_ID=$($Config.razorpay.key_id),RAZORPAY_KEY_SECRET=$($Config.razorpay.key_secret)}"
    },
    @{
        Name   = "HardwarePro-AdminChat"
        Memory = 256
        Env    = "Variables={GROQ_API_KEY=$($Config.groq.api_key),OPENROUTER_API_KEY=$($Config.groq.api_key)}"
    }
)

# Save account for later steps
$ACCOUNT | Out-File "$env:TEMP\hwpro_account.txt" -Encoding utf8

foreach ($fn in $functions) {
    $srcDir = "$Kit\lambdas\$($fn.Name)"
    if (-not (Test-Path "$srcDir\index.js")) {
        Write-Host "  SKIP (no source): $($fn.Name)" -ForegroundColor Yellow
        continue
    }

    $zipPath = "$env:TEMP\$($fn.Name).zip"
    Compress-Archive -Path "$srcDir\index.js" -DestinationPath $zipPath -Force

    # Check if already exists
    $exists = aws lambda get-function --function-name $fn.Name --query "Configuration.FunctionName" --output text 2>$null
    if ($exists -eq $fn.Name) {
        # Update existing
        aws lambda update-function-code `
            --function-name $fn.Name `
            --zip-file "fileb://$zipPath" `
            --query "FunctionName" --output text 2>&1 | Out-Null
        aws lambda update-function-configuration `
            --function-name $fn.Name `
            --memory-size $fn.Memory `
            --environment $fn.Env `
            --query "FunctionName" --output text 2>&1 | Out-Null
        Write-Host "  Updated: $($fn.Name) ($($fn.Memory) MB)" -ForegroundColor Gray
    } else {
        # Create new
        $r = aws lambda create-function `
            --function-name $fn.Name `
            --runtime nodejs18.x `
            --role $roleArn `
            --handler index.handler `
            --zip-file "fileb://$zipPath" `
            --timeout 30 `
            --memory-size $fn.Memory `
            --environment $fn.Env `
            --query "FunctionName" --output text 2>&1
        if ($r -match $fn.Name) {
            Write-Host "  Created: $($fn.Name) ($($fn.Memory) MB)" -ForegroundColor Green
        } else {
            Write-Host "  ERROR: $($fn.Name) — $r" -ForegroundColor Red
        }
    }
}
Write-Host "  All 11 Lambda functions deployed." -ForegroundColor Green
