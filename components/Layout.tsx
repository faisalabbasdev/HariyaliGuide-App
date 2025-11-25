
import React from 'react';
import { Home, MessageCircle, CloudSun, Settings, BookOpen } from 'lucide-react';
import { Language, UserSettings } from '../types';
import { TRANSLATIONS } from '../constants';
import { Tooltip } from './Tooltip';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: Language;
  settings: UserSettings;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, lang, settings }) => {
  const t = TRANSLATIONS[lang];
  const isRtl = lang === Language.URDU;

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <Tooltip text={label} position="top">
      <button 
        onClick={() => setActiveTab(id)}
        className={`flex flex-col items-center transition-colors duration-200 ${activeTab === id ? 'text-green-700 dark:text-green-400' : 'text-gray-400 dark:text-gray-500 hover:text-green-600'}`}
        aria-label={label}
      >
        <Icon size={24} strokeWidth={activeTab === id ? 2.5 : 2} fill={activeTab === id && id === 'home' ? "currentColor" : "none"} />
        <span className="text-[10px] mt-1 font-medium">{label}</span>
      </button>
    </Tooltip>
  );

  return (
    <div className={settings.theme === 'dark' ? 'dark' : ''}>
        <div className={`flex flex-col h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden text-gray-900 dark:text-white transition-colors duration-300 ${isRtl ? 'font-urdu' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar pb-24">
            {children}
        </main>

        {/* Bottom Navigation - Glassmorphism */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-green-100 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-6 py-2 z-50 rounded-t-3xl pb-safe">
            <div className="flex justify-between items-end">
            <NavItem id="home" icon={Home} label={t.home} />
            <NavItem id="weather" icon={CloudSun} label={t.weather} />
            
            {/* Floating Action Button Space */}
            <div className="w-16"></div>

            <NavItem id="guide" icon={BookOpen} label={t.guide} />
            <NavItem id="settings" icon={Settings} label={t.settings} />
            </div>

            {/* Floating Action Button for Chat - Centered and Elevated */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <Tooltip text={t.chat} position="top">
                <button 
                onClick={() => setActiveTab('chat')}
                className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-600/30 border-4 border-green-50/50 dark:border-gray-800 text-white transform transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label={t.chat}
                >
                <MessageCircle size={32} fill="currentColor" />
                </button>
            </Tooltip>
            </div>
        </div>
        </div>
    </div>
  );
};