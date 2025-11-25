
import { GeoLocation, WeatherData, Language } from '../types';

const CACHE_KEY = 'hariyali_weather_cache';
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

export const getCurrentLocation = (): Promise<GeoLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
};

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  // Check Cache
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const parsed: WeatherData = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < CACHE_DURATION) {
      console.log("Using cached weather data");
      return parsed;
    }
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!data.current_weather) {
      throw new Error("Failed to fetch weather data");
    }

    // Rough estimation for humidity since OpenMeteo puts it in hourly
    const currentHourIndex = new Date().getHours();
    const humidity = data.hourly?.relativehumidity_2m?.[currentHourIndex] || 50;

    const dailyData = data.daily?.time?.slice(1, 4).map((date: string, index: number) => ({
        date: date,
        maxTemp: data.daily.temperature_2m_max[index + 1],
        minTemp: data.daily.temperature_2m_min[index + 1],
        code: data.daily.weathercode[index + 1]
    })) || [];

    const weatherData: WeatherData = {
      temperature: data.current_weather.temperature,
      condition: "", 
      humidity: humidity,
      windSpeed: data.current_weather.windspeed,
      isDay: data.current_weather.is_day === 1,
      code: data.current_weather.weathercode,
      timestamp: Date.now(),
      daily: dailyData
    };

    // Save to cache
    localStorage.setItem(CACHE_KEY, JSON.stringify(weatherData));

    return weatherData;
  } catch (error) {
    console.error("Weather API Error:", error);
    // If API fails, try to return old cache even if expired
    if (cached) return JSON.parse(cached);
    throw error;
  }
};

export const getSmartAdvice = (weather: WeatherData, lang: Language): string[] => {
    const advice: string[] = [];
    const isUrdu = lang === Language.URDU;

    // Wind Logic
    if (weather.windSpeed > 15) {
        advice.push(isUrdu 
            ? "تیز ہوا (15 کلومیٹر/گھنٹہ سے زیادہ) ہے۔ سپرے کرنے سے گریز کریں۔" 
            : "High wind (>15km/h). Avoid spraying pesticides.");
    }

    // Temperature/Heatwave
    if (weather.temperature > 35) {
        advice.push(isUrdu 
            ? "شدید گرمی کا خدشہ۔ فصلوں کو پانی دیں تاکہ سوکھا نہ پڑے۔" 
            : "Heatwave Alert. Irrigate crops to prevent heat stress.");
    }
    
    // Rain (Codes: 51-67, 80-82, 95-99)
    if (weather.code >= 51) {
        advice.push(isUrdu 
            ? "بارش کا امکان ہے۔ پانی نہ لگائیں۔" 
            : "Rain expected. Do not irrigate.");
    }

    // Humidity (Fungal risk)
    if (weather.humidity > 70 && weather.temperature < 30) {
        advice.push(isUrdu
            ? "زیادہ نمی فنگس کا باعث بن سکتی ہے۔ فصل کا معائنہ کریں۔"
            : "High humidity detected. Check crops for fungal infections.");
    }

    if (advice.length === 0) {
        advice.push(isUrdu 
            ? "موسم فصلوں کے لیے سازگار ہے۔ معمول کا کام جاری رکھیں۔" 
            : "Weather is favorable for routine farm activities.");
    }

    return advice;
};
