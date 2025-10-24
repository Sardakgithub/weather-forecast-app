function groupByDay(list) {
  const days = {}
  list.forEach(item => {
    const date = new Date(item.dt * 1000)
    const key = date.toISOString().slice(0,10)
    days[key] ||= []
    days[key].push(item)
  })
  return days
}

export default function ForecastList({ data }) {
  const grouped = groupByDay(data.list)
  return (
    <div className="forecast">
      {Object.entries(grouped).map(([day, items]) => {
        const first = items[0]
        const icon = first.weather?.[0]?.icon
        const desc = first.weather?.[0]?.description
        const temps = items.map(i => i.main.temp)
        const min = Math.round(Math.min(...temps))
        const max = Math.round(Math.max(...temps))
        return (
          <div className="card" key={day}>
            <div className="card-header">
              <h3>{new Date(day).toDateString()}</h3>
              {icon && <img alt={desc} src={`https://openweathermap.org/img/wn/${icon}.png`} />}
            </div>
            <div className="grid">
              <div><strong>Min:</strong> {min}°C</div>
              <div><strong>Max:</strong> {max}°C</div>
              <div><strong>Summary:</strong> {desc}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
