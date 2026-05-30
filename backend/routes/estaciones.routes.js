const express = require('express');
const router = express.Router();
const estacionesController = require('../controllers/estaciones.controller');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/estaciones/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Obtener todas las estaciones
router.get('/', estacionesController.getAllEstaciones);

// Obtener una estación por ID
router.get('/:id', estacionesController.getEstacionById);

// Crear una nueva estación
router.post('/', upload.any(), estacionesController.createEstacion);

// Actualizar una estación
router.put('/:id', upload.any(), estacionesController.updateEstacion);

// Eliminar una estación
router.delete('/:id', estacionesController.deleteEstacion);

module.exports = router;