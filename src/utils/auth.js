// Utilidades para manejar autenticación

export const getUsuarioActual = () => {
  try {
    const usuarioStr = localStorage.getItem('usuarioActual')
    if (usuarioStr) {
      return JSON.parse(usuarioStr)
    }
    return null
  } catch (error) {
    console.error('Error al obtener usuario actual:', error)
    return null
  }
}

export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true'
}

export const logout = () => {
  localStorage.removeItem('usuarioActual')
  localStorage.removeItem('isAuthenticated')
  window.location.href = '/login'
}

export const getTipoUsuario = () => {
  const usuario = getUsuarioActual()
  return usuario?.tipo || null
}

