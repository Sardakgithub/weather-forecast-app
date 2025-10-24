export default function CurrentCard({ data }) {
  const { name, weather, main, wind } = data
  const icon = weather?.[0]?.icon
  const desc = weather?.[0]?.description
  return (
    <div className="card">
      <div className="card-header">
        <h2>{name}</h2>
        {icon && <img alt={desc} src={`https://openweathermap.org/img/wn/${icon}@2x.png`} />}
      </div>
      <div className="grid">
        <div><strong>Temp:</strong> {Math.round(main.temp)}°C</div>
        <div><strong>Feels:</strong> {Math.round(main.feels_like)}°C</div>
        <div><strong>Humidity:</strong> {main.humidity}%</div>
        <div><strong>Wind:</strong> {Math.round(wind.speed)} m/s</div>
        <div><strong>Condition:</strong> {desc}</div>
      </div>
    </div>
  )
}
