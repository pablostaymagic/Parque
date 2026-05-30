const pool = require('../db');

const createEvento = async (req, res) => {
  const { titulo, descripcion, fecha_inicio, fecha_fin, flyer_url } = req.body;

  console.log("Recibiendo nuevo evento:", { titulo, fecha_inicio, fecha_fin });

  if (!titulo || !fecha_inicio || !fecha_fin) {
    return res.status(400).json({ success: false, message: "Campos obligatorios faltantes" });
  }

  try {
    const query = `
      INSERT INTO eventos (titulo, descripcion, fecha_inicio, fecha_fin, flyer_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [titulo, descripcion, fecha_inicio, fecha_fin, flyer_url];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: "Evento guardado correctamente en PostgreSQL",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Error al insertar evento en DB:", error);
    res.status(500).json({ success: false, message: "Error al guardar evento", error: error.message });
  }
};

const getEventos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM eventos ORDER BY id DESC');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    res.status(500).json({ error: "Error al obtener eventos" });
  }
};

module.exports = {
  createEvento,
  getEventos
};
