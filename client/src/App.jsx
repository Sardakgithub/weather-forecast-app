import { useEffect, useState } from 'react'
import { getCurrent, getForecast } from './services/api'
import SearchBar from './components/SearchBar'
import CurrentCard from './components/CurrentCard'
import ForecastList from './components/ForecastList'

export default function App() {
  const [city, setCity] = useState('London')
  const [current, setCurrent] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load(cityName) {
    setLoading(true)
    setError('')
    try {
      const [c, f] = await Promise.all([
        getCurrent(cityName),
        getForecast(cityName)
      ])
      setCurrent(c)
      setForecast(f)
      setCity(cityName)
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message || 'Failed to load')
      setCurrent(null)
      setForecast(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(city) }, [])

  return (
    <div className="container">
      <h1>Weather Forecast</h1>
      <SearchBar onSearch={load} initial={city} loading={loading} />
      {error && <div className="error">{error}</div>}
      {current && <CurrentCard data={current} />}
      {forecast && <ForecastList data={forecast} />}
    </div>
  )
}
