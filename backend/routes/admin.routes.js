const express = require('express');
const { query } = require('../db/pool');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

// Admin Analytics Overview
router.get('/analytics', async (req, res) => {
  try {
    const userCount = await query('SELECT COUNT(*) FROM users WHERE role = $1', ['USER']);
    const adminCount = await query('SELECT COUNT(*) FROM users WHERE role = $1', ['ADMIN']);
    const bookCount = await query('SELECT COUNT(*) FROM books');
    const exchangeCount = await query('SELECT COUNT(*) FROM exchanges');
    const completedCount = await query("SELECT COUNT(*) FROM exchanges WHERE status = $1", ['COMPLETED']);
    const pendingCount = await query("SELECT COUNT(*) FROM exchanges WHERE status = $1", ['PENDING']);
    
    res.json({
      totalUsers: parseInt(userCount.rows[0].count, 10),
      totalAdmins: parseInt(adminCount.rows[0].count, 10),
      totalBooks: parseInt(bookCount.rows[0].count, 10),
      totalExchanges: parseInt(exchangeCount.rows[0].count, 10),
      completedExchanges: parseInt(completedCount.rows[0].count, 10),
      pendingExchanges: parseInt(pendingCount.rows[0].count, 10)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Admin Users Fetch with Detailed Info
router.get('/users', async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT 
        id, 
        email, 
        first_name, 
        last_name, 
        role, 
        city, 
        campus,
        bio,
        created_at,
        (SELECT COUNT(*) FROM books WHERE owner_id = users.id) as total_books,
        (SELECT COUNT(*) FROM exchanges WHERE requester_id = users.id OR 
          (SELECT owner_id FROM books WHERE id = exchanges.book_id) = users.id) as total_exchanges
      FROM users 
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get user details
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userRes = await query('SELECT * FROM users WHERE id = $1', [id]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const booksRes = await query('SELECT * FROM books WHERE owner_id = $1', [id]);
    const exchangesRes = await query(`
      SELECT e.*, b.title as book_title, b.author, u.first_name, u.last_name
      FROM exchanges e
      JOIN books b ON e.book_id = b.id
      JOIN users u ON e.requester_id = u.id
      WHERE b.owner_id = $1 OR e.requester_id = $1
    `, [id]);

    res.json({
      user: userRes.rows[0],
      books: booksRes.rows,
      exchanges: exchangesRes.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const userRes = await query('SELECT id FROM users WHERE id = $1', [id]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    await query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Promote user to admin
router.patch('/users/:id/promote', async (req, res) => {
  try {
    const { id } = req.params;
    
    const userRes = await query('SELECT id, role FROM users WHERE id = $1', [id]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userRes.rows[0].role === 'ADMIN') {
      return res.status(400).json({ message: 'User is already an admin' });
    }

    await query('UPDATE users SET role = $1 WHERE id = $2', ['ADMIN', id]);
    res.json({ message: 'User promoted to admin successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Demote admin to user
router.patch('/users/:id/demote', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from demoting themselves
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ message: 'Cannot demote your own account' });
    }

    const userRes = await query('SELECT id, role FROM users WHERE id = $1', [id]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userRes.rows[0].role !== 'ADMIN') {
      return res.status(400).json({ message: 'User is not an admin' });
    }

    await query('UPDATE users SET role = $1 WHERE id = $2', ['USER', id]);
    res.json({ message: 'Admin demoted to user successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all books with owner information
router.get('/books', async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT 
        b.id,
        b.title,
        b.author,
        b.condition,
        b.status,
        b.description,
        b.isbn,
        b.created_at,
        u.id as owner_id,
        u.first_name,
        u.last_name,
        u.email,
        (SELECT COUNT(*) FROM exchanges WHERE book_id = b.id AND status = 'PENDING') as pending_exchanges
      FROM books b
      JOIN users u ON b.owner_id = u.id
      ORDER BY b.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a book (moderation)
router.delete('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bookRes = await query('SELECT id FROM books WHERE id = $1', [id]);
    if (bookRes.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await query('DELETE FROM books WHERE id = $1', [id]);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all exchanges with detailed information
router.get('/exchanges', async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT 
        e.id,
        e.status,
        e.notes,
        e.created_at,
        e.updated_at,
        b.id as book_id,
        b.title as book_title,
        b.author,
        req.id as requester_id,
        req.first_name as requester_first_name,
        req.last_name as requester_last_name,
        req.email as requester_email,
        owner.id as owner_id,
        owner.first_name as owner_first_name,
        owner.last_name as owner_last_name,
        owner.email as owner_email
      FROM exchanges e
      JOIN books b ON e.book_id = b.id
      JOIN users req ON e.requester_id = req.id
      JOIN users owner ON b.owner_id = owner.id
      ORDER BY e.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update exchange status
router.patch('/exchanges/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const exchangeRes = await query('SELECT id FROM exchanges WHERE id = $1', [id]);
    if (exchangeRes.rows.length === 0) {
      return res.status(404).json({ message: 'Exchange not found' });
    }

    await query('UPDATE exchanges SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [status, id]);
    res.json({ message: `Exchange status updated to ${status}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
