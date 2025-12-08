import { useState } from 'react'
import useDiligencias from '../hooks/useDiligencias'
import DiligenciaCard from '../components/DiligenciaCard'
import Loading from '../components/Loading'
import Message from '../components/Message'
import '../styles/Historial.css'

function Historial() {
  const [filtro, setFiltro] = useState('todas')
  const { diligencias, loading, error, refrescar } = useDiligencias(filtro)

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

