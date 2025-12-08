import axios from 'axios'
import diligenciasData from '../data/diligencias.json'
import gestoresData from '../data/gestores.json'

// Simular delay de red
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// API base - en producción sería una URL real
const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

// Interceptor para simular peticiones HTTP
api.interceptors.request.use(async (config) => {
  await delay(300)
  return config
})

// Interceptor para simular respuestas
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    await delay(300)
    return Promise.reject(error)
  }
)

// Funciones para obtener datos simulados
export const apiService = {
  // Obtener todas las diligencias
  async getDiligencias() {
    await delay(500)
    return {
      data: diligenciasData,
      status: 200
    }
  },

  // Buscar diligencias por término
  async searchDiligencias(searchTerm) {
    await delay(500)
    if (!searchTerm || searchTerm.trim() === '') {
      return {
        data: diligenciasData,
        status: 200
      }
    }

    const term = searchTerm.toLowerCase()
    const filtered = diligenciasData.filter(diligencia => 
      diligencia.titulo.toLowerCase().includes(term) ||
      diligencia.descripcion.toLowerCase().includes(term) ||
      diligencia.tipo.toLowerCase().includes(term) ||
      diligencia.puntoInicio.toLowerCase().includes(term) ||
      diligencia.puntoDestino.toLowerCase().includes(term)
    )

    return {
      data: filtered,
      status: 200
    }
  },

  // Obtener diligencias por estado
  async getDiligenciasByEstado(estado) {
    await delay(400)
    const filtered = estado === 'todas' 
      ? diligenciasData 
      : diligenciasData.filter(d => d.estado === estado)
    
    return {
      data: filtered,
      status: 200
    }
  },

  // Obtener una diligencia por ID
  async getDiligenciaById(id) {
    await delay(300)
    const diligencia = diligenciasData.find(d => d.id === parseInt(id))
    
    if (!diligencia) {
      throw new Error('Diligencia no encontrada')
    }

    return {
      data: diligencia,
      status: 200
    }
  },

  // Crear nueva diligencia
  async createDiligencia(diligenciaData) {
    await delay(600)
    const newDiligencia = {
      id: diligenciasData.length + 1,
      ...diligenciaData,
      fechaCreacion: new Date().toISOString().split('T')[0],
      estado: 'pendiente'
    }

    return {
      data: newDiligencia,
      status: 201
    }
  },

  // Obtener todos los gestores
  async getGestores() {
    await delay(500)
    return {
      data: gestoresData,
      status: 200
    }
  },

  // Buscar gestores por término
  async searchGestores(searchTerm) {
    await delay(500)
    if (!searchTerm || searchTerm.trim() === '') {
      return {
        data: gestoresData,
        status: 200
      }
    }

    const term = searchTerm.toLowerCase()
    const filtered = gestoresData.filter(gestor => 
      gestor.nombre.toLowerCase().includes(term) ||
      gestor.zona.toLowerCase().includes(term) ||
      gestor.vehiculo.toLowerCase().includes(term)
    )

    return {
      data: filtered,
      status: 200
    }
  },

  // Obtener gestores disponibles
  async getGestoresDisponibles() {
    await delay(400)
    const disponibles = gestoresData.filter(g => g.disponible)
    
    return {
      data: disponibles,
      status: 200
    }
  },

  // Obtener un gestor por ID
  async getGestorById(id) {
    await delay(300)
    const gestor = gestoresData.find(g => g.id === parseInt(id))
    
    if (!gestor) {
      throw new Error('Gestor no encontrado')
    }

    return {
      data: gestor,
      status: 200
    }
  }
}

export default api

