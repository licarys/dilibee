import { Link } from 'react-router-dom'
import '../styles/InviteSignup.css'

function InviteSignup({ title = 'Crear una cuenta', message = 'Para acceder a esta funcionalidad, necesitas crear una cuenta.' }) {
  return (
    <div className="invite-signup">
      <div className="invite-signup__container">
        <div className="invite-signup__icon">🚀</div>
        <h2 className="invite-signup__title">{title}</h2>
        <p className="invite-signup__message">{message}</p>
        <div className="invite-signup__benefits">
          <div className="invite-signup__benefit">
            <span className="invite-signup__benefit-icon">✓</span>
            <span>Crea y gestiona tus diligencias</span>
          </div>
          <div className="invite-signup__benefit">
            <span className="invite-signup__benefit-icon">✓</span>
            <span>Accede a tu historial completo</span>
          </div>
          <div className="invite-signup__benefit">
            <span className="invite-signup__benefit-icon">✓</span>
            <span>Conecta con gestores verificados</span>
          </div>
          <div className="invite-signup__benefit">
            <span className="invite-signup__benefit-icon">✓</span>
            <span>Seguimiento en tiempo real</span>
          </div>
        </div>
        <div className="invite-signup__actions">
          <Link to="/login" className="invite-signup__button invite-signup__button--primary">
            Crear Cuenta o Iniciar Sesión
          </Link>
          <Link to="/" className="invite-signup__button invite-signup__button--secondary">
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default InviteSignup

