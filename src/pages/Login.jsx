import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usuariosData from '../data/usuarios.json'
import Message from '../components/Message'
import '../styles/Login.css'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error cuando el usuario edita
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500))

      // Buscar usuario en el JSON
      const usuario = usuariosData.find(
        u => u.email === formData.email && u.password === formData.password
      )

      if (usuario) {
        // Guardar usuario actual en localStorage
        const usuarioActual = {
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          tipo: usuario.tipo,
          telefono: usuario.telefono,
          ...(usuario.zona && { zona: usuario.zona }),
          ...(usuario.calificacion && { calificacion: usuario.calificacion })
        }
        
        localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual))
        localStorage.setItem('isAuthenticated', 'true')

        // Redirigir según el tipo de usuario
        if (usuario.tipo === 'gestor') {
          navigate('/buscar')
        } else {
          navigate('/')
        }

        // Recargar la página para actualizar el estado global
        window.location.reload()
      } else {
        setError('Email o contraseña incorrectos. Por favor, intenta nuevamente.')
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intenta nuevamente.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__header">
          <h1 className="login__title">🐝 DiliBee</h1>
          <p className="login__subtitle">Inicia sesión en tu cuenta</p>
        </div>

        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__field">
            <label htmlFor="email" className="login__label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="login__input"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="login__field">
            <label htmlFor="password" className="login__label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="login__input"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <Message tipo="error" mensaje={error} />
          )}

          <button 
            type="submit" 
            className="login__button"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login__demo">
          <p className="login__demo-title">Cuentas de demostración:</p>
          <div className="login__demo-accounts">
            <div className="login__demo-account">
              <strong>Usuario:</strong> usuario@dilibee.com / usuario123
            </div>
            <div className="login__demo-account">
              <strong>Gestor:</strong> gestor@dilibee.com / gestor123
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

