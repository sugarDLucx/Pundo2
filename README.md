# Pundo 2.0

> "True wealth isn't measured in numbers, but in the moments we share."

Pundo 2.0 is a premium, beautifully designed Personal Finance Application rebuilt from the ground up using Next.js 14. Designed exclusively for managing finances and shared milestones together, Pundo offers a luxurious interface to track transactions, set financial goals, and monitor your fiscal health.

## ✨ Features

- **Luxe Dashboard**: Drag-and-drop widget layout, beautifully animated Recharts, and quick summaries.
- **Transactions Management**: Track income and expenses with detailed categorizations, inline forms, and clean data tables.
- **Goal Tracking**: Create shared milestones with fully animated Framer Motion progress bars. Adding funds to a goal automatically logs a savings transaction!
- **Interactive Avatar Uploads**: Seamlessly upload profile pictures directly to the cloud.
- **Secure Authentication**: Powered by Supabase Auth and Row Level Security (RLS).
- **Glassmorphism Design**: Custom Next.js UI using Tailwind CSS with a Royal Plum & Champagne Gold aesthetic.

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
3. In the Vercel dashboard, go to the project settings and add your Environment Variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Click Deploy!
