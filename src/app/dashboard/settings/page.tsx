/* eslint-disable */
"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useNotificationStore } from '@/store/notificationStore';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  User, 
  ShieldCheck, 
  Bell, 
  Settings2,
  Camera,
  Loader2,
  Save,
  RefreshCw,
  ChevronDown,
  History,
  MonitorSmartphone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Modal } from '@/components/ui/modal';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';

export default function SettingsPage() {
  const { session, changePassword, fetchLoginHistory, loginHistory } = useAuthStore();
  const { profile, updateProfile, loading: profileLoading, uploadAvatar } = useProfileStore();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [activeSection, setActiveSection] = useState('profile');
  
  // Local state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('English (United States)');
  const [currency, setCurrency] = useState('₱');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Security state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const [showLoginHistoryModal, setShowLoginHistoryModal] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange } = useImageUpload({
    onUpload: async (url, file) => {
      setUploadingAvatar(true);
      try {
        await uploadAvatar(file);
        addNotification('Avatar Updated', 'Your profile picture has been updated.', 'success');
      } catch (err: any) {
        addNotification('Upload Failed', err.message, 'error');
      } finally {
        setUploadingAvatar(false);
      }
    }
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone_number || '');
      setLanguage(profile.language || 'English (United States)');
      setCurrency(profile.currency || '₱');
      setEmailNotifs(profile.email_notifications ?? true);
    }
  }, [profile]);

  useEffect(() => {
    fetchLoginHistory();
  }, [fetchLoginHistory]);

  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      let active = '';
      let maxVisible = 0;
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxVisible) {
          active = entry.target.id;
          maxVisible = entry.intersectionRatio;
        }
      });
      if (active) setActiveSection(active);
    };
    
    observer.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    const sections = ['profile', 'security', 'notifications', 'preferences'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.current?.observe(el);
    });

    return () => {
      observer.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({
        full_name: fullName,
        phone_number: phone,
        language,
        currency,
        email_notifications: emailNotifs
      });
      addNotification('Settings Saved', 'Your profile has been updated.', 'success');
    } catch (e: any) {
      addNotification('Error', 'Failed to save settings: ' + e.message, 'error');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    try {
      await changePassword(oldPassword, newPassword);
      setPasswordMsg({ type: 'success', text: 'Password updated successfully.' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      setPasswordMsg({ type: 'error', text: 'Error updating password: ' + e.message });
    }
  };

  const { t } = useLanguage();

  const menuItems = [
    { id: 'profile', label: t('Profile Information'), icon: User },
    { id: 'security', label: t('Security'), icon: ShieldCheck },
    { id: 'notifications', label: t('Notifications'), icon: Bell },
    { id: 'preferences', label: t('Preferences'), icon: Settings2 },
  ];

  const inputClass = "flex h-11 w-full rounded-md border border-border/40 bg-surface/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">
      <header className="mb-8">
        <h2 className="font-playfair text-4xl font-bold text-primary tracking-tight">{t("Settings")}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{t("Manage your account preferences, security, and notifications.")}</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 flex-1 pb-32 items-start">
        <aside className="w-full lg:w-64 flex-shrink-0 z-10 lg:sticky lg:top-24 pt-2 pb-2 lg:p-0">
          <nav className="bg-surface/50 border border-border/40 lg:rounded-2xl shadow-sm lg:p-3 -mx-4 px-4 lg:mx-0 overflow-x-auto no-scrollbar backdrop-blur-md">
            <ul className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1 w-max lg:w-auto py-3 lg:py-0">
              {menuItems.map(item => (
                <li key={item.id} className="shrink-0">
                  <button
                    onClick={() => handleScrollTo(item.id)}
                    className={cn(
                      "flex w-full items-center space-x-2 lg:space-x-3 px-4 py-2.5 lg:py-3 rounded-full lg:rounded-xl text-sm font-medium transition-all duration-200",
                      activeSection === item.id 
                        ? "bg-primary text-primary-foreground shadow-md scale-[1.02]" 
                        : "text-muted-foreground hover:bg-border/40 hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="flex-1 space-y-12">
          
          {/* Profile Section */}
          <Card id="profile" className="p-6 md:p-8 scroll-mt-24 bg-surface/30">
            <div className="mb-8 border-b border-border/40 pb-4">
              <h2 className="font-playfair text-2xl font-bold text-foreground">{t("Profile Information")}</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
              <div className="flex flex-col items-center space-y-4">
                <div 
                  className="w-28 h-28 rounded-full bg-primary/10 border-4 border-surface shadow-md overflow-hidden relative group cursor-pointer transition-transform hover:scale-105" 
                  onClick={handleThumbnailClick}
                >
                  {uploadingAvatar ? (
                    <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary">
                      <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                  ) : previewUrl || profile?.avatar_url ? (
                    <Image src={previewUrl || profile?.avatar_url || ''} alt="Avatar" fill className="object-cover" unoptimized={!!previewUrl} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <label htmlFor="avatar-upload" className="sr-only">Upload Avatar</label>
                <input 
                  id="avatar-upload"
                  name="avatar-upload"
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">{t("Full Name")}</label>
                  <input id="fullName" name="fullName" autoComplete="name" className={inputClass} type="text" value={fullName} onChange={e => setFullName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">{t("Email")}</label>
                  <input id="email" name="email" className={cn(inputClass, "opacity-60 cursor-not-allowed")} type="email" value={session?.user.email || ''} disabled />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="phone" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">{t("Phone Number")}</label>
                  <input id="phone" name="phone" autoComplete="tel" className={inputClass} type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
            </div>
          </Card>

          {/* Security Section */}
          <Card id="security" className="p-6 md:p-8 scroll-mt-24 bg-surface/30">
            <div className="mb-8 border-b border-border/40 pb-4">
              <h2 className="font-playfair text-2xl font-bold text-foreground">{t("Security")}</h2>
            </div>
            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <label htmlFor="oldPassword" className="sr-only">{t("Current Password")}</label>
                <input id="oldPassword" name="oldPassword" autoComplete="current-password" type="password" placeholder={t("Current Password")} value={oldPassword} onChange={e => setOldPassword(e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label htmlFor="newPassword" className="sr-only">{t("New Password")}</label>
                <input id="newPassword" name="newPassword" autoComplete="new-password" type="password" placeholder={t("New Password")} value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="sr-only">{t("Confirm New Password")}</label>
                <input id="confirmPassword" name="confirmPassword" autoComplete="new-password" type="password" placeholder={t("Confirm New Password")} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClass} />
              </div>
              <Button type="submit" className="w-full sm:w-auto mt-2">{t("Change Password")}</Button>
            </form>
            {passwordMsg && (
              <p className={cn("mt-4 text-sm font-medium", passwordMsg.type === 'error' ? "text-destructive" : "text-green-500")}>
                {passwordMsg.text}
              </p>
            )}

            <div className="mt-12 pt-8 border-t border-border/40">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-playfair text-xl font-bold text-foreground flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    {t("Login History")}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{t("Recent sign-in activity on your account.")}</p>
                </div>
                {loginHistory.length > 3 && (
                  <Button variant="outline" size="sm" onClick={() => setShowLoginHistoryModal(true)} className="rounded-full">
                    {t("View All")}
                  </Button>
                )}
              </div>

              {loginHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("No login history available.")}</p>
              ) : (
                <div className="space-y-4">
                  {loginHistory.slice(0, 3).map((log, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-surface/50 border border-border/40">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                        <MonitorSmartphone className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate" title={log.user_agent || 'Unknown Device'}>
                          {log.user_agent || 'Unknown Device'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(log.created_at), 'MMM do, yyyy • h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Notifications Section */}
          <Card id="notifications" className="p-6 md:p-8 scroll-mt-24 bg-surface/30">
            <div className="mb-6 border-b border-border/40 pb-4">
              <h2 className="font-playfair text-2xl font-bold text-foreground">{t("Notifications")}</h2>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-semibold text-foreground">{t("Email Notifications")}</h3>
                <p className="text-sm text-muted-foreground">{t("Receive weekly summaries and goal alerts.")}</p>
              </div>
              <button onClick={() => setEmailNotifs(!emailNotifs)} className={cn("w-12 h-6 rounded-full relative transition-colors duration-200", emailNotifs ? 'bg-primary' : 'bg-border/60')}>
                <span className={cn("absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-sm", emailNotifs ? 'translate-x-6' : 'translate-x-0')} />
              </button>
            </div>
          </Card>

          {/* Preferences Section */}
          <Card id="preferences" className="p-6 md:p-8 scroll-mt-24 bg-surface/30">
            <div className="mb-8 border-b border-border/40 pb-4">
              <h2 className="font-playfair text-2xl font-bold text-foreground">{t("Preferences")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border/40 mb-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">{t("Language")}</label>
                <DropdownMenu>
                  <DropdownMenuTrigger className={cn(inputClass, "flex items-center justify-between hover:bg-surface/70 transition-colors")}>
                    <span className="truncate">{language}</span>
                    <ChevronDown className="w-4 h-4 ml-2 opacity-50 flex-shrink-0" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px] max-h-[300px] overflow-y-auto">
                    <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                      <DropdownMenuRadioItem value="English (United States)">English (United States)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="English (United Kingdom)">English (United Kingdom)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Spanish (Spain)">Spanish (Spain)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="French (France)">French (France)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="German (Germany)">German (Germany)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Japanese (Japan)">Japanese (Japan)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Korean (South Korea)">Korean (South Korea)</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="space-y-2"
              >
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">{t("Base Currency")}</label>
                <DropdownMenu>
                  <DropdownMenuTrigger className={cn(inputClass, "flex items-center justify-between hover:bg-surface/70 transition-colors")}>
                    <span className="truncate">{currency === '₱' ? 'PHP (₱) - Philippine Peso' : currency === '$' ? 'USD ($) - US Dollar' : currency === '€' ? 'EUR (€) - Euro' : currency === '£' ? 'GBP (£) - British Pound' : currency === '¥' ? 'JPY (¥) - Japanese Yen' : currency === 'A$' ? 'AUD (A$) - Australian Dollar' : 'CAD (C$) - Canadian Dollar'}</span>
                    <ChevronDown className="w-4 h-4 ml-2 opacity-50 flex-shrink-0" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px] max-h-[300px] overflow-y-auto">
                    <DropdownMenuRadioGroup value={currency} onValueChange={setCurrency}>
                      <DropdownMenuRadioItem value="₱">PHP (₱) - Philippine Peso</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="$">USD ($) - US Dollar</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="€">EUR (€) - Euro</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="£">GBP (£) - British Pound</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="¥">JPY (¥) - Japanese Yen</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="A$">AUD (A$) - Australian Dollar</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="C$">CAD (C$) - Canadian Dollar</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{t("Dark Mode")}</h3>
                <p className="text-sm text-muted-foreground">{t("Toggle the appearance of the dashboard.")}</p>
              </div>
              {mounted && (
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                  className={cn("w-12 h-6 rounded-full relative transition-colors duration-200", theme === 'dark' ? 'bg-primary' : 'bg-border/60')}
                >
                  <span className={cn("absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-sm", theme === 'dark' ? 'translate-x-6' : 'translate-x-0')} />
                </button>
              )}
            </div>
          </Card>

        </div>
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-0 right-0 w-full lg:w-[calc(100%-16rem)] p-4 bg-background/80 backdrop-blur-xl border-t border-border/40 z-30 flex justify-end">
        <div className="w-full flex justify-end gap-3 px-2 md:px-8">
          <Button 
            variant="outline"
            onClick={() => {
              if (profile) {
                setFullName(profile.full_name || '');
                setPhone(profile.phone_number || '');
                setLanguage(profile.language || 'English (United States)');
                setCurrency(profile.currency || '₱');
                setEmailNotifs(profile.email_notifications ?? true);
              }
            }}
            className="rounded-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("Reset")}
          </Button>
          <Button 
            onClick={handleUpdateProfile}
            disabled={profileLoading}
            className="rounded-full px-6 shadow-lg"
          >
            {profileLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {profileLoading ? 'Saving...' : t("Save Changes")}
          </Button>
        </div>
      </div>

      <Modal 
        isOpen={showLoginHistoryModal} 
        onClose={() => setShowLoginHistoryModal(false)}
        title={t("All Login History")}
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
          {loginHistory.map((log, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-surface/50 border border-border/40">
              <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                <MonitorSmartphone className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate" title={log.user_agent || 'Unknown Device'}>
                  {log.user_agent || 'Unknown Device'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(log.created_at), 'MMM do, yyyy • h:mm a')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

