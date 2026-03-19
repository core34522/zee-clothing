# ZEE CLOTHING — Full Setup Guide

## What's Included
- Homepage with cart + live chat
- Signup with OTP email verification
- Login (Email + Google)
- Forgot Password
- User Account Dashboard
- Checkout with Opay/PalmPay bank transfer
- Admin Panel (add products, manage orders, customers, chats)
- Firestore Security Rules

## Step 1 — Replace Firebase Config
Open `js/firebase-config.js` and replace all YOUR_... values with your real Firebase credentials.

## Step 2 — Set Up EmailJS (for OTP emails — FREE)
1. Go to https://emailjs.com and create a free account
2. Create an Email Service (Gmail recommended)
3. Create an Email Template with these variables:
   - {{to_email}} — recipient email
   - {{to_name}} — customer name
   - {{otp_code}} — the 6-digit code
   - {{brand}} — ZEE CLOTHING
4. Open `js/auth.js` and replace:
   - YOUR_EMAILJS_SERVICE_ID
   - YOUR_EMAILJS_TEMPLATE_ID
   - YOUR_EMAILJS_PUBLIC_KEY

## Step 3 — Update Bank Details
Open `pages/checkout.html` and find:
- Account Number: 8012345678 → replace with your real OPay/PalmPay number
- Account Name: ZEE CLOTHING → replace with your real name

## Step 4 — Update Firestore Rules
In Firebase Console → Firestore → Rules, paste the contents of firestore.rules

## Step 5 — Deploy to Netlify
1. Drag the entire zee-full folder to netlify.com
2. Your site is live!

## Admin Access
1. Sign up on your site normally
2. Go to Firestore → users → your document
3. Change role from "customer" to "admin"
4. Visit yoursite.com/admin/ to access the admin panel

## Folder Structure
```
zee-full/
├── index.html          ← Homepage
├── firestore.rules     ← Paste into Firebase Rules
├── css/
│   └── main.css        ← All styles
├── js/
│   ├── firebase-config.js  ← YOUR KEYS GO HERE
│   ├── auth.js             ← All auth functions
│   ├── store.js            ← Products & orders
│   └── cart.js             ← Cart management
├── pages/
│   ├── login.html
│   ├── signup.html         ← Has OTP verification
│   ├── forgot-password.html
│   ├── checkout.html       ← Opay/PalmPay transfer
│   └── account.html        ← User dashboard
└── admin/
    └── index.html          ← Admin panel
```
