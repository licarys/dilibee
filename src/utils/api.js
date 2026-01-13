import axios from 'axios'

// API base - ahora apunta al backend de Azure
const api = axios.create({
  baseURL: 'https://dilibeex.azurewebsites.net/api',
  timeout: 10000,
})

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en API:', error)
    return Promise.reject(error)
  }
)

// Funciones para conectar con el backend SQL Server
export const apiService = {
  // Obtener todas las diligencias
  async getDiligencias() {
    try {
      const response = await api.get('/diligencias')
      return response.data
    } catch (error) {
      console.error('Error al obtener diligencias:', error)
      throw error
    }
  },

  // Buscar diligencias por término
  async searchDiligencias(searchTerm) {
    try {
      const response = await api.get('/diligencias/search', {
        params: { term: searchTerm }
      })
      return response.data
    } catch (error) {
      console.error('Error al buscar diligencias:', error)
      throw error
    }
  },

  // Obtener diligencias por estado
  async getDiligenciasByEstado(estado) {
    try {
      const response = await api.get(`/diligencias/estado/${estado}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener diligencias por estado:', error)
      throw error
    }
  },

  // Obtener una diligencia por ID
  async getDiligenciaById(id) {
    try {
      const response = await api.get(`/diligencias/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener diligencia:', error)
      throw error
    }
  },

  // Crear nueva diligencia
  async createDiligencia(diligenciaData) {
    try {
      const response = await api.post('/diligencias', diligenciaData)
      return response.data
    } catch (error) {
      console.error('Error al crear diligencia:', error)
      throw error
    }
  },

  // Obtener todos los gestores
  async getGestores() {
    try {
      const response = await api.get('/gestores')
      return response.data
    } catch (error) {
      console.error('Error al obtener gestores:', error)
      throw error
    }
  },

  // Buscar gestores por término
  async searchGestores(searchTerm) {
    try {
      const response = await api.get('/gestores/search', {
        params: { term: searchTerm }
      })
      return response.data
    } catch (error) {
      console.error('Error al buscar gestores:', error)
      throw error
    }
  },

  // Obtener gestores disponibles
  async getGestoresDisponibles() {
    try {
      const response = await api.get('/gestores/disponibles')
      return response.data
    } catch (error) {
      console.error('Error al obtener gestores disponibles:', error)
      throw error
    }
  },

  // Obtener un gestor por ID
  async getGestorById(id) {
    try {
      const response = await api.get(`/gestores/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener gestor:', error)
      throw error
    }
  },

  // Obtener un usuario por ID
  async getUsuarioById(id) {
    try {
      const response = await api.get(`/usuarios/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      throw error
    }
  },

  // Aceptar una diligencia (asignar a un gestor)
  async aceptarDiligencia(diligenciaId, gestorId) {
    try {
      const response = await api.post(`/diligencias/${diligenciaId}/aceptar`, { gestorId })
      return response.data
    } catch (error) {
      console.error('Error al aceptar diligencia:', error)
      // Si el backend devuelve un error específico, lo propagamos
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error)
      }
      throw error
    }
  },

  // Completar una diligencia
  async completarDiligencia(diligenciaId, gestorId) {
    try {
      const response = await api.post(`/diligencias/${diligenciaId}/completar`, { gestorId })
      return response.data
    } catch (error) {
      console.error('Error al completar diligencia:', error)
      // Si el backend devuelve un error específico, lo propagamos
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error)
      }
      throw error
    }
  }
}

export default api

