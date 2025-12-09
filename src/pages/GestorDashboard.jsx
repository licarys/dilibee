import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsuarioActual, isAuthenticated, getTipoUsuario } from '../utils/auth'
import { apiService } from '../utils/api'
import DiligenciaCard from '../components/DiligenciaCard'
import Loading from '../components/Loading'
import Message from '../components/Message'
import SearchBar from '../components/SearchBar'
import '../styles/GestorDashboard.css'

function GestorDashboard() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [disponible, setDisponible] = useState(true)
  const [diligenciasDisponibles, setDiligenciasDisponibles] = useState([])
  const [diligenciasAsignadas, setDiligenciasAsignadas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('disponibles')
  const [searchTerm, setSearchTerm] = useState('')

  const loadDiligencias = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await apiService.getDiligencias()
      const todasLasDiligencias = response.data || []

      // Filtrar diligencias disponibles (pendientes y sin gestor asignado)
      const disponibles = todasLasDiligencias.filter(
        d => d.estado === 'pendiente' && !d.gestor
      )

      // Filtrar diligencias asignadas al gestor actual
      const asignadas = todasLasDiligencias.filter(
        d => d.gestor && d.gestor.id === usuario?.id && d.estado !== 'completada'
      )

      setDiligenciasDisponibles(disponibles)
      setDiligenciasAsignadas(asignadas)
    } catch (err) {
      setError('Error al cargar diligencias. Por favor, intenta nuevamente.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }, [usuario?.id])

  useEffect(() => {
    // Verificar autenticación y tipo de usuario
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }

    const tipoUsuario = getTipoUsuario()
    if (tipoUsuario !== 'gestor') {
      navigate('/')
      return
    }

    const usuarioActual = getUsuarioActual()
    setUsuario(usuarioActual)
  }, [navigate])

  useEffect(() => {
    if (usuario) {
      loadDiligencias()
    }
  }, [usuario, loadDiligencias])

  const handleAceptarDiligencia = async (diligenciaId) => {
    try {
      setLoading(true)
      setError('')
      
      // Obtener la diligencia que se va a aceptar
      const diligenciaAceptar = diligenciasDisponibles.find(d => d.id === diligenciaId)
      if (!diligenciaAceptar) {
        throw new Error('Diligencia no encontrada')
      }

      // Llamar a la API para aceptar la diligencia
      const response = await apiService.aceptarDiligencia(diligenciaId, usuario.id)
      const diligenciaActualizada = response.data
      
      // Actualizar el estado local
      setDiligenciasDisponibles(prev => 
        prev.filter(d => d.id !== diligenciaId)
      )
      setDiligenciasAsignadas(prev => 
        [...prev, diligenciaActualizada]
      )
      
      // Cambiar a la pestaña de asignadas para ver la nueva diligencia
      setActiveTab('asignadas')
      
      setLoading(false)
    } catch (err) {
      setError('Error al aceptar la diligencia. Por favor, intenta nuevamente.')
      console.error('Error:', err)
      setLoading(false)
    }
  }

  const toggleDisponibilidad = () => {
    setDisponible(!disponible)
    // En producción, esto actualizaría el estado en la base de datos
  }

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase())
  }

  const filterDiligencias = (diligencias) => {
    if (!searchTerm) {
      return diligencias
    }

    return diligencias.filter(diligencia => {
      const searchableText = `
        ${diligencia.titulo || ''} 
        ${diligencia.descripcion || ''} 
        ${diligencia.tipo || ''} 
        ${diligencia.estado || ''} 
        ${diligencia.urgencia || ''} 
        ${diligencia.puntoInicio || ''} 
        ${diligencia.puntoDestino || ''}
      `.toLowerCase()

      return searchableText.includes(searchTerm)
    })
  }

  const diligenciasDisponiblesFiltradas = filterDiligencias(diligenciasDisponibles)
  const diligenciasAsignadasFiltradas = filterDiligencias(diligenciasAsignadas)

  if (loading && !usuario) {
    return <Loading mensaje="Cargando..." />
  }

  if (!usuario) {
    return null
  }

  return (
    <div className="gestor-dashboard">
      <div className="gestor-dashboard__header">
        <div>
          <h1 className="gestor-dashboard__title">Panel de Gestor</h1>
          <p className="gestor-dashboard__welcome">
            Bienvenido, {usuario.nombre}
          </p>
        </div>
        <div className="gestor-dashboard__availability">
          <label className="gestor-dashboard__availability-toggle">
            <input
              type="checkbox"
              checked={disponible}
              onChange={toggleDisponibilidad}
            />
            <span className="gestor-dashboard__availability-label">
              {disponible ? '✓ Disponible' : '✗ No disponible'}
            </span>
          </label>
        </div>
      </div>

      {error && (
        <Message tipo="error" mensaje={error} />
      )}

      <div className="gestor-dashboard__stats">
        <div className="gestor-dashboard__stat">
          <h3 className="gestor-dashboard__stat-number">
            {diligenciasDisponibles.length}
          </h3>
          <p className="gestor-dashboard__stat-label">Disponibles</p>
        </div>
        <div className="gestor-dashboard__stat">
          <h3 className="gestor-dashboard__stat-number">
            {diligenciasAsignadas.length}
          </h3>
          <p className="gestor-dashboard__stat-label">En Progreso</p>
        </div>
        {usuario.calificacion && (
          <div className="gestor-dashboard__stat">
            <h3 className="gestor-dashboard__stat-number">
              ⭐ {usuario.calificacion}
            </h3>
            <p className="gestor-dashboard__stat-label">Calificación</p>
          </div>
        )}
        {usuario.zona && (
          <div className="gestor-dashboard__stat">
            <h3 className="gestor-dashboard__stat-number">
              📍
            </h3>
            <p className="gestor-dashboard__stat-label">{usuario.zona}</p>
          </div>
        )}
      </div>

      <div className="gestor-dashboard__tabs-container">
        <div className="gestor-dashboard__tabs">
          <button
            className={`gestor-dashboard__tab ${activeTab === 'disponibles' ? 'gestor-dashboard__tab--active' : ''}`}
            onClick={() => setActiveTab('disponibles')}
          >
            Diligencias Disponibles ({diligenciasDisponibles.length})
          </button>
          <button
            className={`gestor-dashboard__tab ${activeTab === 'asignadas' ? 'gestor-dashboard__tab--active' : ''}`}
            onClick={() => setActiveTab('asignadas')}
          >
            Mis Diligencias ({diligenciasAsignadas.length})
          </button>
        </div>
        <div className="gestor-dashboard__search">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Buscar por título, descripción, tipo, estado..."
          />
        </div>
      </div>

      <div className="gestor-dashboard__content">
        {loading && <Loading mensaje="Cargando diligencias..." />}

        {!loading && activeTab === 'disponibles' && (
          <div>
            {!disponible && (
              <Message 
                tipo="warning" 
                mensaje="Activa tu disponibilidad para ver diligencias disponibles." 
              />
            )}
            {disponible && diligenciasDisponiblesFiltradas.length === 0 && diligenciasDisponibles.length === 0 && (
              <p className="gestor-dashboard__empty">
                No hay diligencias disponibles en este momento.
              </p>
            )}
            {disponible && diligenciasDisponiblesFiltradas.length === 0 && diligenciasDisponibles.length > 0 && searchTerm && (
              <p className="gestor-dashboard__empty">
                No se encontraron diligencias que coincidan con tu búsqueda.
              </p>
            )}
            {disponible && diligenciasDisponiblesFiltradas.length > 0 && (
              <div className="gestor-dashboard__grid">
                {diligenciasDisponiblesFiltradas.map(diligencia => (
                  <div key={diligencia.id} className="gestor-dashboard__card-wrapper">
                    <DiligenciaCard diligencia={diligencia} />
                    <button
                      className="gestor-dashboard__accept-button"
                      onClick={() => handleAceptarDiligencia(diligencia.id)}
                      disabled={loading}
                    >
                      Aceptar Diligencia
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === 'asignadas' && (
          <div>
            {diligenciasAsignadasFiltradas.length === 0 && diligenciasAsignadas.length === 0 && (
              <p className="gestor-dashboard__empty">
                No tienes diligencias asignadas en este momento.
              </p>
            )}
            {diligenciasAsignadasFiltradas.length === 0 && diligenciasAsignadas.length > 0 && searchTerm && (
              <p className="gestor-dashboard__empty">
                No se encontraron diligencias que coincidan con tu búsqueda.
              </p>
            )}
            {diligenciasAsignadasFiltradas.length > 0 && (
              <div className="gestor-dashboard__grid">
                {diligenciasAsignadasFiltradas.map(diligencia => (
                  <DiligenciaCard key={diligencia.id} diligencia={diligencia} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default GestorDashboard

