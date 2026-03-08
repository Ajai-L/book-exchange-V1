const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'book_exchange_db',
});

async function initializeDatabase() {
  try {
    console.log('🗄️  Initializing database...');

    // Read the SQL initialization script
    const sqlPath = path.join(__dirname, './config/init-db.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL script
    await pool.query(sqlScript);

    console.log('✅ Database initialized successfully!');
    console.log('📊 Tables created:');
    console.log('   - users');
    console.log('   - books');
    console.log('   - exchanges');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Database tables may already exist. Running again will attempt to recreate them.');
    }
    await pool.end();
    process.exit(1);
  }
}

initializeDatabase();
