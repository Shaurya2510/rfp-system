AI-Powered RFP Management System
1-A full-stack procurement tool that automates:
2-Creating RFPs using AI
3-Emailing RFPs to vendors
4-Automatically parsing vendor email replies
5-Extracting structured proposal data using AI
6-Comparing proposals
7-Selecting best vendor using AI-powered analysis
This system combines Node.js, Express, PostgreSQL, React, TailwindCSS, Nodemailer, Gmail IMAP, and Groq AI to build a complete procurement pipeline.

Features
1-RFP Management
i)Create structured RFPs using AI (Groq LLM)
ii)Automatically extract quantities, specifications, budgets, payment terms, delivery time, warranty, etc.

2-Vendor Management
i)Add/delete vendors manually
ii)Auto-registration when a new vendor replies via email (optional)
iii)IMAP service listens for new emails every 30 sec

3-Automated Email System
i)Sends beautifully formatted RFP emails to vendors
ii)Uses Gmail SMTP (App Password)

4-Inbound Email Parsing
i)Reads vendor replies from Gmail (IMAP)
ii)Parses proposal text with AI
iii)Saves proposals automatically in DB

5-Proposal Comparison
i)Rule-based scoring + AI summary
ii)Helps choose the best vendor

6-Frontend (React + TailwindCSS)
i)Dashboard
ii)Create RFP
iii)Manage Vendors
iv)Send RFP
v)View Vendor Proposals
vi)AI Proposal Comparison

5-Tech Stack
i)Backend
ii)Node.js
iii)Express.js
iv)PostgreSQL
v)Nodemailer
vi)IMAP-Simple
vii)Groq AI API
viii)dotenv
ix)Frontend
x)React (Vite)
xi)TailwindCSS
xii)Axios
xiii)React Router DOM

Installation & Setup
1 Clone the repository
git clone https://github.com/your-username/rfp-system.git
cd rfp-system

Backend Setup
2 Install dependencies
cd backend
npm install

3 Create PostgreSQL database
CREATE DATABASE rfp_db;

Run the migration:

CREATE TABLE vendors (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  category TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rfps (
  id UUID PRIMARY KEY,
  title TEXT,
  description_raw TEXT,
  structured_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE vendor_proposals (
  id UUID PRIMARY KEY,
  rfp_id UUID REFERENCES rfps(id),
  vendor_id UUID REFERENCES vendors(id),
  email_subject TEXT,
  email_body_raw TEXT,
  parsed_data JSONB,
  attachments JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

Environment Variables

Create:
backend/.env


Example:

PORT=4000

DATABASE_URL=postgresql://postgres:password@localhost:5432/rfp_db

GROQ_API_KEY=your_groq_api_key_here

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_gmail_here@gmail.com
SMTP_PASS=your_gmail_app_password

EMAIL_FROM="RFP System <your_gmail_here@gmail.com>"

IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your_gmail_here@gmail.com
IMAP_PASS=your_gmail_app_password


Do NOT commit .env
Only commit .env.example

4 Start Backend
npm run dev

Backend will run on:
http://localhost:4000

Frontend Setup
cd ../frontend
npm install
npm run dev

Frontend will run on:
http://localhost:5173

How Email Flow Works
Step 1 — Admin sends RFP email
RFP → Vendor email address via Gmail SMTP.
Step 2 — Vendor replies
Vendor replies with price, delivery time, warranty, etc.
Step 3 — IMAP Service reads inbox
Every 30 seconds:
Checks unread emails
Extracts vendor email, subject, body
Extracts RFP ID from subject
Parses proposal via Groq AI
Saves structured data to DB
Step 4 — Proposal appears in dashboard
Visible under Proposals page.
AI Proposal Comparison
The comparison API uses:
Rule-based scoring:
Price
Delivery time
Warranty

AI-generated recommendation:
Summary
Best vendor suggestion
Accessible at:
/api/comparison/:rfp_id

Testing the System
1. Create RFP from UI
2. Add Vendor
3. Send RFP Email
4. Vendor replies from Gmail
5. IMAP saves proposal
6. View proposals visually
7. Compare proposals
Deployment Notes

Backend can be deployed on:

Render
Railway
AWS EC2
DigitalOcean

Frontend can be deployed on:
Vercel
Netlify
Remember to set environment variables in hosting provider.

Security Notes

.env is ignored
API keys never committed
SMTP uses encrypted Gmail App Password
IMAP uses TLS
Frontend API URL configurable

Author

Shaurya Pandey
AI-Powered Full-Stack RFP Automation System
