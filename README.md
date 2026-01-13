# 🐝 DiliBee

**Diligencias rápidas a tu alcance**

DiliBee es una aplicación web que conecta personas que necesitan resolver trámites urgentes con gestores verificados que pueden realizarlos de manera segura y eficiente.

🌐 **Aplicación en vivo**: [https://dilibee.vercel.app/](https://dilibee.vercel.app/)

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
- **Backend API**: .NET Core con SQL Server (desplegado en Azure)
- **Base de Datos**: SQL Server en Azure
- **API Endpoint**: `https://dilibeex.azurewebsites.net/api`

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
   
   El frontend se conectará automáticamente al backend en Azure a través del proxy configurado en `vite.config.js`.

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

### Nota sobre el Backend

El backend está desplegado en Azure y se conecta automáticamente. No es necesario ejecutar un servidor local. El proxy de Vite redirige las llamadas `/api` a `https://dilibeex.azurewebsites.net/api`.

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

## 🔌 API Backend

La aplicación se conecta a un backend .NET Core desplegado en Azure.

### Endpoint Base
```
https://dilibeex.azurewebsites.net/api
```

### Endpoints Disponibles

#### Diligencias
- `GET /api/diligencias` - Obtener todas las diligencias
- `GET /api/diligencias/search?term=...` - Buscar diligencias por término
- `GET /api/diligencias/estado/:estado` - Filtrar diligencias por estado
- `GET /api/diligencias/:id` - Obtener diligencia por ID
- `POST /api/diligencias` - Crear nueva diligencia
- `POST /api/diligencias/:id/aceptar` - Aceptar diligencia (asignar a gestor)
- `POST /api/diligencias/:id/completar` - Completar diligencia

#### Gestores
- `GET /api/gestores` - Obtener todos los gestores
- `GET /api/gestores/search?term=...` - Buscar gestores por término
- `GET /api/gestores/disponibles` - Obtener gestores disponibles
- `GET /api/gestores/:id` - Obtener gestor por ID

#### Usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID

### Configuración de Desarrollo

En desarrollo, el proxy de Vite redirige automáticamente las llamadas `/api` al backend de Azure. Ver `vite.config.js` para más detalles.

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
│   │   ├── api.js          # Cliente API para backend Azure
│   │   └── auth.js         # Autenticación
│   ├── data/               # Datos JSON (respaldo/desarrollo)
│   │   ├── diligencias.json
│   │   ├── gestores.json
│   │   ├── usuarios.json
│   │   ├── servicios.json
│   │   └── testimonios.json
│   ├── sqlScripts/         # Scripts SQL para configuración de BD
│   │   ├── CreacionUsuarios.sql
│   │   └── Script Dats.sql
│   ├── styles/             # Estilos CSS
│   ├── App.jsx             # Componente principal
│   └── main.jsx            # Punto de entrada
├── docs/                   # Documentación
│   ├── branding.md         # Guía de marca
│   └── requisitos-cumplidos.md
├── package.json
├── vite.config.js          # Configuración con proxy a API Azure
├── vercel.json             # Configuración de despliegue
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

- **api.js**: Cliente HTTP usando Axios que se conecta al backend .NET en Azure
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

1. Los datos se almacenan en SQL Server en Azure
2. El backend .NET Core (`https://dilibeex.azurewebsites.net/api`) expone endpoints REST
3. `api.js` realiza llamadas HTTP reales con Axios al backend
4. Los componentes consumen datos a través de las funciones de `apiService`
5. La autenticación se maneja con `localStorage` (frontend)
6. En desarrollo, Vite proxy redirige `/api` al backend de Azure

## 📝 Notas de Desarrollo

- El proyecto se conecta a un backend .NET Core desplegado en Azure
- La base de datos es SQL Server en Azure
- Las operaciones de API son llamadas HTTP reales al backend
- La autenticación se maneja con `localStorage` en el frontend
- El diseño es completamente responsive
- Se utilizan hooks de React (`useState`, `useEffect`, `useCallback`)
- Implementación de un custom hook (`useDiligencias`)
- Los archivos JSON en `src/data/` se mantienen como respaldo/desarrollo
- Los scripts SQL en `src/sqlScripts/` son para configuración inicial de la base de datos

## 🚀 Próximas Mejoras

- [x] Integración con API real ✅
- [ ] Sistema de registro de usuarios
- [ ] Sistema de pagos
- [ ] Notificaciones en tiempo real
- [ ] Sistema de calificaciones y reseñas
- [ ] Chat entre usuarios y gestores
- [ ] Geolocalización para gestores cercanos
- [ ] Autenticación JWT en el backend
- [ ] Validación de formularios mejorada

## 📄 Licencia

Este proyecto es privado y está bajo desarrollo.

## 👨‍💻 Autor

Proyecto desarrollado como práctica académica.

---

**DiliBee** - Conectando personas con gestores verificados 🐝

