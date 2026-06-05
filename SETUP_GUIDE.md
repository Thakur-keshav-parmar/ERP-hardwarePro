# HardwarePro ERP — Setup Guide

A full-stack inventory & billing ERP for hardware stores.
Built with: AWS Lambda · DynamoDB · API Gateway · S3 · CloudFront · Razorpay · Twilio WhatsApp

---

## What You Need Before Starting

| Service | Purpose | Free? |
|---------|---------|-------|
| AWS Account | Hosting (Lambda, DynamoDB, S3, CloudFront) | Free tier available |
| Razorpay Account | Payment gateway | Free (test mode) |
| Twilio Account | WhatsApp notifications | Free (sandbox) |
| Groq Account | AI query assistant | Free tier (14,400 req/day) |

---

## Step 1 — Get Your Credentials

### AWS
1. Go to [aws.amazon.com](https://aws.amazon.com) → Create account or sign in
2. Go to IAM → Users → Create user (name: `hardwarepro-deploy`)
3. Attach policy: **AdministratorAccess**
4. Go to user → Security credentials → Create access key → CLI
5. Save your:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION` (recommended: `ap-south-1` for India, `us-east-1` for US)

### Razorpay
1. Go to [razorpay.com](https://razorpay.com) → Create account
2. Dashboard → Settings → API Keys → Generate Test Key
3. Save your:
   - `RAZORPAY_KEY_ID` (starts with `rzp_test_`)
   - `RAZORPAY_KEY_SECRET`

### Twilio (WhatsApp)
1. Go to [twilio.com](https://twilio.com) → Create account
2. Console → Account Info → Copy:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
3. Messaging → Try it out → Send a WhatsApp message
4. Follow sandbox join instructions, save:
   - `TWILIO_SANDBOX_JOIN_CODE`

### Groq AI
1. Go to [console.groq.com](https://console.groq.com) → Create account
2. API Keys → Create API Key → Save:
   - `GROQ_API_KEY`

---

## Step 2 — Fill in config.json

Open `DEPLOY_KIT/config.json` and replace all `YOUR_*` values:

```json
{
  "aws": {
    "region": "YOUR_AWS_REGION"
  },
  "razorpay": {
    "key_id": "YOUR_RAZORPAY_KEY_ID",
    "key_secret": "YOUR_RAZORPAY_KEY_SECRET"
  },
  "twilio": {
    "account_sid": "YOUR_TWILIO_ACCOUNT_SID",
    "auth_token": "YOUR_TWILIO_AUTH_TOKEN",
    "whatsapp_from": "whatsapp:+14155238886"
  },
  "groq": {
    "api_key": "YOUR_GROQ_API_KEY"
  }
}
```

---

## Step 3 — Fill in the Frontend (index.html)

Open `frontend/index.html` and find this block (search: `AWS_CONFIG`):

```javascript
// File: frontend/index.html
// Search for: AWS_CONFIG

const AWS_CONFIG = {
    useCloud: true,
    apiEndpoint: 'YOUR_AWS_API_GATEWAY_ENDPOINT',   // ← paste your API Gateway URL here
    razorpayKeyId: "YOUR_RAZORPAY_KEY_ID"           // ← paste your Razorpay Key ID here
};
```

**After deploying (Step 4), come back and fill `apiEndpoint` with the URL you get.**

---

## Step 4 — Set Up Default Users

Open `frontend/index.html` and find the `seedDefaults` function (search: `seedDefaults`):

```javascript
// File: frontend/index.html
// Search for: seedDefaults

users.push({ username: 'admin',    phone: 'YOUR_ADMIN_PHONE',    passwordHash: 'YOUR_ADMIN_PASSWORD_HASH',    role: 'admin' });
users.push({ username: 'staff',    phone: 'YOUR_STAFF_PHONE',    passwordHash: 'YOUR_STAFF_PASSWORD_HASH',    role: 'staff' });
users.push({ username: 'customer', phone: 'YOUR_CUSTOMER_PHONE', passwordHash: 'YOUR_CUSTOMER_PASSWORD_HASH', role: 'customer' });
```

**How to generate a password hash:**
The system uses SHA-256 with salt `hwpro_salt_2024`.

Run this in your browser console (F12 → Console):
```javascript
async function makeHash(password) {
  const data = new TextEncoder().encode(password + 'hwpro_salt_2024');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}
makeHash('your_password_here').then(console.log);
```

Also update the store settings:
```javascript
// Search for: storeSettings =
storeSettings = { name: 'YOUR_STORE_NAME', phone: 'YOUR_STORE_PHONE', ... }
```

---

## Step 5 — Deploy to AWS

Install AWS CLI first: [docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

Configure it:
```powershell
aws configure
# Enter your AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, region, json
```

Then run the deploy script:
```powershell
cd YOUR_PATH\DEPLOY_KIT
.\deploy.ps1
```

This automatically:
1. Creates IAM Role for Lambda
2. Creates 9 DynamoDB tables
3. Deploys 11 Lambda functions
4. Creates API Gateway with 11 routes
5. Creates S3 bucket + uploads frontend
6. Creates CloudFront CDN
7. Sets up Lambda warming (prevents cold starts)
8. Verifies everything is live

---

## Step 6 — Update API Endpoint in Frontend

After deploy, the script prints your API Gateway URL. Copy it and paste it into `frontend/index.html`:

```javascript
apiEndpoint: 'https://YOUR_ID.execute-api.YOUR_REGION.amazonaws.com/prod',
```

Re-upload the frontend to S3:
```powershell
aws s3 cp frontend/index.html s3://YOUR_BUCKET_NAME/
```

---

## Placeholder Reference Table

| Placeholder | File | What to put |
|---|---|---|
| `YOUR_AWS_API_GATEWAY_ENDPOINT` | `frontend/index.html` line ~2859 | Your API Gateway URL after deploy |
| `YOUR_RAZORPAY_KEY_ID` | `frontend/index.html` line ~2860 | Razorpay Key ID (`rzp_test_...`) |
| `YOUR_RAZORPAY_KEY_SECRET` | `DEPLOY_KIT/config.json` | Razorpay Key Secret |
| `YOUR_TWILIO_ACCOUNT_SID` | `DEPLOY_KIT/config.json` | Twilio Account SID (`AC...`) |
| `YOUR_TWILIO_AUTH_TOKEN` | `DEPLOY_KIT/config.json` | Twilio Auth Token |
| `YOUR_TWILIO_SANDBOX_JOIN_CODE` | `DEPLOY_KIT/README.md` line ~121 | Your Twilio sandbox join phrase |
| `YOUR_GROQ_API_KEY` | `DEPLOY_KIT/config.json` | Groq API Key (`gsk_...`) |
| `YOUR_ADMIN_PHONE` | `frontend/index.html` line ~6293 | Admin login phone number |
| `YOUR_ADMIN_PASSWORD_HASH` | `frontend/index.html` line ~6293 | SHA-256 hash (see Step 4) |
| `YOUR_STORE_NAME` | `frontend/index.html` line ~6298 | Your shop/store name |
| `YOUR_STORE_PHONE` | `frontend/index.html` line ~6298 | Your store contact number |
| `YOUR_AWS_REGION` | `DEPLOY_KIT/config.json` | e.g. `ap-south-1` |

---

## Test Payment Cards (Razorpay Test Mode)

| Card Number | CVV | Expiry |
|---|---|---|
| 4111 1111 1111 1111 | Any 3 digits | Any future date |
| 5267 3181 8797 5449 | Any 3 digits | Any future date |

UPI test: `success@razorpay`

---

## Cleanup (To Avoid AWS Charges)

```powershell
aws s3 rm s3://YOUR_BUCKET_NAME --recursive
aws cloudformation delete-stack --stack-name HardwarePro --region YOUR_AWS_REGION
```
