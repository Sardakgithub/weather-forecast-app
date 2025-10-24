import dotenv from 'dotenv';

dotenv.config();

function required(name, fallback) {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === '') {
    throw new Error(`Missing required environment variable ${name}`);
  }
  return v;
}

export const config = {
  PORT: Number(process.env.PORT || 5000),
  MONGODB_URI: required('MONGODB_URI'),
  // Open-Meteo APIs (no key required)
  WEATHER_API_BASE: process.env.WEATHER_API_BASE || 'https://api.open-meteo.com/v1',
  GEOCODING_API_BASE: process.env.GEOCODING_API_BASE || 'https://geocoding-api.open-meteo.com/v1',
  CACHE_TTL_MINUTES: process.env.CACHE_TTL_MINUTES || '30',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || '*',
};
