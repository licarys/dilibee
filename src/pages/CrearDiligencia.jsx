import { useState } from 'react'
import '../styles/CrearDiligencia.css'

function CrearDiligencia() {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    puntoInicio: '',
    puntoDestino: '',
    tipo: 'entrega',
    urgencia: 'normal'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Lógica de envío se implementará más adelante
    console.log('Diligencia creada:', formData)
    alert('¡Diligencia creada! (simulación)')
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

        <button type="submit" className="crear-diligencia__submit">
          Crear Diligencia
        </button>
      </form>
    </div>
  )
}

export default CrearDiligencia

