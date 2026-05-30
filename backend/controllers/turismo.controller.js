const pool = require('../db');
const fs = require('fs');
const path = require('path');

// Inicializar tabla si no existe
const initTurismoTable = async () => {
  try {
    // 1. Crear tabla si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.destinos_turisticos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion_principal TEXT,
        categoria VARCHAR(255),
        telefono VARCHAR(50),
        maps TEXT,
        redes_sociales JSONB DEFAULT '[]',
        visibilidad VARCHAR(50) DEFAULT 'ACTIVO',
        contenido_media JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Sincronizar automáticamente columnas creadas recientemente en pgAdmin
    await pool.query(`
      ALTER TABLE public.destinos_turisticos 
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);
    await pool.query(`
      ALTER TABLE public.destinos_turisticos 
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);

    console.log("✅ Tabla 'destinos_turisticos' verificada y sincronizada correctamente en PostgreSQL");
  } catch (err) {
    console.error("❌ Error inicializando tabla destinos_turisticos:", err);
  }
};

initTurismoTable();

// Helper para eliminar archivos físicos
const deletePhysicalFile = (filePath) => {
  if (!filePath) return;
  try {
    const absolutePath = path.join(__dirname, '../..', filePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log(`[FS] Archivo de turismo eliminado: ${absolutePath}`);
    } else {
      console.log(`[FS] Archivo no encontrado para eliminar: ${absolutePath}`);
    }
  } catch (err) {
    console.error(`[FS] Error al eliminar archivo ${filePath}:`, err);
  }
};

// Obtener destinos públicos (visibilidad = 'ACTIVO')
exports.getPublicDestinos = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT nombre, descripcion_principal, categoria, telefono, maps, redes_sociales, contenido_media 
       FROM public.destinos_turisticos 
       WHERE UPPER(visibilidad) = 'ACTIVO' 
       ORDER BY id DESC`
    );
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error obteniendo destinos públicos:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Obtener todos los destinos (interno)
exports.getAllDestinos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.destinos_turisticos ORDER BY id DESC');
    res.status(200).json({
      success: true,
      message: 'Destinos obtenidos exitosamente',
      data: result.rows
    });
  } catch (error) {
    console.error('Error obteniendo destinos:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Obtener por ID
exports.getDestinoById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM public.destinos_turisticos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Destino no encontrado'
      });
    }
    res.status(200).json({
      success: true,
      destino: result.rows[0]
    });
  } catch (error) {
    console.error('Error obteniendo destino:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Crear destino
exports.createDestino = async (req, res) => {
  try {
    const { nombre, descripcion_principal, categoria, telefono, maps, redes_sociales, visibilidad } = req.body;
    
    // Procesar archivos
    const mediaPaths = [];
    if (req.files) {
      for (const file of req.files) {
        mediaPaths.push(`/uploads/turismo/${file.filename}`);
      }
    }

    const query = `
      INSERT INTO public.destinos_turisticos (
        nombre, descripcion_principal, categoria, telefono, maps, redes_sociales, visibilidad, contenido_media
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const parsedRedes = redes_sociales ? (typeof redes_sociales === 'string' ? JSON.parse(redes_sociales) : redes_sociales) : [];

    const values = [
      nombre || '',
      descripcion_principal || '',
      categoria || '',
      telefono || '',
      maps || '',
      JSON.stringify(parsedRedes),
      visibilidad || 'ACTIVO',
      JSON.stringify(mediaPaths)
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      destino: result.rows[0]
    });
  } catch (error) {
    console.error('Error creando destino:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Actualizar destino
exports.updateDestino = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion_principal, categoria, telefono, maps, redes_sociales, visibilidad, archivosBorrados, existingMedia } = req.body;

    // 1. Eliminar archivos removidos físicamente
    const toDelete = archivosBorrados ? (typeof archivosBorrados === 'string' ? JSON.parse(archivosBorrados) : archivosBorrados) : [];
    for (const filePath of toDelete) {
      deletePhysicalFile(filePath);
    }

    // 2. Construir lista de multimedia actualizada
    const preservedMedia = existingMedia ? (typeof existingMedia === 'string' ? JSON.parse(existingMedia) : existingMedia) : [];
    const mediaPaths = [...preservedMedia];

    if (req.files) {
      for (const file of req.files) {
        mediaPaths.push(`/uploads/turismo/${file.filename}`);
      }
    }

    const query = `
      UPDATE public.destinos_turisticos
      SET nombre = $1, descripcion_principal = $2, categoria = $3, telefono = $4, maps = $5, redes_sociales = $6, visibilidad = $7, contenido_media = $8, updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `;

    const parsedRedes = redes_sociales ? (typeof redes_sociales === 'string' ? JSON.parse(redes_sociales) : redes_sociales) : [];

    const values = [
      nombre || '',
      descripcion_principal || '',
      categoria || '',
      telefono || '',
      maps || '',
      JSON.stringify(parsedRedes),
      visibilidad || 'ACTIVO',
      JSON.stringify(mediaPaths),
      id
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Destino no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      destino: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar destino:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Eliminar destino
exports.deleteDestino = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener multimedia del destino para borrar archivos físicos de disco
    const result = await pool.query('SELECT contenido_media FROM public.destinos_turisticos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Destino no encontrado'
      });
    }

    const media = result.rows[0].contenido_media || [];
    for (const filePath of media) {
      deletePhysicalFile(filePath);
    }

    await pool.query('DELETE FROM public.destinos_turisticos WHERE id = $1', [id]);

    res.status(200).json({
      success: true,
      message: 'Destino turístico eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando destino:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
