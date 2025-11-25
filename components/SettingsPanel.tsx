import React from 'react';
import { Info, Volume2, VolumeX, Zap, ZapOff, Video, VideoOff, Type, Moon, Sun } from 'lucide-react';
import { UserSettings, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { audioService } from '../services/audioService';

interface SettingsPanelProps {
  settings: UserSettings;
  setSettings: (s: UserSettings) => void;
  lang: Language;
  setLang: (l: Language) => void;
  fontSizeClass: string;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, setSettings, lang, setLang, fontSizeClass }) => {
  const t = TRANSLATIONS[lang];

  const toggleSetting = (key: keyof UserSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    if (key === 'soundEnabled' || key === 'hapticsEnabled') {
       audioService.setSettings(newSettings.soundEnabled, newSettings.hapticsEnabled);
    }
    audioService.playClick();
    if (key === 'hapticsEnabled' && newSettings.hapticsEnabled) {
        audioService.triggerHaptic();
    }
  };

  const setFontSize = (size: 'small' | 'medium' | 'large') => {
      setSettings({ ...settings, fontSize: size });
      audioService.playClick();
  };

  const setTheme = (theme: 'light' | 'dark') => {
      setSettings({ ...settings, theme: theme });
      audioService.playClick();
  };

  // Switch component fixed for RTL: forces dir="ltr" on the button mechanism
  const Switch = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) => (
    <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
            {icon}
            <span className={`font-medium ${fontSizeClass}`}>{label}</span>
        </div>
        <button 
            onClick={onClick}
            dir="ltr" 
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out flex items-center ${active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
        >
            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
    </div>
  );

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right duration-300 pb-32">
       <h1 className={`font-bold text-gray-900 dark:text-white ${fontSizeClass === 'text-xl' ? 'text-3xl' : 'text-2xl'}`}>{t.settings}</h1>
       
       {/* Language */}
       <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-50 dark:border-gray-700">
             <h3 className={`font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 ${fontSizeClass}`}>
                <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                {t.language}
             </h3>
             <div className="flex gap-3">
                <button 
                   onClick={() => { audioService.playClick(); setLang(Language.ENGLISH); }}
                   className={`flex-1 py-3 rounded-xl font-bold transition-all ${fontSizeClass} ${lang === Language.ENGLISH ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                   English
                </button>
                <button 
                   onClick={() => { audioService.playClick(); setLang(Language.URDU); }}
                   className={`flex-1 py-3 rounded-xl font-bold font-urdu transition-all ${fontSizeClass} ${lang === Language.URDU ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                   اردو
                </button>
             </div>
          </div>

          {/* Appearance (Theme) */}
          <div className="p-6 border-b border-gray-50 dark:border-gray-700">
             <h3 className={`font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 ${fontSizeClass}`}>
                <Sun size={20} className="text-gray-500 dark:text-gray-400" />
                {t.theme}
             </h3>
             <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                 <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${fontSizeClass} ${settings.theme === 'light' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 dark:text-gray-300'}`}
                 >
                    <Sun size={16} /> Light
                 </button>
                 <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${fontSizeClass} ${settings.theme === 'dark' ? 'bg-gray-600 text-white shadow-sm' : 'text-gray-500 dark:text-gray-300'}`}
                 >
                    <Moon size={16} /> Dark
                 </button>
             </div>
          </div>

          {/* UX Controls */}
          <div className="p-6 space-y-4 border-b border-gray-50 dark:border-gray-700">
             <Switch 
                active={settings.soundEnabled} 
                onClick={() => toggleSetting('soundEnabled')} 
                label={t.soundEffects} 
                icon={settings.soundEnabled ? <Volume2 className="text-green-600"/> : <VolumeX className="text-gray-400"/>} 
             />

             <Switch 
                active={settings.hapticsEnabled} 
                onClick={() => toggleSetting('hapticsEnabled')} 
                label={t.hapticFeedback} 
                icon={settings.hapticsEnabled ? <Zap className="text-orange-500"/> : <ZapOff className="text-gray-400"/>} 
             />

             <Switch 
                active={settings.videoEnabled} 
                onClick={() => toggleSetting('videoEnabled')} 
                label={t.bgVideo} 
                icon={settings.videoEnabled ? <Video className="text-blue-500"/> : <VideoOff className="text-gray-400"/>} 
             />
          </div>

          {/* Font Size */}
          <div className="p-6 border-b border-gray-50 dark:border-gray-700">
              <h3 className={`font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 ${fontSizeClass}`}>
                 <Type size={20} className="text-gray-500 dark:text-gray-400" />
                 {t.fontSize}
              </h3>
              <div className="flex justify-between bg-gray-100 dark:bg-gray-700 rounded-xl p-1 gap-2">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`flex-1 py-2 rounded-lg font-medium transition-all ${fontSizeClass} ${settings.fontSize === size ? 'bg-white dark:bg-gray-600 text-green-700 dark:text-white shadow-sm ring-1 ring-black/5' : 'text-gray-500 dark:text-gray-400'}`}
                      >
                          {t[size]}
                      </button>
                  ))}
              </div>
          </div>
          
          {/* About */}
          <div className="p-6">
              <h3 className={`font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 ${fontSizeClass}`}>
                 <Info size={20} className="text-gray-400" />
                 {t.about}
              </h3>
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-2xl border border-green-100 dark:border-green-800">
                <p className={`text-green-800 dark:text-green-300 leading-relaxed font-medium ${fontSizeClass}`}>
                    HariyaliGuide v2.5 Pro
                </p>
                <p className={`text-green-600 dark:text-green-400 mt-1 ${fontSizeClass === 'text-xl' ? 'text-base' : 'text-xs'}`}>
                    AI-Powered Agricultural Assistant designed for modern farming.
                </p>
              </div>
          </div>
       </div>
    </div>
  );
};