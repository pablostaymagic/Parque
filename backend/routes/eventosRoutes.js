const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');

// POST /api/eventos
router.post('/', eventosController.createEvento);

// GET /api/eventos
router.get('/', eventosController.getEventos);

module.exports = router;
