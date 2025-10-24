import { useState } from 'react'

export default function SearchBar({ onSearch, initial = '', loading }) {
  const [value, setValue] = useState(initial)

  function submit(e) {
    e.preventDefault()
    const q = value.trim()
    if (q) onSearch(q)
  }

  return (
    <form className="search" onSubmit={submit}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter city (e.g., London)"
        aria-label="City"
      />
      <button type="submit" disabled={loading}>{loading ? 'Loading…' : 'Search'}</button>
    </form>
  )
}
