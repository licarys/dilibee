import '../styles/GestorCard.css'

function GestorCard({ gestor }) {
  const renderStars = (calificacion) => {
    const stars = []
    const fullStars = Math.floor(calificacion)
    const hasHalfStar = calificacion % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐')
    }
    if (hasHalfStar) {
      stars.push('⭐')
    }
    return stars.join('')
  }

  return (
    <div className={`gestor-card ${!gestor.disponible ? 'gestor-card--no-disponible' : ''}`}>
      <div className="gestor-card__header">
        <div className="gestor-card__foto">{gestor.foto}</div>
        <div className="gestor-card__info-principal">
          <h3 className="gestor-card__nombre">{gestor.nombre}</h3>
          <div className="gestor-card__calificacion">
            <span className="gestor-card__calificacion-numero">{gestor.calificacion}</span>
            <span className="gestor-card__estrellas">{renderStars(gestor.calificacion)}</span>
            <span className="gestor-card__total">({gestor.totalDiligencias} diligencias)</span>
          </div>
        </div>
        {gestor.disponible && (
          <span className="gestor-card__disponible">✓ Disponible</span>
        )}
        {!gestor.disponible && (
          <span className="gestor-card__no-disponible">✗ No disponible</span>
        )}
      </div>

      <div className="gestor-card__detalles">
        <div className="gestor-card__campo">
          <span className="gestor-card__label">📍 Zona:</span>
          <span className="gestor-card__valor">{gestor.zona}</span>
        </div>
        <div className="gestor-card__campo">
          <span className="gestor-card__label">🚗 Vehículo:</span>
          <span className="gestor-card__valor">{gestor.vehiculo}</span>
        </div>
        <div className="gestor-card__campo">
          <span className="gestor-card__label">📞 Teléfono:</span>
          <span className="gestor-card__valor">{gestor.telefono}</span>
        </div>
      </div>
    </div>
  )
}

export default GestorCard

