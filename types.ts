
export enum Language {
  ENGLISH = 'en',
  URDU = 'ur',
}

export enum Sender {
  USER = 'user',
  BOT = 'bot',
}

export type MessageStatus = 'sending' | 'sent' | 'error';

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
  image?: string; // base64
  audio?: string; // base64
  isAnalysis?: boolean;
  structuredData?: CropAnalysis;
  status?: MessageStatus;
}

export interface CropAnalysis {
  diseaseName: string;
  confidence: number;
  pesticides: string[];
  instructions: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  code: number;
  timestamp: number; // For caching logic
  daily?: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    code: number;
  }>;
}

export interface GeoLocation {
  lat: number;
  lon: number;
}

// Guide Types
export type CropType = 'wheat' | 'rice' | 'cotton' | 'maize' | 'sugarcane';
export type GuideCategory = 'irrigation' | 'nutrition' | 'protection' | 'yield';

export interface GuideSection {
  title: string;
  content: string[]; // Bullet points
}

export interface CropGuide {
  id: CropType;
  name: string;
  icon: string; // emoji or icon name
  categories: Record<GuideCategory, GuideSection>;
}

export interface UserSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  videoEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark';
}