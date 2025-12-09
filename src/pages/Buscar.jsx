import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated, getTipoUsuario } from '../utils/auth'
import { apiService } from '../utils/api'
import DiligenciaCard from '../components/DiligenciaCard'
import GestorCard from '../components/GestorCard'
import SearchBar from '../components/SearchBar'
import '../styles/Buscar.css'

function Buscar() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [diligencias, setDiligencias] = useState([])
  const [gestores, setGestores] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('todos')

  useEffect(() => {
    // Proteger ruta: solo usuarios pueden acceder
    if (isAuthenticated()) {
      const tipoUsuario = getTipoUsuario()
      if (tipoUsuario === 'gestor') {
        navigate('/gestor')
        return
      }
    }
    
    // Cargar todos los datos por defecto al montar el componente
    loadAllData()
  }, [navigate])

  const loadAllData = async () => {
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
      setDiligencias([])
      setGestores([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (term) => {
    const searchValue = term || searchTerm
    setSearchTerm(searchValue)
    setLoading(true)

    try {
      const searchTermClean = searchValue.trim()
      
      if (searchTermClean === '') {
        // Si el término está vacío, cargar todos los datos
        await loadAllData()
        return
      }
      
      // Buscar en ambas categorías simultáneamente
      const [diligenciasResponse, gestoresResponse] = await Promise.all([
        apiService.searchDiligencias(searchTermClean),
        apiService.searchGestores(searchTermClean)
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

  const hasResults = diligencias.length > 0 || gestores.length > 0

  return (
    <div className="buscar">
      <h1 className="buscar__title">Explorar Gestores y Diligencias</h1>
      
      <div className="buscar__search-container">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Buscar por zona, tipo de diligencia, gestor, título..."
        />
      </div>

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
            No hay diligencias o gestores disponibles en este momento.
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

