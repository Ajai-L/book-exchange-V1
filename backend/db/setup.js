require('dotenv').config();
const { query } = require('./pool');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  try {
    console.log('Connecting to database...');
    
    // Create Tables with IF NOT EXISTS to preserve data
    console.log('Creating tables if they don\'t exist...');
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'USER',
        city VARCHAR(100),
        campus VARCHAR(100),
        bio TEXT,
        profile_image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        condition VARCHAR(50) NOT NULL,
        description TEXT,
        isbn VARCHAR(20),
        cover_image VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS book_images (
        id SERIAL PRIMARY KEY,
        book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
        image_url VARCHAR(255) NOT NULL,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS exchanges (
        id SERIAL PRIMARY KEY,
        book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
        requester_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'PENDING',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        exchange_id INTEGER REFERENCES exchanges(id) ON DELETE CASCADE,
        rater_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        rated_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        review TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert Test Data (only if it doesn't exist)
    console.log('Checking for existing test data...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);

    // Check if admin exists
    const adminExists = await query('SELECT id FROM users WHERE email = $1', ['admin@example.com']);
    
    if (adminExists.rows.length === 0) {
      // Create Admin User
      console.log('Creating admin account...');
      await query(`
        INSERT INTO users (email, password_hash, first_name, last_name, role, city, campus, bio)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, ['admin@example.com', adminPasswordHash, 'Admin', 'User', 'ADMIN', 'Bangalore', 'System', 'Platform Administrator']);
    }

    // Check if test user exists
    const userExists = await query('SELECT id FROM users WHERE email = $1', ['john@example.com']);
    
    if (userExists.rows.length === 0) {
      // Create a mock user
      console.log('Creating test user account...');
      const userRes = await query(`
        INSERT INTO users (email, password_hash, first_name, last_name, role, city, campus)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `, ['john@example.com', passwordHash, 'John', 'Doe', 'USER', 'Bangalore', 'IISc']);
      
      const userId = userRes.rows[0].id;

      // Insert mock books
      const MOCK_BOOKS = [
        {
          title: 'Crime and Punishment',
          author: 'Fyodor Dostoevsky',
          condition: 'Good',
          description: 'A psychological drama exploring the mind of Raskolnikov...',
          coverImage: 'https://covers.openlibrary.org/b/id/14911181-M.jpg',
          isbn: '9780140449136'
        },
        {
          title: 'The Bell Jar',
          author: 'Sylvia Plath',
          condition: 'Like New',
          description: 'A semi-autobiographical novel...',
          coverImage: 'https://ia800100.us.archive.org/view_archive.php?archive=/5/items/l_covers_0012/l_covers_0012_75.zip&file=0012752096-L.jpg',
          isbn: '9780060830490'
        }
      ];

      for (const book of MOCK_BOOKS) {
        await query(`
          INSERT INTO books (owner_id, title, author, condition, description, isbn, cover_image)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [userId, book.title, book.author, book.condition, book.description, book.isbn, book.coverImage]);
      }
    }

    console.log('Database setup complete! 🎉');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    process.exit(0);
  }
}

setupDatabase();
