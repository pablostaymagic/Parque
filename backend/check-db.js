const { Pool } = require('pg');

const postgresPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

async function main() {
  try {
    // 1. Check if eaglepark_db exists
    const dbCheck = await postgresPool.query("SELECT 1 FROM pg_database WHERE datname = 'eaglepark_db'");
    if (dbCheck.rows.length === 0) {
      console.log('Database "eaglepark_db" does not exist. Creating it...');
      await postgresPool.query('CREATE DATABASE eaglepark_db');
      console.log('✅ Database "eaglepark_db" created successfully.');
    } else {
      console.log('✅ Database "eaglepark_db" already exists.');
    }
  } catch (err) {
    console.error('❌ Error checking/creating database:', err);
    process.exit(1);
  } finally {
    await postgresPool.end();
  }

  // 2. Connect to eaglepark_db and check/create reservas table
  const eagleparkPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'eaglepark_db',
    password: 'postgres',
    port: 5432,
  });

  try {
    const tableCheck = await eagleparkPool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'reservas';
    `);

    if (tableCheck.rows.length === 0) {
      console.log('Table "reservas" does not exist. Creating it...');
      await eagleparkPool.query(`
        CREATE TABLE reservas (
          id SERIAL PRIMARY KEY,
          evento_id INTEGER NOT NULL,
          nombre VARCHAR(255) NOT NULL,
          telefono VARCHAR(255) NOT NULL,
          genero VARCHAR(50) NOT NULL,
          edad INTEGER NOT NULL,
          nacionalidad VARCHAR(255),
          fecha_visita DATE NOT NULL
        );
      `);
      console.log('✅ Table "reservas" created successfully.');
    } else {
      console.log('✅ Table "reservas" already exists.');
      
      // Print columns
      const cols = await eagleparkPool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'reservas';
      `);
      console.log('Columns in "reservas":');
      cols.rows.forEach(col => {
        console.log(`- ${col.column_name} (${col.data_type})`);
      });
    }

    // Also check if the 'eventos' table exists in 'eaglepark_db'.
    const eventosCheck = await eagleparkPool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'eventos';
    `);

    if (eventosCheck.rows.length === 0) {
      console.log('Table "eventos" does not exist in eaglepark_db. Creating it...');
      await eagleparkPool.query(`
        CREATE TABLE eventos (
          id SERIAL PRIMARY KEY,
          titulo VARCHAR(255) NOT NULL,
          descripcion TEXT,
          fecha_inicio TIMESTAMP NOT NULL,
          fecha_fin TIMESTAMP NOT NULL,
          hora_inicio TIME,
          hora_fin TIME,
          flyer_url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Table "eventos" created successfully in eaglepark_db.');
    } else {
      console.log('✅ Table "eventos" already exists in eaglepark_db.');
    }

  } catch (err) {
    console.error('❌ Error checking/creating tables:', err);
  } finally {
    await eagleparkPool.end();
  }
}

main();
