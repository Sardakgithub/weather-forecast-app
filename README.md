# MERN Weather Forecast App

A medium-level MERN stack application that provides current weather and forecast, with server-side caching in MongoDB.

## Stack
- Server: Node.js, Express, Mongoose, Axios, Zod, Helmet, CORS, Morgan
- Client: React (Vite)
- Cache: MongoDB TTL collection
- Weather API: Open-Meteo (no API key required)

## Features
- Current conditions by city name
- Multi-hour forecast by city name
- MongoDB cache with per-document TTL to reduce API calls
- Input validation and error handling
- CORS and security headers

## Setup

### 1) Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- No API key needed (using Open-Meteo)

### 2) Environment
Create env files for both server and client:

Server (`server/.env`) – copy from `server/.env.example` and adjust Mongo:
```
PORT=5000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/weather_app
WEATHER_API_BASE=https://api.open-meteo.com/v1
GEOCODING_API_BASE=https://geocoding-api.open-meteo.com/v1
CACHE_TTL_MINUTES=30
```

Client (`client/.env`) – copy from `client/.env.example`:
```
VITE_API_BASE=http://localhost:5000
```

### 3) Install & Run (server)

```
cd server
npm install
npm run dev
```

Server starts on `http://localhost:5000` by default.

### 4) Endpoints
- `GET /api/weather/current?city=London`
- `GET /api/weather/forecast?city=London`

Both return JSON from cache or Open-Meteo.

### 5) Client
React client (Vite) consumes the above endpoints and displays current and forecast data.

### Notes
- Respect API rate limits. The cache TTL is configurable via `CACHE_TTL_MINUTES`.
- If deploying, ensure environment variables are configured in your platform.
