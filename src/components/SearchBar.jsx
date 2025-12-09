import { useState } from 'react'
import '../styles/SearchBar.css'

function SearchBar({ onSearch, placeholder = 'Buscar...' }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchTerm)
    }
  }

  const handleChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    // Búsqueda en tiempo real
    if (onSearch) {
      onSearch(value)
    }
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-bar__container">
        <input
          type="text"
          className="search-bar__input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
        />
        <button type="submit" className="search-bar__button" aria-label="Buscar">
          🔍
        </button>
      </div>
    </form>
  )
}

export default SearchBar

