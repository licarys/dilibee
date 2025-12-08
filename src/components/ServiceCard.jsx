import '../styles/ServiceCard.css'

function ServiceCard({ icon, title, description, popular = false }) {
  return (
    <div className={`service-card ${popular ? 'service-card--popular' : ''}`}>
      {popular && <span className="service-card__badge">Popular</span>}
      <div className="service-card__icon">{icon}</div>
      <h3 className="service-card__title">{title}</h3>
      <p className="service-card__description">{description}</p>
    </div>
  )
}

export default ServiceCard

