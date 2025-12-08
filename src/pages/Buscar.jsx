import { useState, useEffect } from 'react'
import '../styles/Buscar.css'

function Buscar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    // En producción, aquí se haría la búsqueda en la base de datos
    // Por ahora simulamos resultados vacíos hasta que se implemente el buscador
    setResults([])
  }, [searchTerm])

  const handleSearch = (e) => {
    e.preventDefault()
    // Lógica de búsqueda se implementará más adelante
    console.log('Buscando:', searchTerm)
  }

  return (
    <div className="buscar">
      <h1 className="buscar__title">Buscar Gestores y Diligencias</h1>
      <form className="buscar__form" onSubmit={handleSearch}>
        <input
          type="text"
          className="buscar__input"
          placeholder="Buscar por zona, tipo de diligencia, gestor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="buscar__button">
          Buscar
        </button>
      </form>
      <div className="buscar__results">
        {results.length === 0 && (
          <p className="buscar__empty">
            Ingresa un término de búsqueda para encontrar gestores o diligencias disponibles.
          </p>
        )}
      </div>
    </div>
  )
}

export default Buscar

