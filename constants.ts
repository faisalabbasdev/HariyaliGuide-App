
import { Language, CropGuide } from './types';

// Short "Pop" sound for UI interactions (Base64 encoded OGG)
export const CLICK_SOUND = "data:audio/wav;base64,UklGRl9vT1dAVXRhZgAAAAAAAABTMzAAAC5cAAAAAAAADAAAAAAHAA8AAAAAAABAAABAAACAAIAAAAAAAABAAABAAACAAIAAAAAAAABAAAAAAHAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="; 

export const TRANSLATIONS = {
  [Language.ENGLISH]: {
    appName: "HariyaliGuide",
    welcome: "Welcome, Farmer",
    askExpert: "Ask Expert",
    sendImage: "Send Image",
    takePhoto: "Take Photo", // New
    sendVoice: "Record Voice",
    weather: "Weather",
    settings: "Settings",
    guide: "Guide",
    home: "Home",
    chat: "Chat",
    typeMessage: "Type your problem...",
    recording: "Recording...",
    analyzeCrop: "Analyzing Crop...",
    humidity: "Humidity",
    wind: "Wind",
    forecast: "3-Day Forecast",
    language: "Language",
    about: "About App",
    pesticides: "Recommended Pesticides",
    instructions: "Instructions",
    severity: "Severity",
    selectLanguage: "Select Language",
    start: "Get Started",
    permissionError: "Please enable location permissions.",
    loadingWeather: "Loading Weather...",
    greeting: "How is your crop today? Send a photo or voice note.",
    smartAdvice: "Smart Farm Advice",
    selectCrop: "Select Crop",
    irrigation: "Irrigation",
    nutrition: "Nutrition",
    protection: "Protection",
    yield: "Yield",
    offlineMode: "You are offline. Showing cached data.",
    advisory: "Advisory",
    // New
    soundEffects: "Sound Effects",
    hapticFeedback: "Vibration Feedback",
    bgVideo: "Live Background",
    fontSize: "Text Size",
    small: "Small",
    medium: "Medium",
    large: "Large",
    newMessage: "New Message ↓",
    listen: "Listen",
    stop: "Stop",
    sending: "Sending...",
    sent: "Sent",
    darkMode: "Dark Mode",
    theme: "App Theme"
  },
  [Language.URDU]: {
    appName: "ہریالی گائیڈ",
    welcome: "خوش آمدید کسان دوست",
    askExpert: "ماہر سے پوچھیں",
    sendImage: "تصویر بھیجیں",
    takePhoto: "تصویر لیں", // New
    sendVoice: "آواز ریکارڈ کریں",
    weather: "موسم",
    settings: "ترتیبات",
    guide: "رہنمائی",
    home: "ہوم",
    chat: "گفتگو",
    typeMessage: "اپنا مسئلہ لکھیں...",
    recording: "ریکارڈنگ جاری ہے...",
    analyzeCrop: "فصل کا تجزیہ...",
    humidity: "نمی",
    wind: "ہوا",
    forecast: "اگلے 3 دن کا موسم",
    language: "زبان",
    about: "ایپ کے بارے میں",
    pesticides: "تجویز کردہ کیڑے مار ادویات",
    instructions: "ہدایات",
    severity: "شدت",
    selectLanguage: "زبان منتخب کریں",
    start: "شروع کریں",
    permissionError: "براہ کرم لوکیشن کی اجازت دیں۔",
    loadingWeather: "موسم لوڈ ہو رہا ہے...",
    greeting: "آج آپ کی فصل کیسی ہے؟ تصویر یا آواز بھیجیں۔",
    smartAdvice: "سمارٹ زرعی مشورہ",
    selectCrop: "فصل منتخب کریں",
    irrigation: "آبپاشی (پانی)",
    nutrition: "کھاد اور خوراک",
    protection: "کیڑے مار ادویات",
    yield: "پیداوار میں اضافہ",
    offlineMode: "انٹرنیٹ موجود نہیں۔ پرانا ڈیٹا دکھایا جا رہا ہے۔",
    advisory: "زرعی انتباہ",
    // New
    soundEffects: "آواز کے اثرات",
    hapticFeedback: "تھرراہٹ (Vibration)",
    bgVideo: "لائیو بیک گراؤنڈ",
    fontSize: "لکھائی کا سائز",
    small: "چھوٹا",
    medium: "درمیانہ",
    large: "بڑا",
    newMessage: "نیا پیغام ↓",
    listen: "سنیں",
    stop: "روکیں",
    sending: "بھیجا جا رہا ہے...",
    sent: "بھیج دیا گیا",
    darkMode: "ڈارک موڈ",
    theme: "ایپ تھیم"
  }
};

export const WEATHER_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Drizzle: Light",
  53: "Drizzle: Moderate",
  55: "Drizzle: Dense intensity",
  61: "Rain: Slight",
  63: "Rain: Moderate",
  65: "Rain: Heavy intensity",
  71: "Snow fall: Slight",
  73: "Snow fall: Moderate",
  75: "Snow fall: Heavy intensity",
  95: "Thunderstorm: Slight or moderate",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail"
};

export const WEATHER_CODES_URDU: Record<number, string> = {
  0: "صاف آسمان",
  1: "زیادہ تر صاف",
  2: "جزوی بادل",
  3: "ابر آلود",
  45: "دھند",
  48: "گہری دھند",
  51: "ہلکی بوندہ باندی",
  53: "درمیانی بوندہ باندی",
  55: "تیز بوندہ باندی",
  61: "ہلکی بارش",
  63: "درمیانی بارش",
  65: "تیز بارش",
  71: "ہلکی برف باری",
  73: "درمیانی برف باری",
  75: "تیز برف باری",
  95: "گرج چمک",
  96: "گرج چمک اور اولے",
  99: "طوفانی بارش اور اولے"
};

export const FARMER_GUIDE_DATA: Record<Language, CropGuide[]> = {
  [Language.URDU]: [
    {
      id: 'wheat',
      name: 'گندم (Wheat)',
      icon: '🌾',
      categories: {
        irrigation: {
          title: "آبپاشی کا شیڈول",
          content: [
            "پہلا پانی: جڑیں بنتے وقت (بوائی کے 20-25 دن بعد)",
            "دوسرا پانی: شگوفے بنتے وقت",
            "تیسرا پانی: گوبھ کی حالت میں",
            "چوتھا پانی: دانہ بنتے وقت (دودھیا حالت)",
            "غلطی سے بچیں: تیز ہوا میں پانی نہ لگائیں ورنہ فصل گر جائے گی۔"
          ]
        },
        nutrition: {
          title: "کھاد کا استعمال",
          content: [
            "بوائی کے وقت: ڈی اے پی 1 بوری + آدھی بوری یوریا",
            "پہلے پانی پر: 1 بوری یوریا",
            "زنک اور بوران کا استعمال پیداوار بڑھانے میں مددگار ہے۔"
          ]
        },
        protection: {
          title: "بیماریوں سے بچاؤ",
          content: [
            "کنگی (Rust): اگر پتوں پر پیلے دھبے ہوں تو فوری فنگسائڈ سپرے کریں۔",
            "جڑی بوٹیاں: پہلے پانی کے بعد جڑی بوٹی مار سپرے کریں۔"
          ]
        },
        yield: {
          title: "پیداوار بڑھانے کے ٹوٹکے",
          content: [
            "تصدیق شدہ بیج استعمال کریں۔",
            "وقت پر بوائی (15 نومبر تک بہترین)۔",
            "آخری پانی دانہ سخت ہونے پر بند کر دیں۔"
          ]
        }
      }
    },
    {
      id: 'rice',
      name: 'چاول (Rice)',
      icon: '🍚',
      categories: {
        irrigation: {
          title: "پانی کا انتظام",
          content: [
            "پنیری کی منتقلی کے بعد 2 ہفتے تک کھیت میں پانی کھڑا رکھیں۔",
            "منتقلی کے 30 دن بعد پانی کم کر کے 'خشک وتر' طریقہ اپنائیں۔"
          ]
        },
        nutrition: {
          title: "کھادیں",
          content: [
            "زنک کی کمی سے پتے سرخ ہو سکتے ہیں، زنک سلفیٹ ڈالیں۔",
            "پوٹاش کا استعمال دانے کو وزنی اور چمکدار بناتا ہے۔"
          ]
        },
        protection: {
          title: "کیڑے اور بیماریاں",
          content: [
            "تنے کی سنڈی (Stem Borer): دانے دار زہر کا استعمال کریں۔",
            "لیف فولڈر: پتے لپیٹنے والی سنڈی کا سپرے کریں۔"
          ]
        },
        yield: {
          title: "بہترین پیداوار",
          content: [
            "پودوں کا درمیانی فاصلہ 9 انچ رکھیں۔",
            "فی ایکڑ 80,000 پودے پورے کریں۔"
          ]
        }
      }
    },
    {
      id: 'cotton',
      name: 'کپاس (Cotton)',
      icon: '🌱',
      categories: {
        irrigation: {
          title: "پانی کی ضرورت",
          content: [
            "پہلا پانی بوائی کے 30-35 دن بعد۔",
            "پھول آتے وقت پانی کی کمی نہ ہونے دیں۔",
            "زیادہ بارش کی صورت میں نکاسی کا انتظام کریں۔"
          ]
        },
        nutrition: {
          title: "خوراک",
          content: [
            "پھول آنے پر پوٹاشیم نائٹریٹ کا سپرے کریں۔",
            "نائٹروجن کھاد اقساط میں دیں۔"
          ]
        },
        protection: {
          title: "کیڑے مار ادویات",
          content: [
            "سفید مکھی اور گلابی سنڈی سب سے خطرناک ہیں۔",
            "معاشی حد (ETL) دیکھ کر سپرے کریں۔",
            "دوپہر کے وقت سپرے نہ کریں۔"
          ]
        },
        yield: {
          title: "پیداوار",
          content: [
            "چنائی (Picking) اوس خشک ہونے کے بعد کریں۔",
            "صاف ستھری چنائی سے مارکیٹ ریٹ اچھا ملتا ہے۔"
          ]
        }
      }
    }
  ],
  [Language.ENGLISH]: [
    {
      id: 'wheat',
      name: 'Wheat (Gandum)',
      icon: '🌾',
      categories: {
        irrigation: {
          title: "Irrigation Schedule",
          content: [
            "1st Water: Crown Root Initiation (20-25 days after sowing)",
            "2nd Water: Tillering stage",
            "3rd Water: Booting stage",
            "4th Water: Milking stage",
            "Avoid irrigation during high winds to prevent lodging."
          ]
        },
        nutrition: {
          title: "Fertilizer Tips",
          content: [
            "At Sowing: 1 bag DAP + 0.5 bag Urea",
            "With 1st Water: 1 bag Urea",
            "Use Zinc and Boron for better grain filling."
          ]
        },
        protection: {
          title: "Pest Protection",
          content: [
            "Yellow Rust: Spray fungicide immediately if yellow spots appear.",
            "Weeds: Apply herbicide after the 1st irrigation."
          ]
        },
        yield: {
          title: "Yield Improvement",
          content: [
            "Use certified seed varieties.",
            "Complete sowing by Nov 15 for maximum yield.",
            "Stop irrigation when grains harden."
          ]
        }
      }
    },
    {
      id: 'rice',
      name: 'Rice (Chawal)',
      icon: '🍚',
      categories: {
        irrigation: {
          title: "Water Management",
          content: [
            "Keep water standing for 2 weeks after transplantation.",
            "Use 'Alternate Wetting & Drying' method after 30 days."
          ]
        },
        nutrition: {
          title: "Nutrition",
          content: [
            "Apply Zinc Sulfate if leaves turn rusty brown.",
            "Potash application ensures heavy and shiny grains."
          ]
        },
        protection: {
          title: "Disease Control",
          content: [
            "Stem Borer: Apply granular pesticides.",
            "Leaf Folder: Use appropriate spray upon detection."
          ]
        },
        yield: {
          title: "Max Yield",
          content: [
            "Maintain plant spacing of 9 inches.",
            "Ensure 80,000 plants per acre."
          ]
        }
      }
    },
    {
      id: 'cotton',
      name: 'Cotton (Kapas)',
      icon: '🌱',
      categories: {
        irrigation: {
          title: "Irrigation",
          content: [
            "1st water 30-35 days after sowing.",
            "Do not stress crop during flowering.",
            "Drain excess rainwater immediately."
          ]
        },
        nutrition: {
          title: "Fertilizer",
          content: [
            "Spray Potassium Nitrate at flowering stage.",
            "Apply Nitrogen in splits."
          ]
        },
        protection: {
          title: "Pest Control",
          content: [
            "Whitefly and Pink Bollworm are major threats.",
            "Spray only when pest reaches ETL (threshold).",
            "Avoid spraying at noon/high heat."
          ]
        },
        yield: {
          title: "Yield Tips",
          content: [
            "Pick cotton only after dew evaporates.",
            "Clean picking fetches better market price."
          ]
        }
      }
    }
  ]
};
