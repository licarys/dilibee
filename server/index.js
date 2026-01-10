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

// Rutas de API

// Obtener todas las diligencias
app.get('/api/diligencias', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query('SELECT * FROM diligencias');
    res.json({ data: result.recordset, status: 200 });
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
      return res.json({ data: result.recordset, status: 200 });
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
    
    res.json({ data: result.recordset, status: 200 });
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
      return res.json({ data: result.recordset, status: 200 });
    }

    const result = await pool.request()
      .input('estado', sql.NVarChar, estado)
      .query('SELECT * FROM diligencias WHERE estado = @estado');
    
    res.json({ data: result.recordset, status: 200 });
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
    
    res.json({ data: result.recordset[0], status: 200 });
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
    
    res.json({ data: result.recordset[0], status: 201 });
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
    res.json({ data: result.recordset, status: 200 });
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
      return res.json({ data: result.recordset, status: 200 });
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
    
    res.json({ data: result.recordset, status: 200 });
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
    res.json({ data: result.recordset, status: 200 });
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
    
    res.json({ data: result.recordset[0], status: 200 });
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
    
    res.json({ data: result.recordset[0], status: 200 });
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
    
    res.json({ data: updateResult.recordset[0], status: 200 });
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
    
    res.json({ data: updateResult.recordset[0], status: 200 });
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
