import { useState, useEffect, useCallback } from 'react'
import { apiService } from '../utils/api'

function useDiligencias(estado = 'todas') {
  const [diligencias, setDiligencias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDiligencias = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      let response
      if (estado === 'todas') {
        response = await apiService.getDiligencias()
      } else {
        response = await apiService.getDiligenciasByEstado(estado)
      }
      setDiligencias(response.data || [])
    } catch (err) {
      setError('Error al cargar diligencias. Por favor, intenta nuevamente.')
      console.error('Error:', err)
      setDiligencias([])
    } finally {
      setLoading(false)
    }
  }, [estado])

  useEffect(() => {
    loadDiligencias()
  }, [loadDiligencias])

  const crearDiligencia = async (diligenciaData) => {
    setLoading(true)
    setError('')
    try {
      const response = await apiService.createDiligencia(diligenciaData)
      // Recargar las diligencias después de crear una nueva
      await loadDiligencias()
      return { success: true, data: response.data }
    } catch (err) {
      const errorMsg = 'Error al crear la diligencia. Por favor, intenta nuevamente.'
      setError(errorMsg)
      console.error('Error:', err)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const buscarDiligencias = async (searchTerm) => {
    setLoading(true)
    setError('')
    try {
      const response = await apiService.searchDiligencias(searchTerm)
      setDiligencias(response.data || [])
    } catch (err) {
      setError('Error al buscar diligencias.')
      console.error('Error:', err)
      setDiligencias([])
    } finally {
      setLoading(false)
    }
  }

  const refrescar = () => {
    loadDiligencias()
  }

  return {
    diligencias,
    loading,
    error,
    crearDiligencia,
    buscarDiligencias,
    refrescar
  }
}

export default useDiligencias

