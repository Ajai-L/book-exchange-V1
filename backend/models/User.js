const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class User {
  static async create({
    name,
    email,
    password,
    profilePicture = null,
    bio = null,
    phone = null,
    address = null,
    city = null,
    state = null,
    zipCode = null,
    isAdmin = false,
  }) {
    const id = uuidv4();
    const query = `
      INSERT INTO users (id, name, email, password, profile_picture, bio, phone, address, city, state, zip_code, is_admin)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
    const values = [id, name, email, password, profilePicture, bio, phone, address, city, state, zipCode, isAdmin];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1 AND is_active = TRUE;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = TRUE;';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findAll(limit = 10, offset = 0) {
    const query = 'SELECT id, name, email, bio, profile_picture, is_admin, created_at FROM users WHERE is_active = TRUE LIMIT $1 OFFSET $2;';
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async update(id, updates) {
    const allowedFields = ['name', 'profile_picture', 'bio', 'phone', 'address', 'city', 'state', 'zip_code'];
    const fields = [];
    const values = [];
    let paramCount = 1;

    allowedFields.forEach((field) => {
      if (field in updates) {
        const snakeCaseField = field;
        fields.push(`${snakeCaseField} = $${paramCount}`);
        values.push(updates[field]);
        paramCount++;
      }
    });

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *;`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'UPDATE users SET is_active = FALSE WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async checkEmailExists(email) {
    const query = 'SELECT id FROM users WHERE email = $1;';
    const result = await pool.query(query, [email]);
    return result.rows.length > 0;
  }
}

module.exports = User;
