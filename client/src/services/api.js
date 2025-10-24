import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
export const api = axios.create({ baseURL })

export function getCurrent(city) {
  return api.get('/api/weather/current', { params: { city } }).then(r => r.data)
}

export function getForecast(city) {
  return api.get('/api/weather/forecast', { params: { city } }).then(r => r.data)
}
