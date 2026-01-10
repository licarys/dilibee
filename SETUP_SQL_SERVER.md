# Configuración de SQL Server para Dilibee

## Descripción

La aplicación ahora se conecta a SQL Server en lugar de usar archivos JSON locales. El backend está implementado en Node.js/Express y se conecta a SQL Server en Azure.

## Estructura del Proyecto

```
dilibee/
├── server/                  # Backend Node.js/Express
│   ├── index.js            # Servidor principal con rutas API
│   └── package.json        # Dependencias del backend
├── src/                    # Frontend React
│   ├── utils/
│   │   └── api.js          # Actualizado para llamar al backend
│   └── ...
├── package.json            # Dependencias del frontend
└── vite.config.js          # Configuración con proxy
```

## Instalación

### 1. Instalar dependencias

Ejecuta el siguiente comando en la raíz del proyecto para instalar las dependencias del frontend y backend:

```bash
npm run install:all
```

O manualmente:

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 2. Configuración de SQL Server

La cadena de conexión está configurada en `server/index.js`:

```javascript
Server=poshcatsql.database.windows.net;
Database=tareas;
User ID=tareasUser;
Password=ReadOnlyPassword!;
Encrypt=True;
TrustServerCertificate=False;
Connection Timeout=30;
```

**Nota:** Se asume que todas las tablas y registros ya están creados en SQL Server.

### Tablas requeridas

El backend espera las siguientes tablas en SQL Server:

- `diligencias` - Contiene las diligencias
- `gestores` - Contiene los gestores
- `usuarios` - Contiene los usuarios (incluyendo gestores logueados)

## Ejecución

### Opción 1: Ejecutar ambos servidores simultáneamente (Recomendado)

```bash
npm run dev:all
```

Este comando ejecuta:
- Frontend (Vite) en `http://localhost:5173`
- Backend (Express) en `http://localhost:3001`

### Opción 2: Ejecutar por separado

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Endpoints de API

El backend expone los siguientes endpoints:

### Diligencias
- `GET /api/diligencias` - Obtener todas las diligencias
- `GET /api/diligencias/search?term=...` - Buscar diligencias
- `GET /api/diligencias/estado/:estado` - Filtrar por estado
- `GET /api/diligencias/:id` - Obtener diligencia por ID
- `POST /api/diligencias` - Crear nueva diligencia
- `POST /api/diligencias/:id/aceptar` - Aceptar diligencia
- `POST /api/diligencias/:id/completar` - Completar diligencia

### Gestores
- `GET /api/gestores` - Obtener todos los gestores
- `GET /api/gestores/search?term=...` - Buscar gestores
- `GET /api/gestores/disponibles` - Obtener gestores disponibles
- `GET /api/gestores/:id` - Obtener gestor por ID

### Usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID

## Proxy de Vite

El archivo `vite.config.js` está configurado para hacer proxy de las llamadas `/api` al backend en `http://localhost:3001`:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      secure: false
    }
  }
}
```

## Cambios Realizados

1. **Creado `server/index.js`**: Backend Express con conexión a SQL Server
2. **Actualizado `src/utils/api.js`**: Eliminadas las importaciones de JSON y la lógica simulada, ahora hace llamadas HTTP reales al backend
3. **Actualizado `package.json`**: Agregados scripts y dependencia de `concurrently`
4. **Creado `server/package.json`**: Dependencias del backend (express, cors, mssql)
5. **Actualizado `vite.config.js`**: Configurado proxy para redireccionar `/api` al backend

## Notas Importantes

- El backend se conecta automáticamente a SQL Server al iniciar
- Todas las consultas usan parámetros preparados para prevenir inyección SQL
- Los errores se manejan apropiadamente y se devuelven mensajes claros
- La página de búsqueda (Buscar.jsx) ahora obtiene datos directamente de SQL Server
- El pool de conexiones se mantiene abierto para mejor rendimiento

## Solución de Problemas

### Error de conexión a SQL Server
Verifica que:
- Las credenciales sean correctas
- El servidor SQL Server esté accesible desde tu red
- El firewall permita conexiones al puerto 1433

### Error "Cannot find module"
Ejecuta `npm run install:all` para instalar todas las dependencias.

### Frontend no puede conectar con el backend
Verifica que:
- El backend esté corriendo en el puerto 3001
- El proxy en vite.config.js esté configurado correctamente
- No haya conflictos de puertos
