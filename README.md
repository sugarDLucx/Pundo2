# Pundo V2.1.0

> "True wealth isn't measured in numbers, but in the moments we share."

Pundo V2.1.0 is a premium, beautifully designed Personal Finance Application built with Next.js 14. Designed exclusively for managing finances, setting milestones, and gaining intelligent insights, Pundo offers a luxurious interface to track transactions, set financial goals, and monitor your fiscal health.

## ✨ What's New in V2.1.0 (The Major Update)

- **🤖 AI Financial Assistant**: An integrated Google Gemini-powered AI Chatbot that lives right in your dashboard to help you curate your wealth, analyze your budget, and guide you through the app.
- **🛡️ Invisible Captcha**: Cloudflare Turnstile integration ensures absolute security during Sign-In and Sign-Up without annoying traffic-light puzzles.
- **✉️ Weekly Financial Summary**: Automated cron jobs send out beautifully crafted email summaries every Sunday detailing your week's income, expenses, and net flow.
- **🔐 Login History UI**: Track your active sessions and device history directly from your Security Settings.
- **🌍 Complete Localization (i18n)**: 100% of the dashboard is fully translatable. Switch between English, Spanish, Tagalog, and more seamlessly without reloading the page.

## Core Features

- **Luxe Dashboard**: Drag-and-drop widget layout, beautifully animated Recharts, and quick summaries.
- **Global Localization & Currency**: Real-time currency conversion across the whole app. Choose your native currency (₱, €, £, ¥, etc.) and watch the entire app adapt.
- **Investments Tab**: Real-time market data tracking and searchable asset lookups powered by **yahoo-finance2**. Automatically converts global US stock prices into your chosen base currency using live exchange rates!
- **Goal Tracking & Unsplash Covers**: Create shared milestones with fully animated progress bars, customizable with stunning HD cover images powered by the **Unsplash API**.
- **Automated Email Triggers**: Receive beautiful HTML emails via **Nodemailer (Gmail SMTP)** for goal completions and weekly summaries.
- **Transactions Management**: Track income and expenses with detailed categorizations, inline forms, and clean data tables.
- **Interactive Settings**: Seamlessly upload profile pictures directly to the Supabase cloud. Manage your security, preferences, and notifications.
- **Secure Authentication**: Powered by Supabase Auth and Row Level Security (RLS).

## 🚀 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/docs) + Google Gemini
- **Security:** Cloudflare Turnstile
- **Backend/Database:** [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)

## 🛠️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/sugarDLucx/Pundo.git
cd pundo-next
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root of the project.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key # Required for Weekly Email Cron Jobs

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key

# Google AI
GOOGLE_API_KEY=your_gemini_api_key

# Third-party APIs
UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# Nodemailer / Gmail SMTP (Requires Gmail App Password)
GMAIL_USER=your_gmail_address
GMAIL_APP_PASSWORD=your_gmail_app_password

# Vercel Cron
CRON_SECRET=your_custom_cron_secret
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚢 Deployment (Vercel)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).
1. Import the project into Vercel.
2. In the Vercel dashboard, add all the Environment Variables listed above.
3. Vercel will automatically detect `vercel.json` and set up the Weekly Summary Cron Job.
4. Click Deploy!
