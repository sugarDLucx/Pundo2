import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
});

import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: '#420093', // Royal Plum
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Pundo - Our Future, Managed Together",
  description: "Your exclusive financial dashboard for tracking shared milestones, date night reserves, and securing your future.",
  keywords: ["personal finance", "wealth management", "couples finance", "budgeting", "goals tracking"],
  authors: [{ name: "BÇŽobÃ¨i" }],
  openGraph: {
    title: "Pundo - Our Future, Managed Together",
    description: "Your exclusive financial dashboard for tracking shared milestones.",
    url: "https://pundo2.vercel.app",
    siteName: "Pundo",
    images: [
      {
        url: "/og-image.png", // Placeholder for when they add an OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, playfair.variable, "min-h-screen bg-background font-sans antialiased")}>
        {children}
      </body>
    </html>
  );
}

