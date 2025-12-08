import { useState } from 'react'
import { apiService } from '../utils/api'
import DiligenciaCard from '../components/DiligenciaCard'
import GestorCard from '../components/GestorCard'
import '../styles/Buscar.css'

function Buscar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [diligencias, setDiligencias] = useState([])
  const [gestores, setGestores] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('todos')

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const term = searchTerm.trim()
      
      // Buscar en ambas categorías simultáneamente
      const [diligenciasResponse, gestoresResponse] = await Promise.all([
        apiService.searchDiligencias(term),
        apiService.searchGestores(term)
      ])

      setDiligencias(diligenciasResponse.data || [])
      setGestores(gestoresResponse.data || [])
    } catch (error) {
      console.error('Error en la búsqueda:', error)
      setDiligencias([])
      setGestores([])
    } finally {
      setLoading(false)
    }
  }

  const handleInitialLoad = async () => {
    setLoading(true)
    try {
      const [diligenciasResponse, gestoresResponse] = await Promise.all([
        apiService.getDiligencias(),
        apiService.getGestores()
      ])

      setDiligencias(diligenciasResponse.data || [])
      setGestores(gestoresResponse.data || [])
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const hasResults = diligencias.length > 0 || gestores.length > 0

  return (
    <div className="buscar">
      <h1 className="buscar__title">Buscar Gestores y Diligencias</h1>
      
      <form className="buscar__form" onSubmit={handleSearch}>
        <input
          type="text"
          className="buscar__input"
          placeholder="Buscar por zona, tipo de diligencia, gestor, título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="buscar__actions">
          <button type="submit" className="buscar__button" disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
          <button 
            type="button" 
            className="buscar__button buscar__button--secondary"
            onClick={handleInitialLoad}
            disabled={loading}
          >
            Cargar Todos
          </button>
        </div>
      </form>

      {hasResults && (
        <div className="buscar__tabs">
          <button
            className={`buscar__tab ${activeTab === 'todos' ? 'buscar__tab--active' : ''}`}
            onClick={() => setActiveTab('todos')}
          >
            Todos ({diligencias.length + gestores.length})
          </button>
          <button
            className={`buscar__tab ${activeTab === 'diligencias' ? 'buscar__tab--active' : ''}`}
            onClick={() => setActiveTab('diligencias')}
          >
            Diligencias ({diligencias.length})
          </button>
          <button
            className={`buscar__tab ${activeTab === 'gestores' ? 'buscar__tab--active' : ''}`}
            onClick={() => setActiveTab('gestores')}
          >
            Gestores ({gestores.length})
          </button>
        </div>
      )}

      <div className="buscar__results">
        {loading && (
          <p className="buscar__loading">Buscando...</p>
        )}

        {!loading && !hasResults && searchTerm === '' && (
          <p className="buscar__empty">
            Ingresa un término de búsqueda o haz clic en "Cargar Todos" para ver gestores y diligencias disponibles.
          </p>
        )}

        {!loading && !hasResults && searchTerm !== '' && (
          <p className="buscar__empty">
            No se encontraron resultados para "{searchTerm}". Intenta con otro término de búsqueda.
          </p>
        )}

        {!loading && hasResults && (
          <>
            {(activeTab === 'todos' || activeTab === 'diligencias') && diligencias.length > 0 && (
              <div className="buscar__section">
                <h2 className="buscar__section-title">Diligencias ({diligencias.length})</h2>
                <div className="buscar__grid">
                  {diligencias.map(diligencia => (
                    <DiligenciaCard key={diligencia.id} diligencia={diligencia} />
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'todos' || activeTab === 'gestores') && gestores.length > 0 && (
              <div className="buscar__section">
                <h2 className="buscar__section-title">Gestores ({gestores.length})</h2>
                <div className="buscar__grid">
                  {gestores.map(gestor => (
                    <GestorCard key={gestor.id} gestor={gestor} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Buscar

