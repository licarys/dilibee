# 📋 Documentación de Requisitos Cumplidos - DiliBee

Este documento detalla cómo se han cumplido todos los requisitos del proyecto DiliBee, una aplicación web para gestión de diligencias desarrollada con React.

---

## 1. Introducción

### Tipo de Aplicación

**DiliBee** es una aplicación web de tipo **Single Page Application (SPA)** desarrollada con React que conecta personas que necesitan resolver trámites urgentes con gestores verificados que pueden realizarlos de manera segura y eficiente.

### Motivos de la Decisión

Se eligió construir una aplicación web SPA con React por las siguientes razones:

- **Interactividad**: Permite una experiencia de usuario fluida sin recargas de página
- **Componentización**: Facilita la reutilización de código y mantenimiento
- **Rendimiento**: React optimiza las actualizaciones del DOM mediante Virtual DOM
- **Ecosistema**: Amplia comunidad y librerías disponibles (React Router, Axios, etc.)
- **Escalabilidad**: Arquitectura que permite crecer fácilmente con nuevas funcionalidades

La aplicación simula un sistema completo de gestión de diligencias donde usuarios pueden crear solicitudes y gestores pueden aceptarlas y completarlas, con seguimiento en tiempo real del estado de cada diligencia.

---

## 2. Implementación de Componentes Funcionales en React (mínimo 10)

La aplicación cuenta con **15 componentes funcionales** desarrollados con JSX. A continuación se listan todos los componentes:

### Componentes Principales

1. **Badge** (`src/components/Badge.jsx`) - Muestra etiquetas con diferentes variantes y tamaños
2. **Button** (`src/components/Button.jsx`) - Botón reutilizable con múltiples variantes y soporte para enlaces
3. **DiligenciaCard** (`src/components/DiligenciaCard.jsx`) - Tarjeta para mostrar información de diligencias
4. **DiligenciaList** (`src/components/DiligenciaList.jsx`) - Lista de diligencias con funcionalidad de filtrado
5. **Footer** (`src/components/Footer.jsx`) - Pie de página con enlaces e información
6. **GestorCard** (`src/components/GestorCard.jsx`) - Tarjeta para mostrar información de gestores
7. **Header** (`src/components/Header.jsx`) - Navegación principal con menú responsive
8. **InviteSignup** (`src/components/InviteSignup.jsx`) - Componente de invitación para usuarios no autenticados
9. **Loading** (`src/components/Loading.jsx`) - Indicador de carga
10. **Message** (`src/components/Message.jsx`) - Mensajes de éxito, error o advertencia
11. **SearchBar** (`src/components/SearchBar.jsx`) - Barra de búsqueda con funcionalidad en tiempo real
12. **ServiceCard** (`src/components/ServiceCard.jsx`) - Tarjeta para mostrar servicios disponibles
13. **StatCard** (`src/components/StatCard.jsx`) - Tarjeta de estadísticas con iconos
14. **TestimonialCard** (`src/components/TestimonialCard.jsx`) - Tarjeta para mostrar testimonios
15. **Tracking** (`src/components/Tracking.jsx`) - Componente visual de seguimiento de diligencias

### Ejemplo de Componente Funcional con JSX

```1:25:src/components/Badge.jsx
import '../styles/Badge.css'

function Badge({ children, variant = 'default', size = 'medium' }) {
  const variants = {
    'default': 'badge--default',
    'success': 'badge--success',
    'warning': 'badge--warning',
    'error': 'badge--error',
    'info': 'badge--info'
  }

  const sizes = {
    'small': 'badge--small',
    'medium': 'badge--medium',
    'large': 'badge--large'
  }

  return (
    <span className={`badge ${variants[variant] || variants.default} ${sizes[size] || sizes.medium}`}>
      {children}
    </span>
  )
}

export default Badge
```

Este componente muestra cómo se utiliza JSX para crear elementos HTML dinámicos con props y lógica condicional para aplicar clases CSS según las variantes.

---

## 3. Uso de los Hooks Principales de React: useState y useEffect

Los hooks `useState` y `useEffect` se utilizan extensivamente en toda la aplicación para manejar el estado de los componentes y los efectos secundarios.

### Componentes que utilizan useState y useEffect

- **Home** (`src/pages/Home.jsx`) - Maneja estadísticas y carga de datos
- **Buscar** (`src/pages/Buscar.jsx`) - Gestiona búsquedas, filtros y carga de datos
- **CrearDiligencia** (`src/pages/CrearDiligencia.jsx`) - Controla el formulario y validaciones
- **Header** (`src/components/Header.jsx`) - Maneja el estado del menú móvil y usuario actual
- **Seguimiento** (`src/pages/Seguimiento.jsx`) - Carga y actualiza información de diligencias
- **GestorDashboard** (`src/pages/GestorDashboard.jsx`) - Gestiona estadísticas y diligencias
- **Historial** (`src/pages/Historial.jsx`) - Filtra y muestra historial de diligencias
- **HistorialGestor** (`src/pages/HistorialGestor.jsx`) - Muestra historial de gestor con filtros

### Ejemplo de uso de useState y useEffect

```1:33:src/pages/CrearDiligencia.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated, getTipoUsuario, getUsuarioActual } from '../utils/auth'
import { apiService } from '../utils/api'
import InviteSignup from '../components/InviteSignup'
import '../styles/CrearDiligencia.css'

function CrearDiligencia() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    puntoInicio: '',
    puntoDestino: '',
    tipo: 'entrega',
    urgencia: 'normal',
    precio: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Si es gestor, redirigir
    if (isAuthenticated()) {
      const tipoUsuario = getTipoUsuario()
      if (tipoUsuario === 'gestor') {
        navigate('/gestor')
        return
      }
    }
  }, [navigate])
```

En este ejemplo:
- **useState** se usa para manejar el estado del formulario (`formData`), el estado de carga (`loading`), errores (`error`) y éxito (`success`)
- **useEffect** se utiliza para verificar la autenticación y el tipo de usuario al montar el componente, redirigiendo si es necesario

---

## 4. Implementación de un Custom Hook

### Custom Hook: useDiligencias

Se ha implementado el custom hook **useDiligencias** (`src/hooks/useDiligencias.js`) que encapsula toda la lógica relacionada con la gestión de diligencias.

### ¿Por qué es necesario?

Este custom hook proporciona:
- **Reutilización**: La lógica de carga, creación y búsqueda de diligencias se puede usar en múltiples componentes
- **Separación de responsabilidades**: La lógica de negocio está separada de los componentes de presentación
- **Mantenibilidad**: Cambios en la lógica de diligencias solo requieren modificar un archivo
- **Consistencia**: Garantiza que todos los componentes usen la misma lógica

### Componentes que utilizan useDiligencias

- **Historial** (`src/pages/Historial.jsx`) - Para cargar y filtrar diligencias del usuario
- **GestorDashboard** (`src/pages/GestorDashboard.jsx`) - Para gestionar diligencias disponibles y asignadas

### Implementación del Custom Hook

```1:81:src/hooks/useDiligencias.js
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
```

Este hook utiliza `useState` para manejar el estado de las diligencias, `useEffect` para cargar datos automáticamente, y `useCallback` para optimizar las funciones. Proporciona una API limpia que los componentes pueden usar fácilmente.

---

## 5. Uso Correcto de React Router

La aplicación utiliza **React Router DOM v6.20.0** para el enrutamiento. Se implementa un sistema completo de rutas con protección basada en roles de usuario.

### Configuración del Router

El router se configura en `src/App.jsx` utilizando `BrowserRouter`, `Routes` y `Route` de React Router DOM.

### Rutas Implementadas

#### Rutas Públicas
- `/` - Home (contenido dinámico según tipo de usuario)
- `/login` - Página de inicio de sesión

#### Rutas de Usuarios Autenticados
- `/buscar` - Explorar diligencias y gestores
- `/crear-diligencia` - Crear nueva diligencia
- `/historial` - Historial de diligencias del usuario
- `/perfil` - Perfil del usuario
- `/seguimiento/:id` - Seguimiento de una diligencia específica

#### Rutas de Gestores Autenticados
- `/gestor` - Dashboard de gestor
- `/historial-gestor` - Historial de diligencias completadas
- `/perfil` - Perfil del gestor
- `/seguimiento/:id` - Seguimiento con opción de completar diligencia

### Implementación del Router

```35:57:src/App.jsx
function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="app__main">
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/login" element={<Login />} />
            <Route path="/buscar" element={<Buscar />} />
            <Route path="/crear-diligencia" element={<CrearDiligencia />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/historial-gestor" element={<HistorialGestor />} />
            <Route path="/seguimiento/:id" element={<Seguimiento />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/gestor" element={<GestorDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}
```

### Características del Enrutamiento

- **Rutas dinámicas**: Se utiliza `useParams()` para obtener parámetros de ruta (ej: `/seguimiento/:id`)
- **Navegación programática**: Se usa `useNavigate()` para redirigir según condiciones
- **Protección de rutas**: Las rutas verifican autenticación y tipo de usuario antes de renderizar
- **Rutas condicionales**: La ruta `/` muestra contenido diferente según el tipo de usuario

### Ejemplo de Uso de Parámetros de Ruta

```11:27:src/pages/Seguimiento.jsx
function Seguimiento() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [diligencia, setDiligencia] = useState(null)
  const [usuarioSolicitante, setUsuarioSolicitante] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [completando, setCompletando] = useState(false)
  const usuarioActual = getUsuarioActual()
  const tipoUsuario = getTipoUsuario()

  useEffect(() => {
    if (id) {
      loadDiligencia()
    }
  }, [id])
```

Este componente utiliza `useParams()` para obtener el ID de la diligencia desde la URL y cargar la información correspondiente.

---

## 6. Modificación del Estilo mediante CSS y Metodología BEM

La aplicación utiliza **CSS puro** con la metodología **BEM (Block Element Modifier)** para la nomenclatura de clases. Esta metodología garantiza código CSS mantenible, escalable y sin conflictos.

### Estructura BEM

- **Block**: Componente principal (ej: `home`, `button`, `diligencia-card`)
- **Element**: Parte del bloque (ej: `home__title`, `button__icon`, `diligencia-card__header`)
- **Modifier**: Variante del bloque o elemento (ej: `button--primary`, `diligencia-card__estado--pendiente`)

### Archivos CSS por Componente

Cada componente tiene su archivo CSS correspondiente en `src/styles/`:
- `Home.css`, `Button.css`, `DiligenciaCard.css`, `Header.css`, `Buscar.css`, etc.

### Ejemplo de Estilos BEM

El archivo `src/styles/Home.css` muestra la aplicación de BEM:

```1:50:src/styles/Home.css
.home {
  padding: 0;
  min-height: 100vh;
  background: var(--sky-honey);
  position: relative;
  overflow: hidden;
}

/* Elementos decorativos animados */
.home::before,
.home::after {
  content: '';
  position: absolute;
  pointer-events: none;
}

.home::before {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 199, 39, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  top: -200px;
  left: -200px;
  animation: home__float-1 20s ease-in-out infinite;
}

.home::after {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 179, 0, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  bottom: -150px;
  right: -150px;
  animation: home__float-2 25s ease-in-out infinite;
}

/* Círculos decorativos flotantes */
.home__hero::before {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 199, 39, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: home__pulse 4s ease-in-out infinite;
  z-index: 0;
}
```

En este ejemplo:
- `.home` es el **Block**
- `.home__hero` es un **Element** del bloque home
- Los modificadores se aplican con doble guion (ej: `home__button--primary`)

### Características de los Estilos

- **Variables CSS**: Uso de variables CSS para colores y valores reutilizables
- **Responsive Design**: Media queries para adaptación a diferentes tamaños de pantalla
- **Animaciones**: Animaciones CSS para mejorar la experiencia de usuario
- **Grid y Flexbox**: Uso de layouts modernos para estructurar componentes

---

## 7. Cómo Arrancar la Aplicación en Local

### Prerrequisitos

- Node.js (v18 o superior recomendado)
- npm o yarn

### Pasos para Ejecutar

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

### Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de la build de producción
npm run preview

# Ejecutar linter
npm run lint
```

---

## 8. Vistas del Front-end y Estilos CSS Destacables

La aplicación cuenta con **9 vistas principales** que cubren toda la funcionalidad requerida:

### 1. Home (`/`)
**Archivo**: `src/pages/Home.jsx` | **Estilos**: `src/styles/Home.css`

Vista principal para usuarios no autenticados. Muestra:
- Hero section con título y call-to-action
- Estadísticas de la plataforma (diligencias completadas, gestores activos, calificación)
- Sección "¿Cómo funciona?" con pasos del proceso
- Servicios populares
- Testimonios de usuarios

**Estilos destacables**:
- Animaciones flotantes con `@keyframes` para elementos decorativos
- Gradientes radiales para efectos visuales
- Grid layout para servicios y testimonios
- Diseño responsive con media queries

### 2. Login (`/login`)
**Archivo**: `src/pages/Login.jsx` | **Estilos**: `src/styles/Login.css`

Página de autenticación con formulario de inicio de sesión.

**Estilos destacables**:
- Formulario centrado con sombras y bordes redondeados
- Estados de hover y focus para inputs
- Transiciones suaves en botones

### 3. Buscar (`/buscar`)
**Archivo**: `src/pages/Buscar.jsx` | **Estilos**: `src/styles/Buscar.css`

Vista principal para usuarios autenticados. Permite:
- Búsqueda en tiempo real de diligencias y gestores
- Filtrado por pestañas (Todos, Diligencias, Gestores)
- Visualización en grid responsive

**Estilos destacables**:
- Sistema de pestañas con estados activos
- Grid layout adaptable con `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`
- Estados de carga y mensajes vacíos

### 4. Crear Diligencia (`/crear-diligencia`)
**Archivo**: `src/pages/CrearDiligencia.jsx` | **Estilos**: `src/styles/CrearDiligencia.css`

Formulario completo para crear nuevas diligencias con:
- Campos de texto, textarea, select
- Cálculo automático de precio según urgencia
- Validación y mensajes de error/éxito

**Estilos destacables**:
- Formulario con espaciado consistente usando BEM
- Inputs con estados focus y error
- Mensajes de éxito/error con colores temáticos

### 5. Historial (`/historial`)
**Archivo**: `src/pages/Historial.jsx` | **Estilos**: `src/styles/Historial.css`

Muestra todas las diligencias del usuario con:
- Filtros por estado (Todas, Pendientes, En Progreso, Completadas)
- Lista de diligencias con información completa

**Estilos destacables**:
- Botones de filtro con estado activo
- Cards de diligencias con información estructurada
- Layout flexible con flexbox

### 6. Seguimiento (`/seguimiento/:id`)
**Archivo**: `src/pages/Seguimiento.jsx` | **Estilos**: `src/styles/Seguimiento.css`

Vista detallada de una diligencia con:
- Información completa de la diligencia
- Componente de tracking visual del progreso
- Datos del solicitante (para gestores)
- Botón para completar diligencia (solo gestores)

**Estilos destacables**:
- Layout de dos columnas (información y tracking)
- Componente Tracking con indicadores visuales de progreso
- Diseño responsive que se adapta a móvil

### 7. Gestor Dashboard (`/gestor`)
**Archivo**: `src/pages/GestorDashboard.jsx` | **Estilos**: `src/styles/GestorDashboard.css`

Panel de control para gestores con:
- Estadísticas (diligencias disponibles, asignadas, completadas)
- Lista de diligencias disponibles para aceptar
- Lista de diligencias asignadas
- Validación: solo 1 diligencia activa a la vez

**Estilos destacables**:
- Grid de estadísticas con cards destacadas
- Secciones separadas para diligencias disponibles y asignadas
- Botones con estados disabled cuando no se puede aceptar más diligencias
- Animaciones en las cards de estadísticas

### 8. Historial Gestor (`/historial-gestor`)
**Archivo**: `src/pages/HistorialGestor.jsx` | **Estilos**: `src/styles/HistorialGestor.css`

Historial de diligencias completadas por el gestor con:
- Filtros por estado
- Lista de diligencias completadas
- Información de cada diligencia

**Estilos destacables**:
- Layout similar a Historial pero adaptado para gestores
- Badges de estado con colores diferenciados
- Cards con información resumida

### 9. Perfil (`/perfil`)
**Archivo**: `src/pages/Perfil.jsx` | **Estilos**: `src/styles/Perfil.css`

Página de perfil del usuario/gestor con información personal.

**Estilos destacables**:
- Formulario de perfil con campos editables
- Diseño centrado y limpio
- Información organizada en secciones

---

## Resumen de Requisitos Cumplidos

✅ **1. Introducción**: Aplicación SPA React documentada con justificación  
✅ **2. Componentes funcionales**: 15 componentes implementados con JSX  
✅ **3. Hooks principales**: `useState` y `useEffect` utilizados extensivamente  
✅ **4. Custom hook**: `useDiligencias` implementado y utilizado en múltiples componentes  
✅ **5. React Router**: Sistema completo de rutas con protección y parámetros dinámicos  
✅ **6. CSS y BEM**: Metodología BEM aplicada consistentemente en todos los componentes  
✅ **7. Arranque local**: Documentación completa de instalación y ejecución  
✅ **8. Vistas implementadas**: 9 vistas principales que cubren toda la funcionalidad  

---

**DiliBee** - Documentación de requisitos cumplidos 🐝

