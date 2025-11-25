import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { WeatherWidget } from './components/WeatherWidget';
import { Message, Sender, Language, WeatherData, CropType, UserSettings } from './types';
import { TRANSLATIONS, FARMER_GUIDE_DATA } from './constants';
import { fetchWeather, getCurrentLocation } from './services/weatherService';
import { analyzeCropWithGemini } from './services/geminiService';
import { ImageIcon, Mic, Send, Loader2, X, Leaf, BookOpen, ChevronUp, ChevronDown, Droplet, Sprout, Bug, TrendingUp, Calendar, Sun, CloudRain } from 'lucide-react';
import { Tooltip } from './components/Tooltip';
import { audioService } from './services/audioService';
import { VideoBackground } from './components/VideoBackground';
import { ChatInterface } from './components/ChatInterface';
import { SettingsPanel } from './components/SettingsPanel';

const App = () => {
  // --- Global State ---
  const [activeTab, setActiveTab] = useState('splash');
  const [lang, setLang] = useState<Language>(Language.URDU);
  const [settings, setSettings] = useState<UserSettings>({
    soundEnabled: true,
    hapticsEnabled: true,
    videoEnabled: true,
    fontSize: 'medium',
    theme: 'light'
  });

  // Font size mapping for Guide (More distinct values)
  const fontSizeClass = {
    small: 'text-sm',    // 14px
    medium: 'text-base', // 16px
    large: 'text-xl'     // 20px (Significantly larger)
  }[settings.fontSize];

  // --- Data State ---
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Guide State
  const [selectedCrop, setSelectedCrop] = useState<CropType | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // --- Initialization ---

  useEffect(() => {
    // Load Settings from local storage
    const savedSettings = localStorage.getItem('hariyali_settings');
    if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        // Ensure new props exist if loading old config
        setSettings({ ...settings, ...parsed });
        audioService.setSettings(parsed.soundEnabled, parsed.hapticsEnabled);
    }

    const timer = setTimeout(() => {
      setActiveTab('language-select');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Save settings on change
  useEffect(() => {
      localStorage.setItem('hariyali_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (activeTab === 'home' || activeTab === 'weather') {
      loadWeather();
    }
  }, [activeTab]);

  // --- Handlers ---

  const handleTabChange = (tab: string) => {
    audioService.playClick();
    setActiveTab(tab);
  };

  const loadWeather = async () => {
    if (weather && (Date.now() - weather.timestamp < 3600000)) return; 
    
    setWeatherLoading(true);
    try {
      const loc = await getCurrentLocation();
      const data = await fetchWeather(loc.lat, loc.lon);
      setWeather(data);
    } catch (e) {
      console.error(e);
      const cached = localStorage.getItem('hariyali_weather_cache');
      if (cached) {
         setWeather(JSON.parse(cached));
      } else {
         setWeather({
            temperature: 30,
            condition: "Clear",
            humidity: 40,
            windSpeed: 10,
            isDay: true,
            code: 0,
            timestamp: Date.now(),
            daily: []
         });
      }
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleSendMessage = async (text: string, image?: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      text: text,
      sender: Sender.USER,
      timestamp: new Date(),
      image: image,
      status: 'sending'
    };

    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const analysis = await analyzeCropWithGemini(userMsg.text, lang, userMsg.image);
      
      // Update user msg status
      setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: 'sent' } : m));

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: lang === Language.URDU ? "تجزیہ کا نتیجہ:" : "Analysis Result:",
        sender: Sender.BOT,
        timestamp: new Date(),
        isAnalysis: true,
        structuredData: analysis
      };
      audioService.triggerHaptic([10, 50, 10]); // Success vibe
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: 'error' } : m));
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: lang === Language.URDU ? "معذرت، کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔" : "Sorry, error occurred. Please try again.",
        sender: Sender.BOT,
        timestamp: new Date()
      };
      audioService.triggerHaptic([50, 100, 50]); // Error vibe
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      audioService.triggerHaptic();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(',')[1];
            
            const userMsg: Message = {
                id: Date.now().toString(),
                text: lang === Language.URDU ? "🎤 صوتی پیغام" : "🎤 Voice Message",
                sender: Sender.USER,
                timestamp: new Date(),
                status: 'sending'
            };
            setMessages(prev => [...prev, userMsg]);
            setIsProcessing(true);

            try {
                 const analysis = await analyzeCropWithGemini("Voice message", lang, undefined, base64Audio);
                 setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: 'sent' } : m));
                 const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "Analysis Result",
                    sender: Sender.BOT,
                    timestamp: new Date(),
                    isAnalysis: true,
                    structuredData: analysis
                };
                audioService.triggerHaptic([10, 50, 10]);
                setMessages(prev => [...prev, botMsg]);
            } catch (error) {
                setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: 'error' } : m));
            } finally {
                setIsProcessing(false);
            }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
      alert("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      audioService.triggerHaptic();
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // --- UI Render Helpers ---

  const t = TRANSLATIONS[lang];

  const renderGuideContent = () => {
    const guideData = FARMER_GUIDE_DATA[lang];

    if (selectedCrop) {
       const cropData = guideData.find(c => c.id === selectedCrop);
       if (!cropData) return null;

       const categories = [
          { key: 'irrigation', icon: Droplet, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30' },
          { key: 'nutrition', icon: Sprout, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/30' },
          { key: 'protection', icon: Bug, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/30' },
          { key: 'yield', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/30' },
       ];

       return (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
             <button onClick={() => { audioService.playClick(); setSelectedCrop(null); }} className={`flex items-center text-green-700 dark:text-green-400 font-medium mb-4 hover:underline ${fontSizeClass}`}>
                {lang === Language.URDU ? '← واپس' : '← Back'}
             </button>
             
             <div className="bg-green-600 text-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
                 <span className="text-4xl">{cropData.icon}</span>
                 <h2 className="text-2xl font-bold">{cropData.name}</h2>
             </div>

             <div className="space-y-3">
                {categories.map((cat) => {
                   const section = cropData.categories[cat.key as keyof typeof cropData.categories];
                   const isOpen = expandedCategory === cat.key;
                   const Icon = cat.icon;

                   return (
                      <div key={cat.key} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                         <button 
                            onClick={() => { audioService.playClick(); setExpandedCategory(isOpen ? null : cat.key); }}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                         >
                            <div className="flex items-center gap-3">
                               <div className={`p-2 rounded-lg ${cat.bg}`}>
                                  <Icon size={20} className={cat.color} />
                               </div>
                               <span className={`font-semibold text-gray-700 dark:text-gray-200 ${fontSizeClass}`}>{t[cat.key as keyof typeof t]}</span>
                            </div>
                            {isOpen ? <ChevronUp size={20} className="text-gray-400"/> : <ChevronDown size={20} className="text-gray-400"/>}
                         </button>
                         {isOpen && (
                            <div className="p-4 pt-0 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
                               <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 mt-2">{section.title}</h4>
                               <ul className="space-y-2">
                                  {section.content.map((line, i) => (
                                     <li key={i} className={`flex items-start gap-2 text-gray-700 dark:text-gray-300 leading-relaxed ${fontSizeClass} ${lang === Language.URDU ? 'font-urdu leading-loose' : ''}`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></span>
                                        <span>{line}</span>
                                     </li>
                                  ))}
                               </ul>
                            </div>
                         )}
                      </div>
                   );
                })}
             </div>
          </div>
       );
    }

    return (
       <div className="grid grid-cols-2 gap-4">
          {guideData.map((crop) => (
             <button 
                key={crop.id}
                onClick={() => { audioService.playClick(); setSelectedCrop(crop.id); }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-green-50 dark:border-gray-700 hover:border-green-200 hover:shadow-md transition-all flex flex-col items-center gap-3 text-center group"
             >
                <span className="text-4xl transform group-hover:scale-110 transition-transform duration-200">{crop.icon}</span>
                <span className={`font-bold text-gray-800 dark:text-gray-100 ${fontSizeClass}`}>{crop.name}</span>
             </button>
          ))}
       </div>
    );
  };

  // --- Views ---

  if (activeTab === 'splash') {
    return (
      <div className="h-screen bg-gradient-to-b from-green-600 to-emerald-800 flex flex-col items-center justify-center text-white relative overflow-hidden">
        <VideoBackground enabled={settings.videoEnabled} />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 z-10"></div>
        <div className="relative z-20 flex flex-col items-center animate-in zoom-in duration-700">
            <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm mb-6 shadow-xl border border-white/20">
                <Leaf size={64} className="text-white animate-pulse" fill="currentColor" fillOpacity={0.5} />
            </div>
            <h1 className="text-5xl font-bold font-urdu mb-2 drop-shadow-md">ہریالی گائیڈ</h1>
            <h2 className="text-xl font-medium tracking-widest uppercase opacity-80">HariyaliGuide</h2>
        </div>
      </div>
    );
  }

  if (activeTab === 'language-select') {
    return (
      <div className="h-screen bg-green-50 dark:bg-gray-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <VideoBackground enabled={settings.videoEnabled} />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-green-200 dark:bg-green-900 rounded-full blur-3xl opacity-50 z-10"></div>
        
        <div className="text-center mb-10 relative z-20">
            <div className="inline-block p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-lg mb-6">
                <Leaf size={40} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className={`font-bold text-green-900 dark:text-green-100 bg-white/50 dark:bg-gray-800/50 px-4 py-1 rounded-lg backdrop-blur ${fontSizeClass}`}>{t.selectLanguage}</h2>
        </div>
        
        <div className="w-full max-w-sm space-y-4 relative z-20">
          <button 
            onClick={() => { audioService.playClick(); setLang(Language.URDU); setActiveTab('home'); }}
            className={`w-full p-5 rounded-2xl flex items-center justify-between border-2 transition-all duration-200 ${lang === Language.URDU ? 'border-green-600 bg-white dark:bg-gray-800 shadow-xl scale-105' : 'border-transparent bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800'}`}
          >
            <div className="flex items-center gap-4">
                <span className="text-2xl">🇵🇰</span>
                <span className="text-2xl font-urdu font-bold text-gray-800 dark:text-white">اردو</span>
            </div>
            {lang === Language.URDU && <div className="w-5 h-5 rounded-full bg-green-600 border-4 border-green-100 dark:border-green-800"></div>}
          </button>
          
          <button 
            onClick={() => { audioService.playClick(); setLang(Language.ENGLISH); setActiveTab('home'); }}
            className={`w-full p-5 rounded-2xl flex items-center justify-between border-2 transition-all duration-200 ${lang === Language.ENGLISH ? 'border-green-600 bg-white dark:bg-gray-800 shadow-xl scale-105' : 'border-transparent bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800'}`}
          >
             <div className="flex items-center gap-4">
                <span className="text-2xl">🇬🇧</span>
                <span className={`font-medium text-gray-800 dark:text-white ${fontSizeClass}`}>English</span>
            </div>
            {lang === Language.ENGLISH && <div className="w-5 h-5 rounded-full bg-green-600 border-4 border-green-100 dark:border-green-800"></div>}
          </button>
        </div>

        <button 
           onClick={() => { audioService.playClick(); setActiveTab('home'); }}
           className={`mt-12 bg-green-700 text-white w-full max-w-sm py-4 rounded-xl font-bold shadow-lg shadow-green-700/30 hover:bg-green-800 active:scale-95 transition-all relative z-20 ${fontSizeClass}`}
        >
          {t.start}
        </button>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={handleTabChange} lang={lang} settings={settings}>
      {activeTab === 'home' && (
        <div className="relative min-h-full pb-32">
          {/* Fixed Video Background (Visible behind transparent layout/content) */}
          <VideoBackground enabled={settings.videoEnabled} />
          
          <div className="relative z-10 p-6 space-y-6 animate-in fade-in duration-500">
            <header className="flex justify-between items-center mb-2">
                <div>
                <p className={`text-green-700 dark:text-green-300 font-bold uppercase tracking-wider bg-white/70 dark:bg-gray-800/70 px-2 rounded-lg inline-block backdrop-blur-sm ${fontSizeClass === 'text-xl' ? 'text-base' : 'text-xs'}`}>{t.welcome}</p>
                <h1 className={`font-bold text-gray-900 dark:text-white font-urdu mt-1 drop-shadow-sm ${settings.fontSize === 'large' ? 'text-4xl' : 'text-3xl'}`}>{t.appName}</h1>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/50 dark:ring-gray-700">
                HG
                </div>
            </header>

            <WeatherWidget data={weather} loading={weatherLoading} lang={lang} fontSizeClass={fontSizeClass} />

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <Tooltip text={t.sendImage} position="bottom">
                    <button 
                    onClick={() => {
                        audioService.playClick();
                        setActiveTab('chat');
                    }}
                    className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-green-50 dark:border-gray-700 flex flex-col items-center justify-center gap-3 hover:bg-green-50 dark:hover:bg-gray-700 hover:shadow-md transition-all group"
                    >
                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        <ImageIcon size={28} />
                    </div>
                    <span className={`font-bold text-gray-700 dark:text-gray-200 ${fontSizeClass}`}>{t.sendImage}</span>
                    </button>
                </Tooltip>

                <Tooltip text={t.sendVoice} position="bottom">
                    <button 
                    onClick={() => {
                        audioService.playClick();
                        setActiveTab('chat');
                    }}
                    className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-green-50 dark:border-gray-700 flex flex-col items-center justify-center gap-3 hover:bg-green-50 dark:hover:bg-gray-700 hover:shadow-md transition-all group"
                    >
                    <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                        <Mic size={28} />
                    </div>
                    <span className={`font-bold text-gray-700 dark:text-gray-200 ${fontSizeClass}`}>{t.sendVoice}</span>
                    </button>
                </Tooltip>
            </div>

            {/* Call to Action */}
            <div className="bg-green-800/90 dark:bg-green-900/90 backdrop-blur-md rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-green-900/20">
                <div className="absolute -right-10 -bottom-10 opacity-20 rotate-12">
                    <Leaf size={180} />
                </div>
                <div className="relative z-10">
                    <h3 className={`font-bold mb-2 ${fontSizeClass === 'text-xl' ? 'text-2xl' : 'text-xl'}`}>{t.askExpert}</h3>
                    <p className={`opacity-90 mb-6 max-w-[80%] leading-relaxed ${fontSizeClass === 'text-xl' ? 'text-lg' : 'text-sm'}`}>{t.greeting}</p>
                    <button 
                    onClick={() => { audioService.playClick(); setActiveTab('chat'); }}
                    className={`bg-white text-green-900 px-8 py-3 rounded-xl font-bold shadow-lg active:scale-95 hover:bg-gray-50 transition-all ${fontSizeClass}`}
                    >
                    {t.chat}
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'guide' && (
         <div className="p-6 min-h-full bg-gray-50 dark:bg-gray-900 pb-32">
            <h1 className={`font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 ${fontSizeClass === 'text-xl' ? 'text-3xl' : 'text-2xl'}`}>
               <BookOpen size={28} className="text-green-600" />
               {t.guide}
            </h1>
            {renderGuideContent()}
         </div>
      )}

      {activeTab === 'chat' && (
        <>
            <header className="bg-white dark:bg-gray-800 p-4 shadow-sm flex items-center gap-4 z-10 border-b border-gray-100 dark:border-gray-700 sticky top-0">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Leaf size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                <h2 className={`font-bold text-gray-800 dark:text-white ${fontSizeClass}`}>{t.askExpert}</h2>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Gemini AI Active</span>
                </div>
                </div>
            </header>
            <ChatInterface 
                messages={messages}
                isProcessing={isProcessing}
                onSendMessage={handleSendMessage}
                onRecordVoice={startRecording}
                onStopRecordVoice={stopRecording}
                isRecording={isRecording}
                lang={lang}
                settings={settings}
                fontSizeClass={fontSizeClass}
            />
        </>
      )}

      {activeTab === 'weather' && (
        <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-32">
            <h1 className={`font-bold text-gray-900 dark:text-white ${fontSizeClass === 'text-xl' ? 'text-3xl' : 'text-2xl'}`}>{t.weather}</h1>
            <WeatherWidget data={weather} loading={weatherLoading} lang={lang} fontSizeClass={fontSizeClass} />
            
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-green-50 dark:border-gray-700">
               <h3 className={`font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 ${fontSizeClass}`}>
                  <Calendar size={20} className="text-green-600 dark:text-green-400" />
                  {t.forecast}
               </h3>
               <div className="space-y-2">
                  {weather?.daily?.map((day, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 hover:bg-green-50 dark:hover:bg-gray-700 rounded-2xl transition-colors group">
                          <span className={`text-gray-600 dark:text-gray-300 font-medium w-24 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors ${fontSizeClass === 'text-xl' ? 'text-base' : 'text-sm'}`}>{day.date}</span>
                          <div className="flex-1 flex justify-center">
                              {day.code <= 3 ? <Sun size={24} className="text-orange-400" /> : <CloudRain size={24} className="text-blue-400" />}
                          </div>
                          <div className="flex items-center gap-4 w-24 justify-end">
                              <span className={`font-bold text-gray-900 dark:text-white ${fontSizeClass === 'text-xl' ? 'text-2xl' : 'text-lg'}`}>{Math.round(day.maxTemp)}°</span>
                              <span className={`text-gray-400 dark:text-gray-500 font-medium ${fontSizeClass === 'text-xl' ? 'text-base' : 'text-sm'}`}>{Math.round(day.minTemp)}°</span>
                          </div>
                      </div>
                  ))}
                  {!weather && !weatherLoading && <p className="text-center text-gray-400 py-4">{t.offlineMode}</p>}
               </div>
            </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <SettingsPanel 
            settings={settings}
            setSettings={setSettings}
            lang={lang}
            setLang={setLang}
            fontSizeClass={fontSizeClass}
        />
      )}
    </Layout>
  );
};

export default App;