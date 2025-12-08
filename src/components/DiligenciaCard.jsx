import '../styles/DiligenciaCard.css'

function DiligenciaCard({ diligencia }) {
  const getEstadoClass = (estado) => {
    const estados = {
      'pendiente': 'diligencia-card__estado--pendiente',
      'en-progreso': 'diligencia-card__estado--en-progreso',
      'completada': 'diligencia-card__estado--completada'
    }
    return estados[estado] || ''
  }

  const getUrgenciaLabel = (urgencia) => {
    const labels = {
      'normal': 'Normal',
      'urgente': 'Urgente',
      'muy-urgente': 'Muy Urgente'
    }
    return labels[urgencia] || urgencia
  }

  const getTipoLabel = (tipo) => {
    const tipos = {
      'entrega': '📦 Entrega',
      'documento': '📄 Documento',
      'pago': '💳 Pago',
      'compra': '🛒 Compra',
      'fila': '⏳ Fila',
      'otro': '📋 Otro'
    }
    return tipos[tipo] || tipo
  }

  return (
    <div className="diligencia-card">
      <div className="diligencia-card__header">
        <h3 className="diligencia-card__titulo">{diligencia.titulo}</h3>
        <span className={`diligencia-card__estado ${getEstadoClass(diligencia.estado)}`}>
          {diligencia.estado.replace('-', ' ')}
        </span>
      </div>
      
      <p className="diligencia-card__descripcion">{diligencia.descripcion}</p>
      
      <div className="diligencia-card__info">
        <div className="diligencia-card__campo">
          <span className="diligencia-card__label">Tipo:</span>
          <span className="diligencia-card__valor">{getTipoLabel(diligencia.tipo)}</span>
        </div>
        <div className="diligencia-card__campo">
          <span className="diligencia-card__label">Urgencia:</span>
          <span className="diligencia-card__valor">{getUrgenciaLabel(diligencia.urgencia)}</span>
        </div>
        <div className="diligencia-card__campo">
          <span className="diligencia-card__label">Precio:</span>
          <span className="diligencia-card__precio">${diligencia.precio.toLocaleString()}</span>
        </div>
      </div>

      <div className="diligencia-card__ubicaciones">
        <div className="diligencia-card__ubicacion">
          <span className="diligencia-card__ubicacion-label">📍 Inicio:</span>
          <span className="diligencia-card__ubicacion-texto">{diligencia.puntoInicio}</span>
        </div>
        <div className="diligencia-card__ubicacion">
          <span className="diligencia-card__ubicacion-label">🎯 Destino:</span>
          <span className="diligencia-card__ubicacion-texto">{diligencia.puntoDestino}</span>
        </div>
      </div>

      {diligencia.gestor && (
        <div className="diligencia-card__gestor">
          <span className="diligencia-card__gestor-label">Gestor asignado:</span>
          <span className="diligencia-card__gestor-nombre">{diligencia.gestor.nombre}</span>
        </div>
      )}
    </div>
  )
}

export default DiligenciaCard

