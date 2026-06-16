"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";
import { useLanguage } from "@/components/providers/LanguageProvider";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard, ArrowLeftRight, Target, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationsPopover } from "./NotificationsPopover";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
  { name: "Goals", href: "/dashboard/goals", icon: Target },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function MobileNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = useAuthStore();
  const { profile } = useProfileStore();
  const router = useRouter();
  const { t } = useLanguage();

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await signOut();
    router.push('/sign-in');
  };

  return (
    <>
      <nav className="md:hidden w-full h-16 sticky top-0 z-50 bg-surface shadow-md flex justify-between items-center px-4 border-b border-border/40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden border-2 border-surface shrink-0 relative">
            {profile?.avatar_url ? (
              <Image src={profile.avatar_url} alt="User Avatar" fill className="object-cover" />
            ) : (
              <Image src="/logo.png" alt="Pundo Logo" fill className="object-contain p-0.5" />
            )}
          </div>
          <span className="font-playfair text-lg font-bold text-foreground tracking-tight truncate">
            {profile?.full_name || "Pundo"}
          </span>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <NotificationsPopover />
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-2 relative z-50 text-muted-foreground hover:text-foreground transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-x-0 top-16 z-40 bg-surface/95 text-foreground backdrop-blur-xl border-b border-border/40 shadow-lg"
            >
              <div className="flex flex-col p-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium",
                        isActive
                          ? "text-primary-foreground font-bold bg-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-surface"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                      <span>{t(item.name)}</span>
                    </Link>
                  );
                })}
                <div className="pt-2 mt-2 border-t border-border/40">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors text-sm font-medium"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
