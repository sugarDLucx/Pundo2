import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { AIChatbot } from "@/components/AIChatbot";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground font-sans antialiased">
        <Sidebar />
        <MobileNav />
        <div className="flex flex-1 flex-col overflow-hidden md:ml-64">
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 relative">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
        <AIChatbot />
      </div>
    </LanguageProvider>
  );
}
