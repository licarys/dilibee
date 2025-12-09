import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getUsuarioActual, isAuthenticated, logout } from '../utils/auth'
import '../styles/Header.css'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [usuario, setUsuario] = useState(null)
  const location = useLocation()

  useEffect(() => {
    // Actualizar usuario cuando cambia la ubicación o se monta el componente
    if (isAuthenticated()) {
      setUsuario(getUsuarioActual())
    } else {
      setUsuario(null)
    }
  }, [location])

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
            className={`header__nav-link ${isActive('/') || (usuario?.tipo === 'gestor' && isActive('/gestor')) ? 'header__nav-link--active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            {usuario?.tipo === 'gestor' ? 'Panel Gestor' : 'Inicio'}
          </Link>
          
          {usuario?.tipo === 'gestor' ? (
            <>
              <Link 
                to="/historial-gestor" 
                className={`header__nav-link ${isActive('/historial-gestor')}`}
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
            </>
          ) : (
            <>
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
            </>
          )}
          {usuario ? (
            <div className="header__user-section">
              <span className="header__user-name">{usuario.nombre}</span>
              <button 
                className="header__logout-button"
                onClick={() => {
                  logout()
                  setIsMenuOpen(false)
                }}
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className={`header__nav-link ${isActive('/login')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Iniciar Sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header

