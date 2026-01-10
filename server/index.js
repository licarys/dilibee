import express from 'express';
import cors from 'cors';
import sql from 'mssql';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// CSP y otros headers de seguridad para desarrollo
app.use((req, res, next) => {
  // Permitir Chrome DevTools en desarrollo
  res.setHeader('Content-Security-Policy', "default-src 'self'; connect-src 'self' http://localhost:* ws://localhost:*");
  next();
});

// Configuración de SQL Server
const sqlConfig = {
  server: 'poshcatsql.database.windows.net',
  database: 'tareas',
  user: 'tareasUser',
  password: 'ReadOnlyPassword!',
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectTimeout: 30000
  }
};

// Pool de conexiones
let poolPromise;

const getPool = async () => {
  if (!poolPromise) {
    poolPromise = sql.connect(sqlConfig);
  }
  return poolPromise;
};

// Helper para convertir PascalCase a camelCase
const toCamelCase = (str) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

// Helper para transformar objeto de PascalCase a camelCase
const transformKeys = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const transformed = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      transformed[toCamelCase(key)] = obj[key];
    }
  }
  return transformed;
};

// Helper para transformar diligencias de SQL a formato esperado por el frontend
const transformDiligencia = async (pool, diligencia) => {
  // Convertir las claves de PascalCase a camelCase
  const transformed = transformKeys(diligencia);
  
  // Si tiene gestorId, obtener los datos del gestor
  if (transformed.gestorId) {
    try {
      const gestorResult = await pool.request()
        .input('gestorId', sql.Int, transformed.gestorId)
        .query('SELECT id, nombre, calificacion, telefono FROM usuarios WHERE id = @gestorId');
      
      if (gestorResult.recordset.length > 0) {
        const gestor = transformKeys(gestorResult.recordset[0]);
        transformed.gestor = {
          id: gestor.id,
          nombre: gestor.nombre,
          calificacion: gestor.calificacion || 0,
          telefono: gestor.telefono
        };
      }
    } catch (err) {
      console.error('Error al obtener gestor:', err);
    }
  }
  
  // Si tiene usuarioId, obtener los datos del usuario
  if (transformed.usuarioId) {
    try {
      const usuarioResult = await pool.request()
        .input('usuarioId', sql.Int, transformed.usuarioId)
        .query('SELECT id, nombre, calificacion FROM usuarios WHERE id = @usuarioId');
      
      if (usuarioResult.recordset.length > 0) {
        const usuario = transformKeys(usuarioResult.recordset[0]);
        transformed.usuario = {
          id: usuario.id,
          nombre: usuario.nombre,
          calificacion: usuario.calificacion || 0
        };
      }
    } catch (err) {
      console.error('Error al obtener usuario:', err);
    }
  }
  
  return transformed;
};

// Rutas de API

// Obtener todas las diligencias
app.get('/api/diligencias', async (req, res) => {
  try {
    console.log('Obteniendo todas las diligencias...');
    const pool = await getPool();
    const result = await pool.request()
      .query('SELECT * FROM diligencias');
    
    // Transformar todas las diligencias
    const transformed = await Promise.all(
      result.recordset.map(d => transformDiligencia(pool, d))
    );
    
    //console.log(`Se encontraron ${transformed.length} diligencias.`);
    //console.log('Diligencias:', transformed);
    res.json({ data: transformed, status: 200 });
  } catch (error) {
    console.error('Error al obtener diligencias:', error);
    res.status(500).json({ error: 'Error al obtener diligencias', details: error.message });
  }
});

// Buscar diligencias por término
app.get('/api/diligencias/search', async (req, res) => {
  try {
    const { term } = req.query;
    const pool = await getPool();
    
    if (!term || term.trim() === '') {
      const result = await pool.request()
        .query('SELECT * FROM diligencias');
      
      // Transformar todas las diligencias
      const transformed = await Promise.all(
        result.recordset.map(d => transformDiligencia(pool, d))
      );
      
      return res.json({ data: transformed, status: 200 });
    }

    const searchTerm = `%${term}%`;
    const result = await pool.request()
      .input('searchTerm', sql.NVarChar, searchTerm)
      .query(`
        SELECT * FROM diligencias 
        WHERE titulo LIKE @searchTerm 
           OR descripcion LIKE @searchTerm 
           OR tipo LIKE @searchTerm 
           OR puntoInicio LIKE @searchTerm 
           OR puntoDestino LIKE @searchTerm
      `);
    
    // Transformar todas las diligencias
    const transformed = await Promise.all(
      result.recordset.map(d => transformDiligencia(pool, d))
    );
    
    res.json({ data: transformed, status: 200 });
  } catch (error) {
    console.error('Error en búsqueda de diligencias:', error);
    res.status(500).json({ error: 'Error en búsqueda', details: error.message });
  }
});

// Obtener diligencias por estado
app.get('/api/diligencias/estado/:estado', async (req, res) => {
  try {
    const { estado } = req.params;
    const pool = await getPool();
    
    if (estado === 'todas') {
      const result = await pool.request()
        .query('SELECT * FROM diligencias');
      const transformed = await Promise.all(
        result.recordset.map(d => transformDiligencia(pool, d))
      );
      return res.json({ data: transformed, status: 200 });
    }

    const result = await pool.request()
      .input('estado', sql.NVarChar, estado)
      .query('SELECT * FROM diligencias WHERE estado = @estado');
    
    const transformed = await Promise.all(
      result.recordset.map(d => transformDiligencia(pool, d))
    );
    
    res.json({ data: transformed, status: 200 });
  } catch (error) {
    console.error('Error al obtener diligencias por estado:', error);
    res.status(500).json({ error: 'Error al obtener diligencias', details: error.message });
  }
});

// Obtener diligencia por ID
app.get('/api/diligencias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('SELECT * FROM diligencias WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Diligencia no encontrada' });
    }
    
    const transformed = await transformDiligencia(pool, result.recordset[0]);
    
    res.json({ data: transformed, status: 200 });
  } catch (error) {
    console.error('Error al obtener diligencia:', error);
    res.status(500).json({ error: 'Error al obtener diligencia', details: error.message });
  }
});

// Crear nueva diligencia
app.post('/api/diligencias', async (req, res) => {
  try {
    const { titulo, descripcion, tipo, puntoInicio, puntoDestino, urgencia, precio, usuarioId } = req.body;
    const pool = await getPool();
    
    const result = await pool.request()
      .input('titulo', sql.NVarChar, titulo)
      .input('descripcion', sql.NVarChar, descripcion)
      .input('tipo', sql.NVarChar, tipo)
      .input('puntoInicio', sql.NVarChar, puntoInicio)
      .input('puntoDestino', sql.NVarChar, puntoDestino)
      .input('urgencia', sql.NVarChar, urgencia)
      .input('precio', sql.Decimal(10, 2), precio)
      .input('usuarioId', sql.Int, usuarioId)
      .query(`
        INSERT INTO diligencias (titulo, descripcion, tipo, puntoInicio, puntoDestino, estado, urgencia, precio, fechaCreacion, usuarioId)
        OUTPUT INSERTED.*
        VALUES (@titulo, @descripcion, @tipo, @puntoInicio, @puntoDestino, 'pendiente', @urgencia, @precio, GETDATE(), @usuarioId)
      `);
    
    const transformed = await transformDiligencia(pool, result.recordset[0]);
    
    res.json({ data: transformed, status: 201 });
  } catch (error) {
    console.error('Error al crear diligencia:', error);
    res.status(500).json({ error: 'Error al crear diligencia', details: error.message });
  }
});

// Obtener todos los gestores
app.get('/api/gestores', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query('SELECT * FROM gestores');
    const transformed = result.recordset.map(transformKeys);
    res.json({ data: transformed, status: 200 });
  } catch (error) {
    console.error('Error al obtener gestores:', error);
    res.status(500).json({ error: 'Error al obtener gestores', details: error.message });
  }
});

// Buscar gestores por término
app.get('/api/gestores/search', async (req, res) => {
  try {
    const { term } = req.query;
    const pool = await getPool();
    
    if (!term || term.trim() === '') {
      const result = await pool.request()
        .query('SELECT * FROM gestores');
      const transformed = result.recordset.map(transformKeys);
      return res.json({ data: transformed, status: 200 });
    }

    const searchTerm = `%${term}%`;
    const result = await pool.request()
      .input('searchTerm', sql.NVarChar, searchTerm)
      .query(`
        SELECT * FROM gestores 
        WHERE nombre LIKE @searchTerm 
           OR zona LIKE @searchTerm 
           OR vehiculo LIKE @searchTerm
      `);
    
    const transformed = result.recordset.map(transformKeys);
    res.json({ data: transformed, status: 200 });
  } catch (error) {
    console.error('Error en búsqueda de gestores:', error);
    res.status(500).json({ error: 'Error en búsqueda', details: error.message });
  }
});

// Obtener gestores disponibles
app.get('/api/gestores/disponibles', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query('SELECT * FROM gestores WHERE disponible = 1');
    const transformed = result.recordset.map(transformKeys);
    res.json({ data: transformed, status: 200 });
  } catch (error) {
    console.error('Error al obtener gestores disponibles:', error);
    res.status(500).json({ error: 'Error al obtener gestores disponibles', details: error.message });
  }
});

// Obtener gestor por ID
app.get('/api/gestores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('SELECT * FROM gestores WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Gestor no encontrado' });
    }
    
    const transformed = transformKeys(result.recordset[0]);
    res.json({ data: transformed, status: 200 });
  } catch (error) {
    console.error('Error al obtener gestor:', error);
    res.status(500).json({ error: 'Error al obtener gestor', details: error.message });
  }
});

// Obtener usuario por ID
app.get('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('SELECT * FROM usuarios WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    const transformed = transformKeys(result.recordset[0]);
    res.json({ data: transformed, status: 200 });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario', details: error.message });
  }
});

// Aceptar una diligencia
app.post('/api/diligencias/:id/aceptar', async (req, res) => {
  try {
    const { id } = req.params;
    const { gestorId } = req.body;
    const pool = await getPool();
    
    // Verificar que la diligencia existe
    const diligenciaResult = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('SELECT * FROM diligencias WHERE id = @id');
    
    if (diligenciaResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Diligencia no encontrada' });
    }

    const diligencia = diligenciaResult.recordset[0];

    // Verificar si ya está asignada
    if (diligencia.gestorId) {
      return res.status(400).json({ error: 'Esta diligencia ya está asignada a otro gestor' });
    }

    // Verificar que el gestor existe
    const gestorResult = await pool.request()
      .input('gestorId', sql.Int, parseInt(gestorId))
      .query('SELECT * FROM usuarios WHERE id = @gestorId AND tipo = \'gestor\'');
    
    if (gestorResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Gestor no encontrado' });
    }

    // Verificar si el gestor tiene diligencias activas
    const activasResult = await pool.request()
      .input('gestorId', sql.Int, parseInt(gestorId))
      .query('SELECT * FROM diligencias WHERE gestorId = @gestorId AND estado != \'completada\'');
    
    if (activasResult.recordset.length > 0) {
      return res.status(400).json({ 
        error: 'Ya tienes una diligencia en progreso. Completa la diligencia actual antes de aceptar otra.' 
      });
    }

    // Actualizar la diligencia
    const updateResult = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .input('gestorId', sql.Int, parseInt(gestorId))
      .query(`
        UPDATE diligencias 
        SET estado = 'en-progreso', gestorId = @gestorId
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    
    const transformed = await transformDiligencia(pool, updateResult.recordset[0]);
    
    res.json({ data: transformed, status: 200 });
  } catch (error) {
    console.error('Error al aceptar diligencia:', error);
    res.status(500).json({ error: 'Error al aceptar diligencia', details: error.message });
  }
});

// Completar una diligencia
app.post('/api/diligencias/:id/completar', async (req, res) => {
  try {
    const { id } = req.params;
    const { gestorId } = req.body;
    const pool = await getPool();
    
    // Verificar que la diligencia existe
    const diligenciaResult = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('SELECT * FROM diligencias WHERE id = @id');
    
    if (diligenciaResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Diligencia no encontrada' });
    }

    const diligencia = diligenciaResult.recordset[0];

    // Verificar que está asignada al gestor
    if (!diligencia.gestorId || diligencia.gestorId !== parseInt(gestorId)) {
      return res.status(403).json({ error: 'No tienes permisos para completar esta diligencia' });
    }

    // Verificar que esté en progreso
    if (diligencia.estado !== 'en-progreso') {
      return res.status(400).json({ error: 'Solo se pueden completar diligencias en progreso' });
    }

    // Actualizar la diligencia a completada
    const updateResult = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query(`
        UPDATE diligencias 
        SET estado = 'completada'
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    
    const transformed = await transformDiligencia(pool, updateResult.recordset[0]);
    
    res.json({ data: transformed, status: 200 });
  } catch (error) {
    console.error('Error al completar diligencia:', error);
    res.status(500).json({ error: 'Error al completar diligencia', details: error.message });
  }
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor', details: err.message });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
  console.log('Conectando a SQL Server...');
  
  getPool()
    .then(() => console.log('✓ Conexión a SQL Server establecida'))
    .catch(err => console.error('✗ Error al conectar a SQL Server:', err));
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\nCerrando conexión a SQL Server...');
  await sql.close();
  process.exit(0);
});
