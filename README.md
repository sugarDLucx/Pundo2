# Pundo 2.0

> "True wealth isn't measured in numbers, but in the moments we share."

Pundo 2.0 is a premium, beautifully designed Personal Finance Application rebuilt from the ground up using Next.js 14. Designed exclusively for managing finances and shared milestones together, Pundo offers a luxurious interface to track transactions, set financial goals, and monitor your fiscal health.

## ✨ Features

- **Luxe Dashboard**: Drag-and-drop widget layout, beautifully animated Recharts, and quick summaries.
- **Transactions Management**: Track income and expenses with detailed categorizations, inline forms, and clean data tables.
- **Goal Tracking & Unsplash Covers**: Create shared milestones with fully animated Framer Motion progress bars, customizable with stunning HD cover images powered by the **Unsplash API**. Adding funds to a goal automatically logs a savings transaction!
- **Automated Email Triggers**: Receive congratulatory emails straight to your inbox via the **Resend API** whenever you reach your savings targets.
- **Investments Tab**: Real-time market data tracking and searchable asset lookups powered by **yahoo-finance2**.
- **Daily Inspiration**: Start your day right with a daily financial/motivational quote powered by the **ZenQuotes API**.
- **Interactive Avatar Uploads**: Seamlessly upload profile pictures directly to the cloud.
- **Secure Authentication**: Powered by Supabase Auth and Row Level Security (RLS).
- **Glassmorphism Design & Dark Mode**: Custom Next.js UI using Tailwind CSS with a Royal Plum & Champagne Gold aesthetic. Fully supports dynamic **Light/Dark Mode** toggling via `next-themes`.

## 🚀 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Charts:** [Recharts](https://recharts.org/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Backend/Database:** [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🛠️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/sugarDLucx/Pundo2.git
cd Pundo2
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root of the project and add your Supabase credentials. Do not commit this file.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Third-party Integrations
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
RESEND_API_KEY=your_resend_api_key
```

*Note: Ensure your Supabase instance has the required tables created (`transactions`, `goals`, `profiles`, etc.) and the `avatars` storage bucket configured to public.*

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚢 Deployment (Vercel)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).
1. Push this repository to GitHub.
2. Import the project into Vercel.
3. In the Vercel dashboard, go to the project settings and add your Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `UNSPLASH_ACCESS_KEY`, `RESEND_API_KEY`).
4. Click Deploy!
