import { useState, useEffect } from 'react'
import '../styles/Tracking.css'

function Tracking({ diligenciaId }) {
  const [estado, setEstado] = useState('pendiente')
  const [ubicacion, setUbicacion] = useState(null)

  useEffect(() => {
    // Simular actualización de estado y ubicación
    const interval = setInterval(() => {
      // En producción, esto vendría de la API
      const estados = ['pendiente', 'en-progreso', 'completada']
      const indiceAleatorio = Math.floor(Math.random() * estados.length)
      // No cambiar si ya está completada
      if (estado !== 'completada') {
        setEstado(estados[indiceAleatorio])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [estado])

  const getEstadoLabel = (estado) => {
    const labels = {
      'pendiente': 'Pendiente',
      'en-progreso': 'En Progreso',
      'completada': 'Completada'
    }
    return labels[estado] || estado
  }

  const getProgreso = () => {
    const progresos = {
      'pendiente': 0,
      'en-progreso': 50,
      'completada': 100
    }
    return progresos[estado] || 0
  }

  return (
    <div className="tracking">
      <h3 className="tracking__title">Seguimiento de Diligencia #{diligenciaId}</h3>
      
      <div className="tracking__estado">
        <span className={`tracking__estado-badge tracking__estado-badge--${estado}`}>
          {getEstadoLabel(estado)}
        </span>
      </div>

      <div className="tracking__progreso">
        <div className="tracking__progreso-bar">
          <div 
            className="tracking__progreso-fill"
            style={{ width: `${getProgreso()}%` }}
          ></div>
        </div>
        <span className="tracking__progreso-text">{getProgreso()}% completado</span>
      </div>

      <div className="tracking__timeline">
        <div className={`tracking__step ${estado !== 'pendiente' ? 'tracking__step--completed' : ''}`}>
          <div className="tracking__step-icon">1</div>
          <div className="tracking__step-label">Solicitada</div>
        </div>
        <div className={`tracking__step ${estado === 'en-progreso' || estado === 'completada' ? 'tracking__step--completed' : ''}`}>
          <div className="tracking__step-icon">2</div>
          <div className="tracking__step-label">En Progreso</div>
        </div>
        <div className={`tracking__step ${estado === 'completada' ? 'tracking__step--completed' : ''}`}>
          <div className="tracking__step-icon">3</div>
          <div className="tracking__step-label">Completada</div>
        </div>
      </div>
    </div>
  )
}

export default Tracking

