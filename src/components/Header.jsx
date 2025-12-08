import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/Header.css'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Cerrar el menú móvil cuando cambia la ruta
    setIsMenuOpen(false)
  }, [location])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isActive = (path) => {
    return location.pathname === path ? 'header__nav-link--active' : ''
  }

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          <span className="header__logo-icon">🐝</span>
          <span className="header__logo-text">DiliBee</span>
        </Link>

        <button 
          className="header__menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`header__menu-icon ${isMenuOpen ? 'header__menu-icon--open' : ''}`}>
            ☰
          </span>
        </button>

        <nav className={`header__nav ${isMenuOpen ? 'header__nav--open' : ''}`}>
          <Link 
            to="/" 
            className={`header__nav-link ${isActive('/')}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link 
            to="/buscar" 
            className={`header__nav-link ${isActive('/buscar')}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Buscar
          </Link>
          <Link 
            to="/crear-diligencia" 
            className={`header__nav-link ${isActive('/crear-diligencia')}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Crear Diligencia
          </Link>
          <Link 
            to="/historial" 
            className={`header__nav-link ${isActive('/historial')}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Historial
          </Link>
          <Link 
            to="/perfil" 
            className={`header__nav-link ${isActive('/perfil')}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Perfil
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header

