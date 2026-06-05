# 🏪 HardwarePro ERP

![AWS](https://img.shields.io/badge/AWS-Lambda%20%7C%20DynamoDB%20%7C%20S3%20%7C%20CloudFront-orange?logo=amazonaws)
![Razorpay](https://img.shields.io/badge/Payments-Razorpay-blue?logo=razorpay)
![Twilio](https://img.shields.io/badge/WhatsApp-Twilio-green?logo=twilio)
![License](https://img.shields.io/badge/License-MIT-green)
![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red)

> A complete, production-ready ERP system for hardware stores — built serverless on AWS. Manage inventory, billing, purchase orders, suppliers, payments and WhatsApp notifications from a single HTML file.

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 📦 Inventory | Products, stock levels, barcode scanning |
| 🧾 Billing | GST bills (CGST + SGST), print-ready PDF |
| 💳 Payments | Razorpay online payments integrated |
| 📱 WhatsApp | Automated payment reminders via Twilio |
| 🛒 Purchase Orders | Supplier orders, receiving, cost tracking |
| 👥 Users | Admin / Staff / Customer roles |
| 📊 Reports | Sales, stock, supplier analytics |
| 🤖 AI Assistant | Natural language inventory queries (Groq AI) |

---

## 🏗️ Architecture

```
Browser (index.html)
      │
      ▼
AWS API Gateway  ──►  11 Lambda Functions  ──►  DynamoDB (9 tables)
                                │
                    ┌───────────┼───────────┐
                 Razorpay    Twilio      Groq AI
```

**Hosted on:** S3 + CloudFront (global CDN, HTTPS)  
**Zero servers** — fully serverless, scales automatically

---

## 🚀 Quick Start

### Option 1 — Run Locally (No AWS needed)
Just open `frontend/index.html` in your browser. Works offline with local storage.

### Option 2 — Deploy to AWS (Production)
```powershell
# 1. Fill in your credentials
cp DEPLOY_KIT/config.json.example DEPLOY_KIT/config.json
# Edit config.json with your AWS, Razorpay, Twilio keys

# 2. Run the deploy script (deploys everything automatically)
cd DEPLOY_KIT
.\deploy.ps1
```
The script creates all AWS resources in ~5 minutes. See [SETUP_GUIDE.md](SETUP_GUIDE.md) for full details.

---

## 📁 Project Structure

```
ERP-hardwarePro/
├── frontend/          # Single-file frontend (HTML + CSS + JS)
├── DEPLOY_KIT/        # One-click AWS deployment scripts
│   ├── deploy.ps1     # Master deploy script
│   ├── config.json    # Your credentials (fill this in)
│   └── lambdas/       # 11 Lambda functions
├── backend/           # Local dev server
├── docs/              # Deployment guide
└── SETUP_GUIDE.md     # Complete setup instructions
```

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (zero dependencies, single file)
- **Backend:** AWS Lambda (Node.js)
- **Database:** AWS DynamoDB
- **Hosting:** AWS S3 + CloudFront
- **Payments:** Razorpay
- **WhatsApp:** Twilio
- **AI:** Groq (llama3-8b)

---

## 🎓 Use Cases

- ✅ Final year MCA / BCA / B.Tech project
- ✅ Real hardware store deployment
- ✅ Learning AWS serverless architecture
- ✅ Learning Razorpay payment integration

---

## 📋 Prerequisites

| Service | Free? | Purpose |
|---------|-------|---------|
| AWS Account | Free tier | Lambda, DynamoDB, S3, CloudFront |
| Razorpay | Free (test mode) | Payments |
| Twilio | Free (sandbox) | WhatsApp |
| Groq | Free (14,400 req/day) | AI assistant |

---

## 🤝 Contributing

Pull requests welcome. For major changes, open an issue first.

## 📄 License

[MIT](LICENSE) — free for personal, academic and commercial use.
