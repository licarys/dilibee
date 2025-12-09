import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsuarioActual, isAuthenticated, getTipoUsuario } from '../utils/auth'
import { apiService } from '../utils/api'
import DiligenciaCard from '../components/DiligenciaCard'
import Loading from '../components/Loading'
import Message from '../components/Message'
import '../styles/HistorialGestor.css'

function HistorialGestor() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [diligencias, setDiligencias] = useState([])
  const [filtro, setFiltro] = useState('todas')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    completadas: 0,
    totalGanado: 0,
    calificacionPromedio: 0
  })

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

  const loadDiligencias = useCallback(async () => {
    if (!usuario) return

    setLoading(true)
    setError('')
    try {
      const response = await apiService.getDiligencias()
      const todasLasDiligencias = response.data || []

      // Filtrar solo las diligencias del gestor actual
      const diligenciasDelGestor = todasLasDiligencias.filter(
        d => d.gestor && d.gestor.id === usuario.id
      )

      // Aplicar filtro de estado
      let diligenciasFiltradas = diligenciasDelGestor
      if (filtro !== 'todas') {
        diligenciasFiltradas = diligenciasDelGestor.filter(d => d.estado === filtro)
      }

      setDiligencias(diligenciasFiltradas)

      // Calcular estadísticas
      const completadas = diligenciasDelGestor.filter(d => d.estado === 'completada')
      const totalGanado = completadas.reduce((sum, d) => sum + (d.precio || 0), 0)
      const calificaciones = completadas
        .filter(d => d.gestor && d.gestor.calificacion)
        .map(d => d.gestor.calificacion)
      const calificacionPromedio = calificaciones.length > 0
        ? (calificaciones.reduce((sum, c) => sum + c, 0) / calificaciones.length).toFixed(1)
        : 0

      setStats({
        completadas: completadas.length,
        totalGanado,
        calificacionPromedio: parseFloat(calificacionPromedio)
      })
    } catch (err) {
      setError('Error al cargar el historial. Por favor, intenta nuevamente.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }, [usuario, filtro])

  useEffect(() => {
    if (usuario) {
      loadDiligencias()
    }
  }, [usuario, loadDiligencias])

  return (
    <div className="historial-gestor">
      <h1 className="historial-gestor__title">Mi Historial de Diligencias</h1>

      <div className="historial-gestor__stats">
        <div className="historial-gestor__stat">
          <h3 className="historial-gestor__stat-number">{stats.completadas}</h3>
          <p className="historial-gestor__stat-label">Completadas</p>
        </div>
        <div className="historial-gestor__stat">
          <h3 className="historial-gestor__stat-number">
            ${stats.totalGanado.toLocaleString('es-MX')} MXN
          </h3>
          <p className="historial-gestor__stat-label">Total Ganado</p>
        </div>
        <div className="historial-gestor__stat">
          <h3 className="historial-gestor__stat-number">
            ⭐ {stats.calificacionPromedio || 'N/A'}
          </h3>
          <p className="historial-gestor__stat-label">Calificación Promedio</p>
        </div>
      </div>

      <div className="historial-gestor__filtros">
        <button
          className={`historial-gestor__filtro ${filtro === 'todas' ? 'historial-gestor__filtro--active' : ''}`}
          onClick={() => setFiltro('todas')}
          disabled={loading}
        >
          Todas
        </button>
        <button
          className={`historial-gestor__filtro ${filtro === 'completada' ? 'historial-gestor__filtro--active' : ''}`}
          onClick={() => setFiltro('completada')}
          disabled={loading}
        >
          Completadas
        </button>
        <button
          className={`historial-gestor__filtro ${filtro === 'en-progreso' ? 'historial-gestor__filtro--active' : ''}`}
          onClick={() => setFiltro('en-progreso')}
          disabled={loading}
        >
          En Progreso
        </button>
      </div>

      {error && (
        <Message tipo="error" mensaje={error} />
      )}

      <div className="historial-gestor__lista">
        {loading && <Loading mensaje="Cargando historial..." />}

        {!loading && diligencias.length === 0 && (
          <p className="historial-gestor__empty">
            No hay diligencias en tu historial
          </p>
        )}

        {!loading && diligencias.length > 0 && (
          <div className="historial-gestor__grid">
            {diligencias.map(diligencia => (
              <DiligenciaCard key={diligencia.id} diligencia={diligencia} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistorialGestor

