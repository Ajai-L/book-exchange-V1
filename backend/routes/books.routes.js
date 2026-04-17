const express = require('express');
const { query } = require('../db/pool');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all books with search functionality
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    let sqlQuery = `
      SELECT b.*, json_build_object('firstName', u.first_name, 'lastName', u.last_name, 'city', u.city, 'campus', u.campus) as owner
      FROM books b
      JOIN users u ON b.owner_id = u.id
      WHERE b.status = 'Available'
    `;
    const params = [];

    if (q) {
      sqlQuery += ` AND (LOWER(b.title) LIKE $1 OR LOWER(b.author) LIKE $1)`;
      params.push(`%${q.toLowerCase()}%`);
    }

    const { rows } = await query(sqlQuery, params);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get single book
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await query(`
      SELECT b.*, json_build_object('firstName', u.first_name, 'lastName', u.last_name, 'city', u.city, 'campus', u.campus) as owner
      FROM books b
      JOIN users u ON b.owner_id = u.id
      WHERE b.id = $1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add new book (Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, author, condition, description, isbn, coverImage } = req.body;
    
    const { rows } = await query(
      `INSERT INTO books (owner_id, title, author, condition, description, isbn, cover_image) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user.id, title, author, condition, description, isbn, coverImage]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update book (Protected, Owner only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, condition, description, isbn, coverImage, status } = req.body;

    // Check ownership
    const checkOwnership = await query('SELECT owner_id FROM books WHERE id = $1', [id]);
    if (checkOwnership.rows.length === 0) return res.status(404).json({ message: 'Book not found' });
    if (checkOwnership.rows[0].owner_id !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const { rows } = await query(
      `UPDATE books SET title = COALESCE($1, title), author = COALESCE($2, author), condition = COALESCE($3, condition), 
       description = COALESCE($4, description), isbn = COALESCE($5, isbn), cover_image = COALESCE($6, cover_image), status = COALESCE($7, status)
       WHERE id = $8 RETURNING *`,
      [title, author, condition, description, isbn, coverImage, status, id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete book (Protected, Owner only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const checkOwnership = await query('SELECT owner_id FROM books WHERE id = $1', [id]);
    if (checkOwnership.rows.length === 0) return res.status(404).json({ message: 'Book not found' });
    if (checkOwnership.rows[0].owner_id !== req.user.id && req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Not authorized' });

    await query('DELETE FROM books WHERE id = $1', [id]);
    res.json({ message: 'Book removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
