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

  const handleClear = () => {
    setSearchTerm('')
    // Reiniciar búsqueda llamando a onSearch con string vacío
    if (onSearch) {
      onSearch('')
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
        {searchTerm && (
          <button
            type="button"
            className="search-bar__clear-button"
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
        <button type="submit" className="search-bar__button" aria-label="Buscar">
          🔍
        </button>
      </div>
    </form>
  )
}

export default SearchBar

