require('dotenv').config();
const { query } = require('./pool');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  try {
    console.log('🔄 Starting fresh database setup...\n');

    // Drop all existing tables
    console.log('🗑️  Dropping existing tables...');
    await query(`
      DROP TABLE IF EXISTS ratings CASCADE;
      DROP TABLE IF EXISTS book_images CASCADE;
      DROP TABLE IF EXISTS exchanges CASCADE;
      DROP TABLE IF EXISTS books CASCADE;
      DROP TABLE IF EXISTS sessions CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    console.log('✅ Tables dropped\n');

    // Create all tables from scratch
    console.log('📋 Creating tables...');
    await query(`
      -- Users table
      CREATE TABLE users (
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Sessions table (for persistent login)
      CREATE TABLE sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(500) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Books table
      CREATE TABLE books (
        id SERIAL PRIMARY KEY,
        owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        condition VARCHAR(50) NOT NULL,
        description TEXT,
        isbn VARCHAR(20),
        cover_image VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Book images table (for multiple images per book)
      CREATE TABLE book_images (
        id SERIAL PRIMARY KEY,
        book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
        image_url VARCHAR(255) NOT NULL,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Exchanges table
      CREATE TABLE exchanges (
        id SERIAL PRIMARY KEY,
        book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
        requester_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'PENDING',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Ratings table (for user ratings after exchange)
      CREATE TABLE ratings (
        id SERIAL PRIMARY KEY,
        exchange_id INTEGER REFERENCES exchanges(id) ON DELETE CASCADE,
        rater_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rated_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        review TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for better query performance
      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_books_owner_id ON books(owner_id);
      CREATE INDEX idx_books_status ON books(status);
      CREATE INDEX idx_exchanges_book_id ON exchanges(book_id);
      CREATE INDEX idx_exchanges_requester_id ON exchanges(requester_id);
      CREATE INDEX idx_exchanges_status ON exchanges(status);
      CREATE INDEX idx_sessions_user_id ON sessions(user_id);
      CREATE INDEX idx_sessions_token ON sessions(token);
      CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
      CREATE INDEX idx_ratings_exchange_id ON ratings(exchange_id);
      CREATE INDEX idx_ratings_rater_id ON ratings(rater_id);
      CREATE INDEX idx_ratings_rated_user_id ON ratings(rated_user_id);
    `);
    console.log('✅ Tables created\n');

    // Insert test data
    console.log('📝 Inserting test data...');
    const salt = await bcrypt.genSalt(10);
    const userPassword = await bcrypt.hash('password123', salt);
    const adminPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const adminRes = await query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role, city, campus, bio)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, email, first_name, last_name, role
    `, ['admin@example.com', adminPassword, 'Admin', 'User', 'ADMIN', 'Bangalore', 'System', 'Platform Administrator']);
    const adminId = adminRes.rows[0].id;
    console.log(`✅ Admin created: ${adminRes.rows[0].email}`);

    // Create regular users
    const user1Res = await query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role, city, campus, bio)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, email, first_name, last_name
    `, ['john@example.com', userPassword, 'John', 'Doe', 'USER', 'Bangalore', 'IISc', 'Book lover and avid reader']);
    const user1Id = user1Res.rows[0].id;
    console.log(`✅ User created: ${user1Res.rows[0].email}`);

    const user2Res = await query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role, city, campus, bio)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, email, first_name, last_name
    `, ['jane@example.com', userPassword, 'Jane', 'Smith', 'USER', 'Mumbai', 'IITB', 'Fiction enthusiast']);
    const user2Id = user2Res.rows[0].id;
    console.log(`✅ User created: ${user2Res.rows[0].email}`);

    const user3Res = await query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role, city, campus, bio)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, email, first_name, last_name
    `, ['alex@example.com', userPassword, 'Alex', 'Johnson', 'USER', 'Delhi', 'IITD', 'Tech and science books']);
    const user3Id = user3Res.rows[0].id;
    console.log(`✅ User created: ${user3Res.rows[0].email}\n`);

    // Insert books
    console.log('📚 Adding books...');
    const books = [
      { owner: user1Id, title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', condition: 'Good', isbn: '9780140449136', desc: 'A psychological drama exploring the mind of Raskolnikov' },
      { owner: user1Id, title: 'The Bell Jar', author: 'Sylvia Plath', condition: 'Like New', isbn: '9780060830490', desc: 'A semi-autobiographical novel about mental health' },
      { owner: user2Id, title: 'Pride and Prejudice', author: 'Jane Austen', condition: 'Excellent', isbn: '9780141439518', desc: 'A classic romance novel' },
      { owner: user2Id, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', condition: 'Good', isbn: '9780743273565', desc: 'A tale of wealth and love in the Jazz Age' },
      { owner: user3Id, title: 'A Brief History of Time', author: 'Stephen Hawking', condition: 'Very Good', isbn: '9780553380163', desc: 'Exploring the universe and black holes' },
      { owner: user3Id, title: 'The Selfish Gene', author: 'Richard Dawkins', condition: 'Good', isbn: '9780192860926', desc: 'A revolutionary look at evolution' }
    ];

    for (const book of books) {
      await query(`
        INSERT INTO books (owner_id, title, author, condition, description, isbn, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [book.owner, book.title, book.author, book.condition, book.desc, book.isbn, 'Available']);
    }
    console.log(`✅ ${books.length} books added\n`);

    // Insert sample exchanges
    console.log('🔄 Creating sample exchanges...');
    const book1 = await query('SELECT id FROM books WHERE title = $1', ['Crime and Punishment']);
    const book2 = await query('SELECT id FROM books WHERE title = $1', ['Pride and Prejudice']);

    if (book1.rows.length > 0 && book2.rows.length > 0) {
      await query(`
        INSERT INTO exchanges (book_id, requester_id, status, notes)
        VALUES ($1, $2, $3, $4)
      `, [book1.rows[0].id, user2Id, 'PENDING', 'I would love to read this classic!']);

      await query(`
        INSERT INTO exchanges (book_id, requester_id, status, notes)
        VALUES ($1, $2, $3, $4)
      `, [book2.rows[0].id, user3Id, 'ACCEPTED', 'Great book, looking forward to it']);

      console.log('✅ Sample exchanges created\n');
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log('✨ DATABASE SETUP COMPLETE! ✨');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('📋 Test Accounts:');
    console.log('   Admin:');
    console.log('   - Email: admin@example.com');
    console.log('   - Password: admin123\n');
    console.log('   Regular Users:');
    console.log('   - Email: john@example.com');
    console.log('   - Email: jane@example.com');
    console.log('   - Email: alex@example.com');
    console.log('   - Password: password123 (for all)\n');
    console.log('📊 Database includes:');
    console.log('   ✓ Users table with profile support');
    console.log('   ✓ Sessions table for persistent login');
    console.log('   ✓ Books table with status tracking');
    console.log('   ✓ Book images table for multiple images');
    console.log('   ✓ Exchanges table for book requests');
    console.log('   ✓ Ratings table for user reviews');
    console.log('   ✓ Indexes for performance optimization\n');
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

setupDatabase();
