# 🐝 DiliBee

**Diligencias rápidas a tu alcance**

DiliBee es una aplicación web que conecta personas que necesitan resolver trámites urgentes con gestores verificados que pueden realizarlos de manera segura y eficiente.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades](#-funcionalidades)
- [Rutas](#-rutas)
- [Roles de Usuario](#-roles-de-usuario)
- [Guía de Desarrollo](#-guía-de-desarrollo)

## ✨ Características

### Para Usuarios
- 🏠 **Home personalizado**: Página de exploración con todas las diligencias y gestores disponibles
- 🔍 **Búsqueda avanzada**: Filtrado en tiempo real por título, descripción, tipo, estado, zona, etc.
- ➕ **Crear diligencias**: Formulario completo para crear nuevas diligencias con cálculo de precio automático
- 📊 **Historial personal**: Visualiza todas tus diligencias con filtros por estado
- 📍 **Seguimiento en tiempo real**: Monitorea el progreso de tus diligencias con indicadores visuales
- 👤 **Perfil de usuario**: Gestiona tu información personal

### Para Gestores
- 🎛️ **Panel de control**: Dashboard centralizado con estadísticas y gestión de diligencias
- ✅ **Aceptar diligencias**: Sistema de asignación con validación (solo 1 diligencia activa a la vez)
- 📋 **Historial de gestor**: Visualiza todas las diligencias completadas
- 🔍 **Búsqueda integrada**: Busca y filtra diligencias disponibles y asignadas
- ✏️ **Completar diligencias**: Marca las diligencias como completadas desde el seguimiento

### General
- 🎨 **Diseño moderno**: Interfaz intuitiva siguiendo la guía de marca DiliBee
- 🔐 **Sistema de autenticación**: Login simulado con roles de usuario y gestor
- 📱 **Responsive**: Diseño adaptable a diferentes tamaños de pantalla
- 🚀 **Rutas protegidas**: Acceso controlado según el tipo de usuario
- 💬 **Invitaciones amigables**: Los usuarios no autenticados reciben invitaciones para crear cuenta

## 🛠️ Tecnologías

- **Frontend Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Routing**: React Router DOM 6.20.0
- **HTTP Client**: Axios 1.13.2
- **Linting**: ESLint
- **Estilos**: CSS con metodología BEM
- **Datos**: JSON local (simulación de API)

## 📦 Instalación

### Prerrequisitos
- Node.js (v18 o superior recomendado)
- npm o yarn

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd dilibee
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

### Otros comandos

```bash
# Compilar para producción
npm run build

# Preview de la build de producción
npm run preview

# Ejecutar linter
npm run lint
```

## 🎯 Uso

### Usuarios de Prueba

#### Usuario Regular
- **Email**: `john.doe@gmail.com`
- **Password**: `usuario123`
- **Rol**: Usuario

#### Gestor
- **Email**: `juan.perez@dilibee.com`
- **Password**: `gestor123`
- **Rol**: Gestor

### Flujo de Usuario

1. **Explorar**: Los usuarios pueden navegar y ver todas las diligencias y gestores disponibles
2. **Crear Diligencia**: Llenar el formulario con los detalles de la diligencia
3. **Seguimiento**: Monitorear el progreso de las diligencias en tiempo real
4. **Historial**: Revisar todas las diligencias creadas

### Flujo de Gestor

1. **Panel**: Acceder al dashboard con estadísticas y diligencias disponibles
2. **Aceptar**: Revisar y aceptar diligencias (solo 1 activa a la vez)
3. **Completar**: Marcar diligencias como completadas desde la página de seguimiento
4. **Historial**: Ver todas las diligencias completadas

## 📁 Estructura del Proyecto

```
dilibee/
├── public/                 # Archivos estáticos
│   ├── favicon.svg
│   ├── favicon-16x16.png
│   └── favicon-32x32.png
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── DiligenciaCard.jsx
│   │   ├── Footer.jsx
│   │   ├── GestorCard.jsx
│   │   ├── Header.jsx
│   │   ├── Loading.jsx
│   │   ├── Message.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Tracking.jsx
│   │   └── ...
│   ├── pages/              # Páginas principales
│   │   ├── Buscar.jsx
│   │   ├── CrearDiligencia.jsx
│   │   ├── GestorDashboard.jsx
│   │   ├── Historial.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── ...
│   ├── hooks/              # Custom hooks
│   │   └── useDiligencias.js
│   ├── utils/              # Utilidades
│   │   ├── api.js          # Simulación de API
│   │   └── auth.js         # Autenticación
│   ├── data/               # Datos JSON (simulación)
│   │   ├── diligencias.json
│   │   ├── gestores.json
│   │   ├── usuarios.json
│   │   ├── servicios.json
│   │   └── testimonios.json
│   ├── styles/             # Estilos CSS
│   ├── App.jsx             # Componente principal
│   └── main.jsx            # Punto de entrada
├── docs/                   # Documentación
│   └── branding.md         # Guía de marca
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Funcionalidades

### Componentes Principales

- **Header**: Navegación dinámica según el tipo de usuario
- **Footer**: Enlaces importantes e iconos de redes sociales
- **SearchBar**: Búsqueda en tiempo real con botón de limpieza
- **DiligenciaCard**: Tarjeta reutilizable para mostrar diligencias
- **Tracking**: Componente de seguimiento visual con progreso
- **InviteSignup**: Invitación para crear cuenta (guests)

### Hooks Personalizados

- **useDiligencias**: Manejo de estado y operaciones con diligencias

### Utilidades

- **api.js**: Simula llamadas HTTP usando Axios y datos JSON locales
- **auth.js**: Manejo de autenticación con localStorage

## 🛣️ Rutas

### Públicas
- `/` - Home (contenido diferente según tipo de usuario)
- `/login` - Página de inicio de sesión

### Usuarios Autenticados
- `/buscar` - Explorar diligencias y gestores (home para usuarios)
- `/crear-diligencia` - Crear nueva diligencia
- `/historial` - Historial de diligencias del usuario
- `/perfil` - Perfil del usuario
- `/seguimiento/:id` - Seguimiento de una diligencia específica

### Gestores Autenticados
- `/` o `/gestor` - Dashboard de gestor (home para gestores)
- `/historial-gestor` - Historial de diligencias completadas
- `/perfil` - Perfil del gestor
- `/seguimiento/:id` - Seguimiento con opción de completar diligencia

### Protegidas
- Las rutas de usuarios redirigen a gestores al dashboard
- Las rutas de gestores redirigen a usuarios al home
- Los guests ven invitaciones en lugar de redirecciones

## 👥 Roles de Usuario

### Guest (No autenticado)
- Puede ver la página Home
- Ve invitaciones para crear cuenta al intentar acceder a funciones

### Usuario
- Acceso a creación y gestión de diligencias
- Historial personal
- Búsqueda y exploración

### Gestor
- Panel de control exclusivo
- Aceptar y completar diligencias
- Historial de diligencias completadas
- Solo puede tener 1 diligencia activa a la vez

## 🎨 Guía de Estilo

El proyecto sigue la metodología **BEM (Block Element Modifier)** para la nomenclatura de clases CSS.

### Paleta de Colores
- **Carbon Black**: `#1a1a1a` - Texto principal
- **Soft White**: `#f9f9f9` - Fondos
- **Bee Yellow**: `#ffc727` - Color primario
- **Honey Gold**: `#ffa500` - Hover y acentos
- **Sky Honey**: `#fff5e6` - Fondos suaves
- **Mint Green**: `#98fb98` - Elementos secundarios

Ver más detalles en `docs/branding.md`

## 🔄 Flujo de Datos

1. Los datos se almacenan en archivos JSON dentro de `src/data/`
2. `api.js` simula llamadas HTTP con Axios
3. Los componentes consumen datos a través de las funciones de `apiService`
4. La autenticación se maneja con `localStorage`

## 📝 Notas de Desarrollo

- El proyecto usa datos simulados almacenados en JSON
- Las operaciones de API simulan delays de red
- La autenticación es simulada usando localStorage
- El diseño es completamente responsive
- Se utilizan hooks de React (`useState`, `useEffect`, `useCallback`)
- Implementación de un custom hook (`useDiligencias`)

## 🚀 Próximas Mejoras

- [ ] Integración con API real
- [ ] Sistema de registro de usuarios
- [ ] Sistema de pagos
- [ ] Notificaciones en tiempo real
- [ ] Sistema de calificaciones y reseñas
- [ ] Chat entre usuarios y gestores
- [ ] Geolocalización para gestores cercanos

## 📄 Licencia

Este proyecto es privado y está bajo desarrollo.

## 👨‍💻 Autor

Proyecto desarrollado como práctica académica.

---

**DiliBee** - Conectando personas con gestores verificados 🐝

