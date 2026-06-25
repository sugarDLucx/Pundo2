"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";
import { useLanguage } from "@/components/providers/LanguageProvider";
import Image from "next/image";
import { LayoutDashboard, ArrowLeftRight, Target, TrendingUp, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationsPopover } from "./NotificationsPopover";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
  { name: "Goals", href: "/dashboard/goals", icon: Target },
  { name: "Investments", href: "/dashboard/investments", icon: TrendingUp },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuthStore();
  const { profile } = useProfileStore();
  const { t } = useLanguage();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/sign-in');
  };

  return (
    <aside className="hidden w-64 flex-col border-r border-border/40 bg-surface/80 backdrop-blur-xl shadow-sm fixed left-0 top-0 h-screen z-20 md:flex">
      <div className="flex flex-col h-full py-6 px-4">
        <div className="flex items-center justify-between px-4 mb-10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden border-2 border-surface shrink-0 relative">
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="User Avatar" fill className="object-cover" />
              ) : (
                <Image src="/logo.png" alt="Pundo Logo" fill className="object-contain p-1" />
              )}
            </div>
            <div className="overflow-hidden">
              <h1 className="font-playfair text-lg font-bold text-primary tracking-tight truncate">
                {profile?.full_name || "Pundo"}
              </h1>
              <p className="text-xs text-foreground/60 truncate">Your Wealth, Curated.</p>
            </div>
          </div>
          <NotificationsPopover />
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                  isActive
                    ? "text-primary font-bold border-r-4 border-primary bg-primary/5 scale-[0.98]"
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-foreground/60")} />
                <span>{t(item.name)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-border/40">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors text-sm font-medium mt-2"
          >
            <LogOut className="h-5 w-5" />
            <span>{t("Log out")}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
