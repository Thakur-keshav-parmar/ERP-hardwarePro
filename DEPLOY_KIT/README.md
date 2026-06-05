# HardwarePro IMS — Complete Deployment Guide

> A full-stack, serverless Inventory Management System for hardware retail stores.
> This kit deploys the entire project on AWS in under 10 minutes with one command.

---

## Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Browser)                       │
│              Single HTML File — 368 KB SPA                  │
└─────────────────┬───────────────────────────────────────────┘
                  │ HTTPS
┌─────────────────▼───────────────────────────────────────────┐
│           Amazon CloudFront CDN (Global)                    │
│        450+ Edge Locations — HTTPS — Fast Load              │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│              Amazon S3 (Static Hosting)                     │
│                 Stores index.html                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│           Amazon API Gateway (REST API)                     │
│      11 Routes: /products /bills /users /settings ...       │
└──────────────────────┬──────────────────────────────────────┘
                       │ Lambda Proxy
┌──────────────────────▼──────────────────────────────────────┐
│              AWS Lambda (Node.js 18.x)                      │
│  11 Functions — Products, Bills, Users, Settings,           │
│  Suppliers, PurchaseOrders, StockLogs, SendWhatsApp,        │
│  CreateOrder, ConfirmPayment, AdminChat                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              Amazon DynamoDB (NoSQL)                        │
│  9 Tables — Products, Bills, Users, Settings,               │
│  Suppliers, PurchaseOrders, StockLogs, Chats, Transactions  │
└─────────────────────────────────────────────────────────────┘

External SaaS APIs Used:
  Razorpay  → Payment processing (UPI / Card / Net Banking)
  Twilio    → WhatsApp messages (e-bills, OTPs, PO dispatch)
  Groq AI   → Admin query assistant (LLaMA 3 model)
  OpenStreetMap → Address geocoding + road distance calculation
```

---

## Folder Structure

```
DEPLOY_KIT/
├── README.md               ← This guide
├── config.json             ← Fill in your API keys here
├── deploy.ps1              ← Run this ONE script to deploy everything
├── LAST_DEPLOY.json        ← Created after deploy (your live URLs)
│
├── steps/                  ← Individual step scripts (auto-run by deploy.ps1)
│   ├── 01_iam_role.ps1         Step 1: Create IAM Role
│   ├── 02_dynamodb_tables.ps1  Step 2: Create 9 DynamoDB tables
│   ├── 03_lambda_functions.ps1 Step 3: Deploy 11 Lambda functions
│   ├── 04_api_gateway.ps1      Step 4: Create API Gateway + 11 routes
│   ├── 05_s3_frontend.ps1      Step 5: Create S3 bucket + upload frontend
│   ├── 06_cloudfront.ps1       Step 6: Create CloudFront CDN
│   ├── 07_warmup_rule.ps1      Step 7: EventBridge warming (no cold starts)
│   └── 08_verify.ps1           Step 8: Verify all resources live
│
├── lambdas/                ← Lambda source code
│   ├── HardwarePro-Products/index.js
│   ├── HardwarePro-Bills/index.js
│   ├── HardwarePro-Users/index.js
│   ├── HardwarePro-Settings/index.js
│   ├── HardwarePro-Suppliers/index.js
│   ├── HardwarePro-PurchaseOrders/index.js
│   ├── HardwarePro-StockLogs/index.js
│   ├── HardwarePro-SendWhatsApp/index.js
│   ├── HardwarePro-CreateOrder/index.js
│   ├── HardwarePro-ConfirmPayment/index.js
│   └── HardwarePro-AdminChat/index.js
│
└── frontend/
    └── index.html          ← Complete SPA (all features in one file)
```

---

## STEP 0 — Prerequisites

### 1. AWS Account
- Create account at https://aws.amazon.com
- Free tier covers all costs for small store usage

### 2. AWS CLI Installed
- Download: https://aws.amazon.com/cli/
- After install, run in PowerShell:
```powershell
aws configure
```
Enter:
- AWS Access Key ID    → From IAM → Users → Your User → Security Credentials
- AWS Secret Access Key → Same page
- Default region name  → us-east-1
- Default output format → json

### 3. Get your API Keys

#### Razorpay (Payment Gateway)
1. Go to https://razorpay.com → Sign Up
2. Login → Settings → API Keys → Generate Test Key
3. Copy: **Key ID** (starts with rzp_test_) and **Key Secret**

#### Twilio (WhatsApp Messaging)
1. Go to https://www.twilio.com → Sign Up
2. Console Dashboard → Copy **Account SID** and **Auth Token**
3. For WhatsApp: Go to Messaging → Try it out → Send a WhatsApp message
4. Follow instructions to join sandbox
5. Sandbox join code: **YOUR_TWILIO_SANDBOX_JOIN_CODE** (send to +1 415 523 8886 on WhatsApp)

#### Groq AI (AI Query Assistant)
1. Go to https://console.groq.com → Sign Up
2. API Keys → Create API Key
3. Copy the key (shown once — save it)
4. Free tier: 14,400 requests/day

---

## STEP 1 — Fill in config.json

Open `config.json` and replace all `YOUR_*` values:

```json
{
  "aws": {
    "region": "us-east-1"
  },
  "razorpay": {
    "key_id": "rzp_test_xxxxxxxxxxxx",
    "key_secret": "xxxxxxxxxxxxxxxxxxxxxxxx"
  },
  "twilio": {
    "account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "auth_token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "whatsapp_from": "whatsapp:+14155238886"
  },
  "groq": {
    "api_key": "gsk_xxxxxxxxxxxxxxxxxxxx"
  }
}
```

---

## STEP 2 — Run the Deploy Script

Open **PowerShell** (search PowerShell in Start Menu):

```powershell
cd "YOUR_PATH\DEPLOY_KIT"
.\deploy.ps1
```

The script runs all 8 steps automatically:
1. Creates IAM Role (permissions for Lambda)
2. Creates 9 DynamoDB tables
3. Deploys 11 Lambda functions
4. Creates API Gateway with 11 routes
5. Creates S3 bucket + uploads frontend
6. Creates CloudFront CDN
7. Sets up Lambda warming (no cold starts)
8. Verifies everything is live

**Total time: ~8 minutes**

---

## STEP 3 — After Deploy

### Wait 5-10 minutes
CloudFront needs time to propagate globally. Your live URL is in `LAST_DEPLOY.json`.

### Join WhatsApp Sandbox
From your phone's WhatsApp, send this message to **+1 (415) 523-8886**:
```
join exclaimed-year
```
Twilio will reply "connected". After this, all e-bills and OTPs will arrive on your number.

### First Login
1. Open your CloudFront URL (from LAST_DEPLOY.json)
2. Username: `admin`
3. Password: `1234`

### Set Up Store Settings
1. Login as admin
2. Go to **Admin Portal → Settings tab**
3. Enter: Store Name, Phone, Address, GST Number
4. Set CGST % and SGST % rates
5. Click **Save Settings**
6. Your address will be geocoded automatically for delivery distance calculation

---

## What Each Lambda Does

| Function | Route | Description |
|---|---|---|
| HardwarePro-Products | /products | Add, edit, delete, get products |
| HardwarePro-Bills | /bills | Create bills, fetch transaction history |
| HardwarePro-Users | /users | Login, register, manage staff |
| HardwarePro-Settings | /settings | Store config, delivery vehicles |
| HardwarePro-Suppliers | /suppliers | Supplier CRUD |
| HardwarePro-PurchaseOrders | /purchase-orders | PO creation and tracking |
| HardwarePro-StockLogs | /stock-logs | Stock movement tracking |
| HardwarePro-SendWhatsApp | /send-whatsapp | Twilio WhatsApp message sender |
| HardwarePro-CreateOrder | /create-order | Razorpay order creation |
| HardwarePro-ConfirmPayment | /confirm-payment | Razorpay payment verification |
| HardwarePro-AdminChat | /admin-chat | Groq AI query assistant |

---

## Monthly Cost Estimate

| Service | Free Tier Limit | Your Usage | Cost |
|---|---|---|---|
| AWS Lambda | 1,000,000 calls/month | ~50,000/month | FREE |
| DynamoDB | 25 GB + 25 RCU/WCU | ~1 GB | FREE |
| Amazon S3 | 5 GB storage | 1 file (368 KB) | FREE |
| CloudFront | 1 TB transfer/month | ~10 GB | FREE |
| API Gateway | 1M calls/month | ~50,000 | FREE |
| **Total** | | | **~Rs. 0/month** |

---

## Troubleshooting

### "AccessDenied" errors
Your AWS IAM user needs these permissions:
- AmazonDynamoDBFullAccess
- AWSLambda_FullAccess
- AmazonAPIGatewayAdministrator
- CloudFrontFullAccess
- AmazonS3FullAccess
- IAMFullAccess

Go to: AWS Console → IAM → Users → Your User → Add Permissions

### "ResourceConflictException" on Lambda
Lambda already exists. The script will automatically update it instead of creating new.

### CloudFront shows error page
Wait 10 minutes — CloudFront takes time to propagate.
If still broken: check S3 bucket has public read access.

### WhatsApp messages not arriving
You need to rejoin the sandbox. Send `join exclaimed-year` to +1 415 523 8886 on WhatsApp.
Sandbox sessions expire after 72 hours of inactivity.

### "Razorpay: Payment Failed"
Make sure you're using TEST mode keys (rzp_test_...).
Test card: 4111 1111 1111 1111 | Any future date | Any CVV

### AI Assistant not responding
Check GROQ_API_KEY in Lambda environment variables:
AWS Console → Lambda → HardwarePro-AdminChat → Configuration → Environment Variables

---

## How to Update the Frontend After Changes

```powershell
# Just run this after editing frontend/index.html:
aws s3 cp frontend/index.html s3://YOUR-BUCKET-NAME/index.html `
    --content-type "text/html" --cache-control "max-age=0,no-cache"

aws cloudfront create-invalidation `
    --distribution-id YOUR-CF-ID --paths "/*"
```

Your CF Distribution ID and bucket name are in `LAST_DEPLOY.json`.

---

## How to Completely Delete Everything

```powershell
# Delete all HardwarePro resources (run in PowerShell)
# 1. Lambdas
aws lambda list-functions --query "Functions[?starts_with(FunctionName,'HardwarePro')].FunctionName" --output text | ForEach-Object { aws lambda delete-function --function-name $_ }

# 2. DynamoDB
aws dynamodb list-tables --query "TableNames[?starts_with(@,'HardwarePro')]" --output text | ForEach-Object { aws dynamodb delete-table --table-name $_ }

# 3. S3 (replace ACCOUNTID)
aws s3 rb s3://hardwarepro-frontend-ACCOUNTID --force

# 4. API Gateway
aws apigateway get-rest-apis --query "items[?contains(name,'HardwarePro')].id" --output text | ForEach-Object { aws apigateway delete-rest-api --rest-api-id $_ }

# 5. EventBridge
aws events delete-rule --name HardwarePro-WarmAll --force

# 6. CloudFront — disable first, then delete (takes ~5 min)
```

---

## Features Included

- **Shopping Mode** — Product grid, cart, GST billing, PDF invoice
- **Return Mode** — Refund with 2% processing fee, stock restore
- **Delivery Portal** — GPS address, road distance, vehicle pricing, WhatsApp OTP
- **Admin Portal** — 9 tabs: Inventory, Logs, Staff, Analytics, Suppliers, Purchase Orders, Delivery Config, Settings, AI Assistant
- **Barcode Scanning** — Camera-based product lookup
- **WhatsApp Integration** — e-bills, delivery OTPs, supplier PO dispatch
- **Razorpay Payments** — UPI, Card, Net Banking
- **AI Assistant** — Natural language inventory queries (Groq LLaMA 3)
- **Analytics Dashboard** — Sales charts, profit reports, time-slot breakdown
- **Expiry Tracking** — 30-day alerts, bulk mark to cost price
- **Supplier Management** — Supplier directory, purchase orders
- **Login Security** — SHA-256 hashing, rate limiting (3 attempts), session timeout

---

*HardwarePro IMS — Built on AWS Serverless Architecture*
