import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiService } from '../utils/api'
import { getUsuarioActual, isAuthenticated, getTipoUsuario } from '../utils/auth'
import Tracking from '../components/Tracking'
import DiligenciaCard from '../components/DiligenciaCard'
import Loading from '../components/Loading'
import Message from '../components/Message'
import '../styles/Seguimiento.css'

function Seguimiento() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [diligencia, setDiligencia] = useState(null)
  const [usuarioSolicitante, setUsuarioSolicitante] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [completando, setCompletando] = useState(false)
  const usuarioActual = getUsuarioActual()
  const tipoUsuario = getTipoUsuario()

  useEffect(() => {
    if (id) {
      loadDiligencia()
    }
  }, [id])

  const loadDiligencia = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await apiService.getDiligenciaById(id)
      const diligenciaData = response.data
      setDiligencia(diligenciaData)
      
      // Cargar datos completos del usuario solicitante
      if (diligenciaData.usuario && diligenciaData.usuario.id) {
        try {
          const usuarioResponse = await apiService.getUsuarioById(diligenciaData.usuario.id)
          setUsuarioSolicitante(usuarioResponse.data)
        } catch (err) {
          console.error('Error al cargar datos del solicitante:', err)
          // Si falla, usar los datos básicos de la diligencia
          setUsuarioSolicitante(diligenciaData.usuario)
        }
      }
    } catch (err) {
      setError('Error al cargar la diligencia. Por favor, intenta nuevamente.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCompletarDiligencia = async () => {
    if (!window.confirm('¿Estás seguro de que deseas marcar esta diligencia como completada?')) {
      return
    }

    setCompletando(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await apiService.completarDiligencia(id, usuarioActual.id)
      setDiligencia(response.data)
      setSuccess('Diligencia marcada como completada exitosamente.')
      
      // Recargar después de un momento
      setTimeout(() => {
        loadDiligencia()
      }, 1000)
    } catch (err) {
      setError(err.message || 'Error al completar la diligencia. Por favor, intenta nuevamente.')
      console.error('Error:', err)
    } finally {
      setCompletando(false)
    }
  }

  // Verificar si el gestor puede completar esta diligencia
  const puedeCompletar = tipoUsuario === 'gestor' && 
                         diligencia?.estado === 'en-progreso' && 
                         diligencia?.gestor?.id === usuarioActual?.id

  if (loading) {
    return <Loading mensaje="Cargando información de la diligencia..." />
  }

  if (!diligencia && !error) {
    return (
      <div className="seguimiento">
        <Message tipo="warning" mensaje="Diligencia no encontrada" />
      </div>
    )
  }

  return (
    <div className="seguimiento">
      <h1 className="seguimiento__title">Seguimiento de Diligencia</h1>
      
      {error && (
        <Message tipo="error" mensaje={error} />
      )}
      
      {success && (
        <Message tipo="success" mensaje={success} />
      )}

      <div className="seguimiento__content">
        <div className="seguimiento__left">
          <div className="seguimiento__card">
            <DiligenciaCard diligencia={diligencia} hideActions={true} />
          </div>

          {usuarioSolicitante && (
            <div className="seguimiento__solicitante">
              <h3 className="seguimiento__solicitante-title">Datos del Solicitante</h3>
              <div className="seguimiento__solicitante-info">
                <div className="seguimiento__solicitante-campo">
                  <span className="seguimiento__solicitante-label">Nombre:</span>
                  <span className="seguimiento__solicitante-valor">{usuarioSolicitante.nombre}</span>
                </div>
                {usuarioSolicitante.email && (
                  <div className="seguimiento__solicitante-campo">
                    <span className="seguimiento__solicitante-label">Email:</span>
                    <span className="seguimiento__solicitante-valor">{usuarioSolicitante.email}</span>
                  </div>
                )}
                {usuarioSolicitante.telefono && (
                  <div className="seguimiento__solicitante-campo">
                    <span className="seguimiento__solicitante-label">Teléfono:</span>
                    <span className="seguimiento__solicitante-valor">{usuarioSolicitante.telefono}</span>
                  </div>
                )}
                {usuarioSolicitante.calificacion && (
                  <div className="seguimiento__solicitante-campo">
                    <span className="seguimiento__solicitante-label">Calificación:</span>
                    <span className="seguimiento__solicitante-valor">⭐ {usuarioSolicitante.calificacion}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {puedeCompletar && (
            <div className="seguimiento__actions">
              <button
                className="seguimiento__completar-button"
                onClick={handleCompletarDiligencia}
                disabled={completando || diligencia.estado === 'completada'}
              >
                {completando ? 'Completando...' : 'Completar Diligencia'}
              </button>
            </div>
          )}
        </div>
        
        <div className="seguimiento__tracking">
          <Tracking diligenciaId={diligencia.id} estado={diligencia.estado} />
        </div>
      </div>
    </div>
  )
}

export default Seguimiento

