const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Exchange {
  static async create({
    bookOfferedId,
    bookRequestedId,
    initiatorId,
    responderId,
    message = null,
  }) {
    const id = uuidv4();
    const query = `
      INSERT INTO exchanges (id, book_offered_id, book_requested_id, initiator_id, responder_id, status, message)
      VALUES ($1, $2, $3, $4, $5, 'pending', $6)
      RETURNING *;
    `;
    const values = [id, bookOfferedId, bookRequestedId, initiatorId, responderId, message];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT e.*,
        bo.title as book_offered_title, bo.author as book_offered_author, bo.book_image as book_offered_image,
        br.title as book_requested_title, br.author as book_requested_author, br.book_image as book_requested_image,
        u1.name as initiator_name, u1.email as initiator_email,
        u2.name as responder_name, u2.email as responder_email
      FROM exchanges e
      JOIN books bo ON e.book_offered_id = bo.id
      JOIN books br ON e.book_requested_id = br.id
      JOIN users u1 ON e.initiator_id = u1.id
      JOIN users u2 ON e.responder_id = u2.id
      WHERE e.id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByUserId(userId, limit = 10, offset = 0) {
    const query = `
      SELECT e.*,
        bo.title as book_offered_title, bo.author as book_offered_author,
        br.title as book_requested_title, br.author as book_requested_author
      FROM exchanges e
      JOIN books bo ON e.book_offered_id = bo.id
      JOIN books br ON e.book_requested_id = br.id
      WHERE (e.initiator_id = $1 OR e.responder_id = $1)
      ORDER BY e.created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
  }

  static async findByStatus(status, limit = 10, offset = 0) {
    const query = `
      SELECT e.*,
        bo.title as book_offered_title, br.title as book_requested_title
      FROM exchanges e
      JOIN books bo ON e.book_offered_id = bo.id
      JOIN books br ON e.book_requested_id = br.id
      WHERE e.status = $1
      ORDER BY e.created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const result = await pool.query(query, [status, limit, offset]);
    return result.rows;
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE exchanges SET status = $1 WHERE id = $2 RETURNING *;';
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async update(id, updates) {
    const allowedFields = ['status', 'message', 'exchange_date'];
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
    const query = `UPDATE exchanges SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *;`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM exchanges WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Exchange;
