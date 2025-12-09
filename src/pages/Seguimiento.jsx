import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { apiService } from '../utils/api'
import Tracking from '../components/Tracking'
import DiligenciaCard from '../components/DiligenciaCard'
import Loading from '../components/Loading'
import Message from '../components/Message'
import '../styles/Seguimiento.css'

function Seguimiento() {
  const { id } = useParams()
  const [diligencia, setDiligencia] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      loadDiligencia()
    }
  }, [id])

  const loadDiligencia = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await apiService.getDiligenciaById(id)
      setDiligencia(response.data)
    } catch (err) {
      setError('Error al cargar la diligencia. Por favor, intenta nuevamente.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading mensaje="Cargando información de la diligencia..." />
  }

  if (error) {
    return <Message tipo="error" mensaje={error} />
  }

  if (!diligencia) {
    return (
      <div className="seguimiento">
        <Message tipo="warning" mensaje="Diligencia no encontrada" />
      </div>
    )
  }

  return (
    <div className="seguimiento">
      <h1 className="seguimiento__title">Seguimiento de Diligencia</h1>
      
      <div className="seguimiento__content">
        <div className="seguimiento__card">
          <DiligenciaCard diligencia={diligencia} />
        </div>
        
        <div className="seguimiento__tracking">
          <Tracking diligenciaId={diligencia.id} estado={diligencia.estado} />
        </div>
      </div>
    </div>
  )
}

export default Seguimiento

