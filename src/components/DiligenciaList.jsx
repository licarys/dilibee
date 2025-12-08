import { useState, useEffect } from 'react'
import DiligenciaCard from './DiligenciaCard'
import Loading from './Loading'
import Message from './Message'
import useDiligencias from '../hooks/useDiligencias'
import '../styles/DiligenciaList.css'

function DiligenciaList({ filtroEstado = 'todas', searchTerm = '' }) {
  const { diligencias, loading, error, buscarDiligencias, refrescar } = useDiligencias(filtroEstado)
  const [diligenciasMostradas, setDiligenciasMostradas] = useState([])

  useEffect(() => {
    if (searchTerm && searchTerm.trim() !== '') {
      buscarDiligencias(searchTerm)
    } else {
      refrescar()
    }
  }, [searchTerm])

  useEffect(() => {
    setDiligenciasMostradas(diligencias)
  }, [diligencias])

  if (loading) {
    return <Loading mensaje="Cargando diligencias..." />
  }

  if (error) {
    return <Message tipo="error" mensaje={error} />
  }

  if (diligenciasMostradas.length === 0) {
    return (
      <div className="diligencia-list">
        <p className="diligencia-list__empty">
          No hay diligencias para mostrar
        </p>
      </div>
    )
  }

  return (
    <div className="diligencia-list">
      <div className="diligencia-list__grid">
        {diligenciasMostradas.map(diligencia => (
          <DiligenciaCard key={diligencia.id} diligencia={diligencia} />
        ))}
      </div>
    </div>
  )
}

export default DiligenciaList

