const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const pool = require('./db');

// Rutas
const estacionesRoutes = require('./routes/estaciones.routes');
const turismoRoutes = require('./routes/turismo.routes');
const eventosRoutes = require('./routes/eventos');
const reservasRoutes = require('./routes/reservas.routes');

const app = express();

// Usa el puerto asignado por Render o 3000 por defecto
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

console.log('✅ Rutas de reservas importadas');

// Rutas API
app.use('/', eventosRoutes);
app.use('/', reservasRoutes);
app.use('/api/estaciones', estacionesRoutes);
app.use('/api/turismo', turismoRoutes);

// Ruta temporal de prueba
app.get('/test-reservas-route', (req, res) => {
  res.json({ success: true, message: 'Ruta de reservas activa en este servidor' });
});

// Ruta de prueba de base de datos
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      message: 'Conexión exitosa a la base de datos',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error ejecutando SELECT NOW()', err);
    res.status(500).json({
      success: false,
      message: 'Error de conexión a la base de datos',
      error: err.message
    });
  }
});

// Servir el frontend de React compilado (dist)
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Puerto Render asignado: ${PORT}`);
});
