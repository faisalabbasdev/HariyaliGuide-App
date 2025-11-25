
import React, { useEffect, useState } from 'react';
import { Droplets, Wind, Sun, Cloud, CloudRain, Snowflake, CloudLightning, AlertTriangle } from 'lucide-react';
import { WeatherData, Language } from '../types';
import { WEATHER_CODES, WEATHER_CODES_URDU, TRANSLATIONS } from '../constants';
import { getSmartAdvice } from '../services/weatherService';

interface Props {
  data: WeatherData | null;
  loading: boolean;
  lang: Language;
  fontSizeClass?: string;
}

const getWeatherIcon = (code: number, size: number = 24) => {
  if (code <= 1) return <Sun size={size} className="text-yellow-400 drop-shadow-lg" />;
  if (code <= 3) return <Cloud size={size} className="text-gray-200 drop-shadow-lg" />;
  if (code <= 55) return <CloudRain size={size} className="text-blue-300 drop-shadow-lg" />;
  if (code <= 65) return <CloudRain size={size} className="text-blue-500 drop-shadow-lg" />;
  if (code <= 75) return <Snowflake size={size} className="text-cyan-200 drop-shadow-lg" />;
  return <CloudLightning size={size} className="text-purple-300 drop-shadow-lg" />;
};

export const WeatherWidget: React.FC<Props> = ({ data, loading, lang, fontSizeClass = 'text-base' }) => {
  const t = TRANSLATIONS[lang];
  const isUrdu = lang === Language.URDU;
  const codes = isUrdu ? WEATHER_CODES_URDU : WEATHER_CODES;
  const [advice, setAdvice] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
        setAdvice(getSmartAdvice(data, lang));
    }
  }, [data, lang]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-700 dark:to-green-900 rounded-3xl p-6 text-white shadow-lg animate-pulse h-56 flex items-center justify-center">
        <p className={fontSizeClass}>{t.loadingWeather}</p>
      </div>
    );
  }

  if (!data) return null;

  const isStale = (Date.now() - data.timestamp) > (1000 * 60 * 60); // older than 1 hour

  return (
    <div className="space-y-4">
      {/* Main Weather Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-700 dark:from-emerald-700 dark:to-teal-900 rounded-3xl p-6 text-white shadow-xl shadow-green-900/20 relative overflow-hidden border border-white/10">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-yellow-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent"></div>

        <div className="flex justify-between items-start relative z-10">
          <div>
            <h2 className={`font-medium opacity-90 tracking-wide uppercase ${fontSizeClass === 'text-xl' ? 'text-lg' : 'text-sm'}`}>{t.weather}</h2>
            <div className="mt-1 flex items-baseline">
              <span className="text-6xl font-bold tracking-tighter">{Math.round(data.temperature)}°</span>
              <div className="ml-3">
                 <p className={`font-medium leading-tight ${fontSizeClass === 'text-xl' ? 'text-xl' : 'text-lg'}`}>{codes[data.code]}</p>
                 {isStale && <span className="text-xs opacity-60 italic">Updated: {new Date(data.timestamp).getHours()}:00</span>}
              </div>
            </div>
          </div>
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
            {getWeatherIcon(data.code, 40)}
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center bg-black/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-3">
            <Droplets size={20} className="text-blue-200" />
            <div className="flex flex-col">
              <span className={`uppercase tracking-wider opacity-70 ${fontSizeClass === 'text-xl' ? 'text-xs' : 'text-[10px]'}`}>{t.humidity}</span>
              <span className={`font-semibold ${fontSizeClass}`}>{data.humidity}%</span>
            </div>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="flex items-center gap-3">
            <Wind size={20} className="text-gray-200" />
            <div className="flex flex-col">
              <span className={`uppercase tracking-wider opacity-70 ${fontSizeClass === 'text-xl' ? 'text-xs' : 'text-[10px]'}`}>{t.wind}</span>
              <span className={`font-semibold ${fontSizeClass}`}>{data.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Advice Card */}
      {advice.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/30 rounded-2xl p-4 border border-orange-100 dark:border-orange-800 shadow-sm">
            <h3 className={`font-bold text-orange-800 dark:text-orange-200 mb-2 flex items-center gap-2 ${fontSizeClass}`}>
                <AlertTriangle size={16} />
                {t.smartAdvice}
            </h3>
            <ul className="space-y-2">
                {advice.map((tip, idx) => (
                    <li key={idx} className={`text-orange-900 dark:text-orange-100 bg-orange-100/50 dark:bg-orange-800/50 p-2 rounded-lg leading-relaxed border border-orange-100 dark:border-orange-800 ${fontSizeClass}`}>
                        {tip}
                    </li>
                ))}
            </ul>
        </div>
      )}
    </div>
  );
};
