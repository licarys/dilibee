import { useState, useEffect } from 'react'
import '../styles/Historial.css'

function Historial() {
  const [diligencias, setDiligencias] = useState([])
  const [filtro, setFiltro] = useState('todas')

  useEffect(() => {
    // En producción, esto vendría de una API
    // Simulamos datos de ejemplo
    const datosEjemplo = [
      {
        id: 1,
        titulo: 'Entrega de documentos',
        estado: 'completada',
        fecha: '2024-01-15',
        gestor: 'Juan Pérez'
      },
      {
        id: 2,
        titulo: 'Pago de trámite',
        estado: 'en-progreso',
        fecha: '2024-01-20',
        gestor: 'María González'
      }
    ]
    setDiligencias(datosEjemplo)
  }, [])

  const diligenciasFiltradas = filtro === 'todas' 
    ? diligencias 
    : diligencias.filter(d => d.estado === filtro)

  return (
    <div className="historial">
      <h1 className="historial__title">Historial de Diligencias</h1>
      
      <div className="historial__filtros">
        <button
          className={`historial__filtro ${filtro === 'todas' ? 'historial__filtro--active' : ''}`}
          onClick={() => setFiltro('todas')}
        >
          Todas
        </button>
        <button
          className={`historial__filtro ${filtro === 'completada' ? 'historial__filtro--active' : ''}`}
          onClick={() => setFiltro('completada')}
        >
          Completadas
        </button>
        <button
          className={`historial__filtro ${filtro === 'en-progreso' ? 'historial__filtro--active' : ''}`}
          onClick={() => setFiltro('en-progreso')}
        >
          En Progreso
        </button>
        <button
          className={`historial__filtro ${filtro === 'pendiente' ? 'historial__filtro--active' : ''}`}
          onClick={() => setFiltro('pendiente')}
        >
          Pendientes
        </button>
      </div>

      <div className="historial__lista">
        {diligenciasFiltradas.length === 0 ? (
          <p className="historial__empty">
            No hay diligencias para mostrar
          </p>
        ) : (
          diligenciasFiltradas.map(diligencia => (
            <div key={diligencia.id} className="historial__item">
              <h3 className="historial__item-titulo">{diligencia.titulo}</h3>
              <p className="historial__item-gestor">Gestor: {diligencia.gestor}</p>
              <p className="historial__item-fecha">Fecha: {diligencia.fecha}</p>
              <span className={`historial__item-estado historial__item-estado--${diligencia.estado}`}>
                {diligencia.estado}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Historial

