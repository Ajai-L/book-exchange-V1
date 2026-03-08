const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Book {
  static async create({
    userId,
    title,
    author,
    isbn = null,
    description = null,
    category = null,
    condition = 'good',
    bookImage = null,
  }) {
    const id = uuidv4();
    const query = `
      INSERT INTO books (id, user_id, title, author, isbn, description, category, condition, book_image, is_available)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE)
      RETURNING *;
    `;
    const values = [id, userId, title, author, isbn, description, category, condition, bookImage];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM books WHERE id = $1;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByUserId(userId, limit = 10, offset = 0) {
    const query = 'SELECT * FROM books WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;';
    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
  }

  static async findAll(limit = 10, offset = 0, filters = {}) {
    let query = 'SELECT * FROM books WHERE is_available = TRUE';
    const values = [];
    let paramCount = 1;

    if (filters.category) {
      query += ` AND category = $${paramCount}`;
      values.push(filters.category);
      paramCount++;
    }

    if (filters.condition) {
      query += ` AND condition = $${paramCount}`;
      values.push(filters.condition);
      paramCount++;
    }

    if (filters.search) {
      query += ` AND (title ILIKE $${paramCount} OR author ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async update(id, updates) {
    const allowedFields = ['title', 'author', 'isbn', 'description', 'category', 'condition', 'book_image', 'is_available'];
    const fields = [];
    const values = [];
    let paramCount = 1;

    allowedFields.forEach((field) => {
      if (field in updates) {
        fields.push(`${field} = $${paramCount}`);
        values.push(updates[field]);
        paramCount++;
      }
    });

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const query = `UPDATE books SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *;`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM books WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getBookWithOwner(bookId) {
    const query = `
      SELECT b.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone
      FROM books b
      JOIN users u ON b.user_id = u.id
      WHERE b.id = $1;
    `;
    const result = await pool.query(query, [bookId]);
    return result.rows[0];
  }
}

module.exports = Book;
