const express = require('express');
const router = express.Router();
const turismoController = require('../controllers/turismo.controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/turismo/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
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

// Rutas API para Destinos Turísticos
router.get('/', turismoController.getAllDestinos);
router.get('/publico', turismoController.getPublicDestinos);
router.get('/:id', turismoController.getDestinoById);
router.post('/', upload.any(), turismoController.createDestino);
router.put('/:id', upload.any(), turismoController.updateDestino);
router.delete('/:id', turismoController.deleteDestino);

module.exports = router;
