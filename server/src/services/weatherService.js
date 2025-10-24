import axios from 'axios';
import { fetchWeatherApi } from 'openmeteo';
import { WeatherCache } from '../stores/WeatherCache.js';
import { config } from '../utils/env.js';

const geocodeApi = axios.create({ baseURL: config.GEOCODING_API_BASE });

function cacheKey(type, city) {
  return `${type}:${city.toLowerCase()}`;
}

async function getFromCacheOrFetch(key, fetcher) {
  // Try cache
  const cached = await WeatherCache.findOne({ key });
  if (cached) return cached.data;

  // Fetch from API
  const data = await fetcher();

  // Store with per-document expiry
  const ttlMinutes = Number(config.CACHE_TTL_MINUTES || 30);
  const expireAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
  await WeatherCache.create({ key, data, expireAt });

  return data;
}

function codeToDescription(code) {
  const map = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    66: 'Light freezing rain', 67: 'Heavy freezing rain',
    71: 'Slight snow fall', 73: 'Moderate snow fall', 75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    85: 'Slight snow showers', 86: 'Heavy snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
  };
  return map[code] || 'Unknown';
}

async function geocodeCity(city) {
  const resp = await geocodeApi.get('/search', { params: { name: city, count: 1 } });
  const r = resp.data?.results?.[0];
  if (!r) {
    const err = new Error('City not found');
    err.status = 404;
    throw err;
  }
  return { name: r.name, country: r.country, latitude: r.latitude, longitude: r.longitude, timezone: r.timezone };
}

export async function getCurrentWeather(city) {
  const key = cacheKey('current', city);
  return getFromCacheOrFetch(key, async () => {
    const loc = await geocodeCity(city);
    const url = `${config.WEATHER_API_BASE}/forecast`;
    const params = {
      latitude: loc.latitude,
      longitude: loc.longitude,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'wind_speed_10m',
        'weather_code'
      ],
      timezone: loc.timezone || 'auto'
    };
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const current = response.current();
    // Order must match params.current
    const temp = current?.variables(0)?.value();
    const rh = current?.variables(1)?.value();
    const feels = current?.variables(2)?.value();
    const wind = current?.variables(3)?.value();
    const code = current?.variables(4)?.value();
    const desc = codeToDescription(code);

    return {
      name: loc.name,
      weather: [{ description: desc, icon: null }],
      main: {
        temp,
        feels_like: feels,
        humidity: rh,
      },
      wind: { speed: wind },
    };
  });
}

export async function getForecast(city) {
  const key = cacheKey('forecast', city);
  return getFromCacheOrFetch(key, async () => {
    const loc = await geocodeCity(city);
    const url = `${config.WEATHER_API_BASE}/forecast`;
    const params = {
      latitude: loc.latitude,
      longitude: loc.longitude,
      hourly: ['temperature_2m', 'weather_code'],
      timezone: loc.timezone || 'auto'
    };
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const hourly = response.hourly();
    // Order must match params.hourly
    const times = Array.from({ length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() }, (_, i) =>
      new Date((Number(hourly.time()) + i * hourly.interval() + response.utcOffsetSeconds()) * 1000)
    );
    const temps = hourly.variables(0)?.valuesArray() || [];
    const codes = hourly.variables(1)?.valuesArray() || [];
    const list = times.map((t, i) => ({
      dt: Math.floor(t.getTime() / 1000),
      main: { temp: temps[i] },
      weather: [{ description: codeToDescription(codes[i]), icon: null }]
    }));
    return { list: list.slice(0, 40) };
  });
}
