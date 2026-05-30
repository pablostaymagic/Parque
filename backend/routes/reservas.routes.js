console.log('✅ reservas.routes.js cargado');
const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /reservas
router.post('/reservas', async (req, res) => {
  console.log('BODY /reservas:', req.body);
  
  try {
    const { evento_id, nombre, telefono, genero, edad, nacionalidad, fecha_visita } = req.body;
    
    // Validaciones básicas de campos obligatorios
    if (!evento_id || !nombre || !telefono || !genero || !edad || !fecha_visita) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios'
      });
    }

    const query = `
      INSERT INTO reservas
        (evento_id, nombre, telefono, genero, edad, nacionalidad, fecha_visita)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      evento_id,
      nombre,
      telefono,
      genero,
      Number(edad),
      nacionalidad || null,
      fecha_visita
    ];

    const result = await pool.query(query, values);
    
    console.log('Reserva guardada en eaglepark_db:', result.rows[0]);
    
    res.status(201).json({
      success: true,
      reserva: result.rows[0]
    });
  } catch (error) {
    console.error('Error creando reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando reserva',
      error: error.message
    });
  }
});

// GET /reservas
router.get('/reservas', async (req, res) => {
  try {
    const query = `
      SELECT
        r.*,
        e.titulo AS evento_titulo
      FROM reservas r
      LEFT JOIN eventos e ON e.id = r.evento_id
      ORDER BY r.id DESC;
    `;
    const result = await pool.query(query);
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error obteniendo reservas:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo reservas',
      error: error.message
    });
  }
});

module.exports = router;
