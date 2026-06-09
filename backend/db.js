const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:igleparkadmin22@db.xdcfbdzfnhoigccimepi.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('🔴 Error de conexión', err.stack);
  }
  console.log('🟢 Conectado a PostgreSQL Supabase');
  release();
});

module.exports = pool;
