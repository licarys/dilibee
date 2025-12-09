import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsuarioActual, isAuthenticated } from '../utils/auth'
import InviteSignup from '../components/InviteSignup'
import '../styles/Perfil.css'

function Perfil() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipo: 'usuario'
  })

  const [editando, setEditando] = useState(false)

  useEffect(() => {
    // Cargar datos del usuario actual desde localStorage
    if (isAuthenticated()) {
      const usuarioActual = getUsuarioActual()
      if (usuarioActual) {
        setUsuario({
          nombre: usuarioActual.nombre || '',
          email: usuarioActual.email || '',
          telefono: usuarioActual.telefono || '',
          tipo: usuarioActual.tipo || 'usuario',
          ...(usuarioActual.zona && { zona: usuarioActual.zona }),
          ...(usuarioActual.calificacion && { calificacion: usuarioActual.calificacion })
        })
      }
    }
  }, [])

  // Si no está autenticado, mostrar invitación
  if (!isAuthenticated()) {
    return (
      <InviteSignup 
        title="Accede a tu perfil"
        message="Crea una cuenta para gestionar tu perfil y mantener tus datos actualizados."
      />
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUsuario(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Lógica de actualización se implementará más adelante
    console.log('Perfil actualizado:', usuario)
    setEditando(false)
    alert('Perfil actualizado (simulación)')
  }

  return (
    <div className="perfil">
      <h1 className="perfil__title">Mi Perfil</h1>
      
      {!editando ? (
        <div className="perfil__info">
          <div className="perfil__campo">
            <span className="perfil__label">Nombre:</span>
            <span className="perfil__valor">{usuario.nombre}</span>
          </div>
          <div className="perfil__campo">
            <span className="perfil__label">Email:</span>
            <span className="perfil__valor">{usuario.email}</span>
          </div>
          <div className="perfil__campo">
            <span className="perfil__label">Teléfono:</span>
            <span className="perfil__valor">{usuario.telefono}</span>
          </div>
          <div className="perfil__campo">
            <span className="perfil__label">Tipo:</span>
            <span className="perfil__valor">{usuario.tipo}</span>
          </div>
          {usuario.zona && (
            <div className="perfil__campo">
              <span className="perfil__label">Zona:</span>
              <span className="perfil__valor">{usuario.zona}</span>
            </div>
          )}
          {usuario.calificacion && (
            <div className="perfil__campo">
              <span className="perfil__label">Calificación:</span>
              <span className="perfil__valor">⭐ {usuario.calificacion}</span>
            </div>
          )}
          <button 
            className="perfil__editar"
            onClick={() => setEditando(true)}
          >
            Editar Perfil
          </button>
        </div>
      ) : (
        <form className="perfil__form" onSubmit={handleSubmit}>
          <div className="perfil__field">
            <label htmlFor="nombre" className="perfil__form-label">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="perfil__form-input"
              value={usuario.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="perfil__field">
            <label htmlFor="email" className="perfil__form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="perfil__form-input"
              value={usuario.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="perfil__field">
            <label htmlFor="telefono" className="perfil__form-label">Teléfono</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              className="perfil__form-input"
              value={usuario.telefono}
              onChange={handleChange}
              required
            />
          </div>
          <div className="perfil__actions">
            <button type="submit" className="perfil__guardar">
              Guardar
            </button>
            <button 
              type="button" 
              className="perfil__cancelar"
              onClick={() => setEditando(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default Perfil

