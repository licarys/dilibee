import { useState, useEffect } from 'react'
import { apiService } from '../utils/api'
import DiligenciaCard from '../components/DiligenciaCard'
import '../styles/Historial.css'

function Historial() {
  const [diligencias, setDiligencias] = useState([])
  const [filtro, setFiltro] = useState('todas')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDiligencias()
  }, [])

  useEffect(() => {
    if (filtro !== 'todas') {
      loadDiligenciasByEstado()
    } else {
      loadDiligencias()
    }
  }, [filtro])

  const loadDiligencias = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await apiService.getDiligencias()
      setDiligencias(response.data || [])
    } catch (err) {
      setError('Error al cargar el historial. Por favor, intenta nuevamente.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadDiligenciasByEstado = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await apiService.getDiligenciasByEstado(filtro)
      setDiligencias(response.data || [])
    } catch (err) {
      setError('Error al filtrar diligencias. Por favor, intenta nuevamente.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

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
        <div className="historial__error">
          {error}
        </div>
      )}

      <div className="historial__lista">
        {loading && (
          <p className="historial__empty">
            Cargando diligencias...
          </p>
        )}

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

