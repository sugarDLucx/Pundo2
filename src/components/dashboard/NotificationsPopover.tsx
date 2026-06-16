"use client";

import { useNotificationStore } from "@/store/notificationStore";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Bell, Check, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function NotificationsPopover() {
  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const { t } = useLanguage();
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 text-foreground/70 hover:text-foreground hover:bg-surface/50 rounded-full transition-colors flex-shrink-0">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[400px] overflow-hidden p-0 flex flex-col bg-background/95 backdrop-blur-xl border-border/40 shadow-xl">
        <div className="p-4 border-b border-border/40 sticky top-0 bg-surface/50 z-10 flex justify-between items-center">
          <span className="font-semibold">{t("Notifications")}</span>
          {unreadCount > 0 && (
            <button 
              onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
              className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1 font-medium"
            >
              <Check className="w-3 h-3" /> Mark all read
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
              <Bell className="w-8 h-8 opacity-20" />
              <span>{t("No notifications yet")}</span>
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={cn(
                  "p-4 border-b border-border/20 last:border-0 transition-colors cursor-pointer flex gap-3",
                  !notif.is_read ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-surface/50'
                )}
                onClick={() => {
                  markAsRead(notif.id);
                  setSelectedNotification(notif);
                }}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h4 className={cn("text-sm font-semibold truncate", !notif.is_read ? 'text-foreground' : 'text-foreground/80')}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                      {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className={cn("text-xs leading-relaxed", !notif.is_read ? 'text-foreground/80' : 'text-muted-foreground')}>
                    {notif.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
      
      <Modal 
        isOpen={!!selectedNotification} 
        onClose={() => setSelectedNotification(null)}
        title={selectedNotification?.title || t("Notification")}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-muted-foreground mb-2 pb-4 border-b border-border/40">
            {selectedNotification && getIcon(selectedNotification.type)}
            <span className="text-sm font-medium">
              {selectedNotification && formatDistanceToNow(new Date(selectedNotification.created_at), { addSuffix: true })}
            </span>
          </div>
          <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap">
            {selectedNotification?.message}
          </p>
        </div>
      </Modal>
    </DropdownMenu>
  );
}
