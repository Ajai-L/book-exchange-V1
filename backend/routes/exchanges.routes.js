const express = require('express');
const { query } = require('../db/pool');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get exchanges involving the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT e.*, 
        json_build_object('id', b.id, 'title', b.title, 'author', b.author, 'coverImage', b.cover_image) as book,
        json_build_object('id', req_u.id, 'firstName', req_u.first_name, 'lastName', req_u.last_name) as requester,
        json_build_object('id', own_u.id, 'firstName', own_u.first_name, 'lastName', own_u.last_name) as owner
      FROM exchanges e
      JOIN books b ON e.book_id = b.id
      JOIN users req_u ON e.requester_id = req_u.id
      JOIN users own_u ON b.owner_id = own_u.id
      WHERE e.requester_id = $1 OR b.owner_id = $1
      ORDER BY e.created_at DESC
    `, [req.user.id]);

    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create exchange request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { bookId, notes } = req.body;

    const bookCheck = await query('SELECT owner_id, status FROM books WHERE id = $1', [bookId]);
    if (bookCheck.rows.length === 0) return res.status(404).json({ message: 'Book not found' });
    if (bookCheck.rows[0].status !== 'Available') return res.status(400).json({ message: 'Book is not available for exchange' });
    if (bookCheck.rows[0].owner_id === req.user.id) return res.status(400).json({ message: 'Cannot request your own book' });

    const { rows } = await query(
      'INSERT INTO exchanges (book_id, requester_id, notes) VALUES ($1, $2, $3) RETURNING *',
      [bookId, req.user.id, notes]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update exchange status (Accept/Reject/Complete)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Must be ACCEPTED, REJECTED, COMPLETED
    if (!['ACCEPTED', 'REJECTED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    const checkOwnership = await query(`
      SELECT e.requester_id, b.owner_id, b.id as book_id 
      FROM exchanges e JOIN books b ON e.book_id = b.id 
      WHERE e.id = $1
    `, [id]);

    if (checkOwnership.rows.length === 0) return res.status(404).json({ message: 'Exchange not found' });
    const { requester_id, owner_id, book_id } = checkOwnership.rows[0];

    if (req.user.id !== requester_id && req.user.id !== owner_id) {
       return res.status(403).json({ message: 'Not authorized to modify this exchange' });
    }

    const { rows } = await query(
      'UPDATE exchanges SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    // Side effect: update book status
    if (status === 'ACCEPTED') {
      await query('UPDATE books SET status = $1 WHERE id = $2', ['Reserved', book_id]);
    } else if (status === 'COMPLETED') {
      await query('UPDATE books SET status = $1 WHERE id = $2', ['Exchanged', book_id]);
    } else if (status === 'REJECTED') {
      await query('UPDATE books SET status = $1 WHERE id = $2', ['Available', book_id]);
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
