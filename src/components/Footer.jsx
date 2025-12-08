import { Link } from 'react-router-dom'
import '../styles/Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__section">
          <h3 className="footer__title">DiliBee</h3>
          <p className="footer__description">
            Diligencias rápidas a tu alcance. Conectamos personas con gestores verificados.
          </p>
        </div>

        <div className="footer__section">
          <h4 className="footer__subtitle">Enlaces Rápidos</h4>
          <ul className="footer__links">
            <li>
              <Link to="/" className="footer__link">Inicio</Link>
            </li>
            <li>
              <Link to="/buscar" className="footer__link">Buscar</Link>
            </li>
            <li>
              <Link to="/crear-diligencia" className="footer__link">Crear Diligencia</Link>
            </li>
            <li>
              <Link to="/historial" className="footer__link">Historial</Link>
            </li>
          </ul>
        </div>

        <div className="footer__section">
          <h4 className="footer__subtitle">Información</h4>
          <ul className="footer__links">
            <li>
              <a href="#sobre-nosotros" className="footer__link">Sobre Nosotros</a>
            </li>
            <li>
              <a href="#contacto" className="footer__link">Contacto</a>
            </li>
            <li>
              <a href="#terminos" className="footer__link">Términos y Condiciones</a>
            </li>
            <li>
              <a href="#privacidad" className="footer__link">Política de Privacidad</a>
            </li>
          </ul>
        </div>

        <div className="footer__section">
          <h4 className="footer__subtitle">Síguenos</h4>
          <div className="footer__social">
            <a href="#facebook" className="footer__social-link" aria-label="Facebook">
              📘
            </a>
            <a href="#twitter" className="footer__social-link" aria-label="Twitter">
              🐦
            </a>
            <a href="#instagram" className="footer__social-link" aria-label="Instagram">
              📷
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">
          © {currentYear} DiliBee. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}

export default Footer

