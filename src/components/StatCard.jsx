import '../styles/StatCard.css'

function StatCard({ icon, number, label, color = 'gold' }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__content">
        <h3 className="stat-card__number">{number}</h3>
        <p className="stat-card__label">{label}</p>
      </div>
    </div>
  )
}

export default StatCard

