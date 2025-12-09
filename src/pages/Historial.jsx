import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsuarioActual, isAuthenticated, getTipoUsuario } from '../utils/auth'
import { apiService } from '../utils/api'
import DiligenciaCard from '../components/DiligenciaCard'
import Loading from '../components/Loading'
import Message from '../components/Message'
import InviteSignup from '../components/InviteSignup'
import '../styles/Historial.css'

function Historial() {
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState('todas')
  const [diligencias, setDiligencias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    // Si es gestor, redirigir a su historial
    if (isAuthenticated()) {
      const tipoUsuario = getTipoUsuario()
      if (tipoUsuario === 'gestor') {
        navigate('/historial-gestor')
        return
      }

      const usuarioActual = getUsuarioActual()
      setUsuario(usuarioActual)
    }
  }, [navigate])

  // Si no está autenticado, mostrar invitación
  if (!isAuthenticated()) {
    return (
      <InviteSignup 
        title="Accede a tu historial de diligencias"
        message="Crea una cuenta para ver y gestionar todas tus diligencias en un solo lugar."
      />
    )
  }

  const loadDiligencias = useCallback(async () => {
    if (!usuario) return

    setLoading(true)
    setError('')
    try {
      const response = await apiService.getDiligencias()
      const todasLasDiligencias = response.data || []

      // Filtrar solo las diligencias del usuario actual
      const diligenciasDelUsuario = todasLasDiligencias.filter(
        d => d.usuario && d.usuario.id === usuario.id
      )

      // Aplicar filtro de estado
      let diligenciasFiltradas = diligenciasDelUsuario
      if (filtro !== 'todas') {
        diligenciasFiltradas = diligenciasDelUsuario.filter(d => d.estado === filtro)
      }

      setDiligencias(diligenciasFiltradas)
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
    <div className="historial">
      <h1 className="historial__title">Historial de Diligencias</h1>
      
      <div className="historial__filtros">
        <button
          className={`historial__filtro ${filtro === 'todas' ? 'historial__filtro--active' : ''}`}
          onClick={() => setFiltro('todas')}
          disabled={loading}
        >
          Todas
        </button>
        <button
          className={`historial__filtro ${filtro === 'completada' ? 'historial__filtro--active' : ''}`}
          onClick={() => setFiltro('completada')}
          disabled={loading}
        >
          Completadas
        </button>
        <button
          className={`historial__filtro ${filtro === 'en-progreso' ? 'historial__filtro--active' : ''}`}
          onClick={() => setFiltro('en-progreso')}
          disabled={loading}
        >
          En Progreso
        </button>
        <button
          className={`historial__filtro ${filtro === 'pendiente' ? 'historial__filtro--active' : ''}`}
          onClick={() => setFiltro('pendiente')}
          disabled={loading}
        >
          Pendientes
        </button>
      </div>

      {error && (
        <Message tipo="error" mensaje={error} />
      )}

      <div className="historial__lista">
        {loading && <Loading mensaje="Cargando diligencias..." />}

        {!loading && diligencias.length === 0 && (
          <p className="historial__empty">
            No hay diligencias para mostrar
          </p>
        )}

        {!loading && diligencias.length > 0 && (
          <div className="historial__grid">
            {diligencias.map(diligencia => (
              <DiligenciaCard key={diligencia.id} diligencia={diligencia} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Historial

