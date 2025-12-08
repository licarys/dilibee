import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../utils/api'
import '../styles/CrearDiligencia.css'

function CrearDiligencia() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    puntoInicio: '',
    puntoDestino: '',
    tipo: 'entrega',
    urgencia: 'normal',
    precio: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar mensajes cuando el usuario edita
    if (error) setError('')
    if (success) setSuccess(false)
  }

  const calcularPrecioEstimado = () => {
    let precioBase = 10000
    const multiplicadores = {
      'normal': 1,
      'urgente': 1.5,
      'muy-urgente': 2
    }
    const multiplicadorUrgencia = multiplicadores[formData.urgencia] || 1
    return Math.round(precioBase * multiplicadorUrgencia)
  }

  const handlePrecioFocus = () => {
    if (!formData.precio) {
      const precioEstimado = calcularPrecioEstimado()
      setFormData(prev => ({ ...prev, precio: precioEstimado.toString() }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const precio = parseInt(formData.precio) || calcularPrecioEstimado()
      
      const nuevaDiligencia = {
        ...formData,
        precio,
        usuario: {
          id: 1,
          nombre: 'Usuario Actual',
          calificacion: 4.5
        }
      }

      const response = await apiService.createDiligencia(nuevaDiligencia)
      
      setSuccess(true)
      setFormData({
        titulo: '',
        descripcion: '',
        puntoInicio: '',
        puntoDestino: '',
        tipo: 'entrega',
        urgencia: 'normal',
        precio: ''
      })

      // Redirigir al historial después de 2 segundos
      setTimeout(() => {
        navigate('/historial')
      }, 2000)

    } catch (err) {
      setError('Error al crear la diligencia. Por favor, intenta nuevamente.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="crear-diligencia">
      <h1 className="crear-diligencia__title">Crear Nueva Diligencia</h1>
      <form className="crear-diligencia__form" onSubmit={handleSubmit}>
        <div className="crear-diligencia__field">
          <label htmlFor="titulo" className="crear-diligencia__label">
            Título
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            className="crear-diligencia__input"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="crear-diligencia__field">
          <label htmlFor="descripcion" className="crear-diligencia__label">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            className="crear-diligencia__textarea"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="crear-diligencia__field">
          <label htmlFor="puntoInicio" className="crear-diligencia__label">
            Punto de Inicio
          </label>
          <input
            type="text"
            id="puntoInicio"
            name="puntoInicio"
            className="crear-diligencia__input"
            value={formData.puntoInicio}
            onChange={handleChange}
            placeholder="Ej: Calle 123, Ciudad"
            required
          />
        </div>

        <div className="crear-diligencia__field">
          <label htmlFor="puntoDestino" className="crear-diligencia__label">
            Punto de Destino
          </label>
          <input
            type="text"
            id="puntoDestino"
            name="puntoDestino"
            className="crear-diligencia__input"
            value={formData.puntoDestino}
            onChange={handleChange}
            placeholder="Ej: Calle 456, Ciudad"
            required
          />
        </div>

        <div className="crear-diligencia__field">
          <label htmlFor="tipo" className="crear-diligencia__label">
            Tipo de Diligencia
          </label>
          <select
            id="tipo"
            name="tipo"
            className="crear-diligencia__select"
            value={formData.tipo}
            onChange={handleChange}
          >
            <option value="entrega">Entrega de Paquete</option>
            <option value="documento">Recoger Documento</option>
            <option value="pago">Pago de Trámite</option>
            <option value="compra">Compra Urgente</option>
            <option value="fila">Hacer Fila</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div className="crear-diligencia__field">
          <label htmlFor="urgencia" className="crear-diligencia__label">
            Urgencia
          </label>
          <select
            id="urgencia"
            name="urgencia"
            className="crear-diligencia__select"
            value={formData.urgencia}
            onChange={handleChange}
          >
            <option value="normal">Normal</option>
            <option value="urgente">Urgente</option>
            <option value="muy-urgente">Muy Urgente</option>
          </select>
        </div>

        <div className="crear-diligencia__field">
          <label htmlFor="precio" className="crear-diligencia__label">
            Precio Estimado (COP)
          </label>
          <input
            type="number"
            id="precio"
            name="precio"
            className="crear-diligencia__input"
            value={formData.precio}
            onChange={handleChange}
            onFocus={handlePrecioFocus}
            placeholder="Se calculará automáticamente"
            min="0"
            required
          />
          <small className="crear-diligencia__hint">
            El precio se estima según la urgencia. Puedes ajustarlo manualmente.
          </small>
        </div>

        {error && (
          <div className="crear-diligencia__message crear-diligencia__message--error">
            {error}
          </div>
        )}

        {success && (
          <div className="crear-diligencia__message crear-diligencia__message--success">
            ¡Diligencia creada exitosamente! Redirigiendo al historial...
          </div>
        )}

        <button 
          type="submit" 
          className="crear-diligencia__submit"
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear Diligencia'}
        </button>
      </form>
    </div>
  )
}

export default CrearDiligencia

