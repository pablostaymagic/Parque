const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../db');

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/flyer');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + '-evento' + ext);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (png, jpg, jpeg, webp)'));
    }
  }
});

// POST /crear-evento
router.post('/crear-evento', upload.single('imagen'), async (req, res) => {
  try {
    const { titulo, descripcion, fecha_inicio, fecha_fin, hora_inicio, hora_fin } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'La imagen es obligatoria' });
    }
    const flyer_url = `uploads/flyer/${file.filename}`;
    
    // Validar y crear columnas si faltan
    await pool.query(`
      ALTER TABLE eventos 
      ADD COLUMN IF NOT EXISTS titulo VARCHAR(255),
      ADD COLUMN IF NOT EXISTS descripcion TEXT,
      ADD COLUMN IF NOT EXISTS fecha_inicio DATE,
      ADD COLUMN IF NOT EXISTS fecha_fin DATE,
      ADD COLUMN IF NOT EXISTS hora_inicio TIME,
      ADD COLUMN IF NOT EXISTS hora_fin TIME,
      ADD COLUMN IF NOT EXISTS flyer_url VARCHAR(255);
    `);

    // Insertar en PostgreSQL
    const query = `
      INSERT INTO eventos (titulo, descripcion, fecha_inicio, fecha_fin, hora_inicio, hora_fin, flyer_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [titulo, descripcion, fecha_inicio, fecha_fin, hora_inicio, hora_fin, flyer_url];
    const result = await pool.query(query, values);
    
    res.status(201).json({ 
      success: true, 
      evento: result.rows[0] 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: error.message 
    });
  }
});

// GET /eventos
router.get('/eventos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM eventos ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /eventos/:id — Actualiza un evento existente
// Acepta multipart/form-data con imagen opcional (campo: "imagen")
router.put('/eventos/:id', upload.single('imagen'), async (req, res) => {
  try {
    const { id } = req.params;
    const eventoId = Number(id);

    if (!Number.isInteger(eventoId) || eventoId <= 0 || eventoId > 2147483647) {
      return res.status(400).json({
        success: false,
        message: 'ID de evento inválido'
      });
    }

    const { titulo, descripcion, fecha_inicio, fecha_fin, hora_inicio, hora_fin, estado } = req.body;

    // Si llega un archivo nuevo, construir la ruta; si no, pasar null para usar COALESCE
    const flyer_url = req.file ? `uploads/flyer/${req.file.filename}` : null;

    const query = `
      UPDATE eventos
      SET
        titulo      = $1,
        descripcion = $2,
        fecha_inicio = $3,
        fecha_fin    = $4,
        hora_inicio  = $5,
        hora_fin     = $6,
        flyer_url    = COALESCE($7, flyer_url),
        estado       = COALESCE($8, estado)
      WHERE id = $9
      RETURNING *;
    `;
    const values = [
      titulo,
      descripcion,
      fecha_inicio,
      fecha_fin,
      hora_inicio,
      hora_fin,
      flyer_url,   // $7 — null si no hay imagen nueva
      estado || null,
      eventoId
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }

    res.json({ success: true, evento: result.rows[0] });
  } catch (error) {
    console.error('Error actualizando evento:', error);
    res.status(500).json({ success: false, message: 'Error actualizando evento', error: error.message });
  }
});

// DELETE /eventos/:id — Elimina un evento de la base de datos
router.delete('/eventos/:id', async (req, res) => {
  const { id } = req.params;
  const eventoId = Number(id);

  if (!Number.isInteger(eventoId) || eventoId <= 0 || eventoId > 2147483647) {
    return res.status(400).json({
      success: false,
      message: 'ID de evento inválido'
    });
  }

  try {
    const result = await pool.query(
      'DELETE FROM eventos WHERE id = $1 RETURNING id',
      [eventoId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Evento con id ${eventoId} no encontrado en la base de datos`
      });
    }

    return res.json({
      success: true,
      message: 'Evento eliminado correctamente',
      deletedId: result.rows[0].id
    });

  } catch (error) {
    console.error('Error eliminando evento:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno eliminando evento',
      error: error.message
    });
  }
});

module.exports = router;
