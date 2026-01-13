import axios from 'axios'

// API base - ahora apunta al backend de Azure
// Usar URL absoluta completa para evitar que Vercel intercepte las peticiones
const API_BASE_URL = 'https://dilibeex.azurewebsites.net/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  // Asegurar que las peticiones sean absolutas
  validateStatus: function (status) {
    return status >= 200 && status < 300
  }
})

// Interceptor para agregar timestamp a las peticiones GET y evitar caché
api.interceptors.request.use(
  (config) => {
    // Agregar timestamp a las peticiones GET para evitar caché
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    // Log para debugging (solo en desarrollo)
    if (import.meta.env.DEV) {
      const fullUrl = config.baseURL + (config.url.startsWith('/') ? config.url : '/' + config.url)
      console.log('API Request:', config.method?.toUpperCase(), fullUrl)
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para validar respuestas y detectar HTML (cuando Vercel intercepta)
api.interceptors.response.use(
  (response) => {
    // Verificar si la respuesta es HTML en lugar de JSON
    const contentType = response.headers['content-type'] || ''
    if (contentType.includes('text/html')) {
      console.error('Error: Se recibió HTML en lugar de JSON. La petición fue interceptada por Vercel.')
      console.error('URL solicitada:', response.config.url)
      console.error('Base URL:', response.config.baseURL)
      throw new Error('La API devolvió HTML en lugar de JSON. Verifica que las peticiones vayan directamente a Azure.')
    }
    return response
  },
  (error) => {
    console.error('Error en API:', error)
    // Si el error tiene una respuesta HTML, informarlo
    if (error.response && error.response.headers && error.response.headers['content-type']?.includes('text/html')) {
      console.error('Error: La respuesta del servidor es HTML. Posible problema de routing en Vercel.')
    }
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

