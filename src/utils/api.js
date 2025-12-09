import axios from 'axios'
import diligenciasData from '../data/diligencias.json'
import gestoresData from '../data/gestores.json'
import usuariosData from '../data/usuarios.json'

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
  },

  // Obtener un usuario por ID
  async getUsuarioById(id) {
    await delay(300)
    const usuario = usuariosData.find(u => u.id === parseInt(id))
    
    if (!usuario) {
      throw new Error('Usuario no encontrado')
    }

    return {
      data: usuario,
      status: 200
    }
  },

  // Aceptar una diligencia (asignar a un gestor)
  async aceptarDiligencia(diligenciaId, gestorId) {
    await delay(600)
    
    // Obtener la diligencia
    const diligencia = diligenciasData.find(d => d.id === parseInt(diligenciaId))
    
    if (!diligencia) {
      throw new Error('Diligencia no encontrada')
    }

    // Verificar si la diligencia ya está asignada
    if (diligencia.gestor) {
      throw new Error('Esta diligencia ya está asignada a otro gestor')
    }

    // Buscar el gestor en usuarios.json (donde están los gestores logueados)
    const gestor = usuariosData.find(u => u.id === parseInt(gestorId) && u.tipo === 'gestor')
    
    if (!gestor) {
      throw new Error('Gestor no encontrado')
    }

    // Verificar si el gestor ya tiene diligencias activas (no completadas)
    const diligenciasActivasDelGestor = diligenciasData.filter(
      d => d.gestor && d.gestor.id === parseInt(gestorId) && d.estado !== 'completada'
    )

    if (diligenciasActivasDelGestor.length > 0) {
      throw new Error('Ya tienes una diligencia en progreso. Completa la diligencia actual antes de aceptar otra.')
    }

    // Actualizar la diligencia (en producción esto actualizaría la base de datos)
    const diligenciaActualizada = {
      ...diligencia,
      estado: 'en-progreso',
      gestor: {
        id: gestor.id,
        nombre: gestor.nombre,
        calificacion: gestor.calificacion || 0,
        telefono: gestor.telefono
      }
    }

    return {
      data: diligenciaActualizada,
      status: 200
    }
  },

  // Completar una diligencia
  async completarDiligencia(diligenciaId, gestorId) {
    await delay(600)
    
    // Obtener la diligencia
    const diligencia = diligenciasData.find(d => d.id === parseInt(diligenciaId))
    
    if (!diligencia) {
      throw new Error('Diligencia no encontrada')
    }

    // Verificar que la diligencia esté asignada al gestor
    if (!diligencia.gestor || diligencia.gestor.id !== parseInt(gestorId)) {
      throw new Error('No tienes permisos para completar esta diligencia')
    }

    // Verificar que la diligencia esté en progreso
    if (diligencia.estado !== 'en-progreso') {
      throw new Error('Solo se pueden completar diligencias en progreso')
    }

    // Actualizar la diligencia a completada
    const diligenciaActualizada = {
      ...diligencia,
      estado: 'completada'
    }

    return {
      data: diligenciaActualizada,
      status: 200
    }
  }
}

export default api

