const pool = require("./db");

const initDb = async () => {
  try {
    // Create Estaciones table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS estaciones (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        numero INTEGER NOT NULL,
        descripcion TEXT,
        estado TEXT DEFAULT 'borrador',
        media JSONB DEFAULT '[]',
        subestaciones JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log("Tabla 'estaciones' verificada/creada correctamente.");
    process.exit(0);
  } catch (error) {
    console.error("Error inicializando la base de datos:", error);
    process.exit(1);
  }
};

initDb();
