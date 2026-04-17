const express = require('express');
const { query } = require('../db/pool');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

// Admin Analytics Overview
router.get('/analytics', async (req, res) => {
  try {
    const userCount = await query('SELECT COUNT(*) FROM users');
    const bookCount = await query('SELECT COUNT(*) FROM books');
    const exchangeCount = await query('SELECT COUNT(*) FROM exchanges');
    const completedCount = await query("SELECT COUNT(*) FROM exchanges WHERE status = 'COMPLETED'");
    
    res.json({
      totalUsers: parseInt(userCount.rows[0].count, 10),
      totalBooks: parseInt(bookCount.rows[0].count, 10),
      totalExchanges: parseInt(exchangeCount.rows[0].count, 10),
      completedExchanges: parseInt(completedCount.rows[0].count, 10)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Admin Users Fetch
router.get('/users', async (req, res) => {
    try {
      const { rows } = await query('SELECT id, email, first_name, last_name, role, city, created_at FROM users');
      res.json(rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// Block/Unblock user representation helper (Mock DB toggle or literal delete)
router.post('/users/:id/block', async (req, res) => {
    // In a real application, you might add a 'blocked' boolean to the users table.
    // For this demonstration, we'll return a success payload simulating a block action.
    try {
        const { id } = req.params;
        const existsCheck = await query('SELECT id FROM users WHERE id = $1', [id]);
        if(existsCheck.rows.length === 0) return res.status(404).json({ message: "User Missing" });
        
        res.json({ message: `User ${id} blocked state toggled successfully`});
    } catch(err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;
