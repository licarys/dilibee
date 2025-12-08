import '../styles/TestimonialCard.css'

function TestimonialCard({ name, role, comment, rating, avatar }) {
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐')
    }
    return stars.join('')
  }

  return (
    <div className="testimonial-card">
      <div className="testimonial-card__header">
        <div className="testimonial-card__avatar">{avatar || '👤'}</div>
        <div className="testimonial-card__info">
          <h4 className="testimonial-card__name">{name}</h4>
          <p className="testimonial-card__role">{role}</p>
        </div>
        <div className="testimonial-card__rating">{renderStars(rating)}</div>
      </div>
      <p className="testimonial-card__comment">"{comment}"</p>
    </div>
  )
}

export default TestimonialCard

