const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'eaglepark_db',
  password: 'postgres',
  port: 5432,
});

// Prueba de conexión inmediata
pool.connect((err, client, release) => {
  if (err) {
    return console.error('🔴 Error de conexión', err.stack);
  }
  console.log('🟢 Conectado a PostgreSQL');
  console.log('Base de datos conectada:', process.env.DB_NAME || pool.options.database);
  release();
});

module.exports = pool;
