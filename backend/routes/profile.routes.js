const express = require('express');
const { query } = require('../db/pool');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get user profile with stats
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user info
    const userRes = await query(
      `SELECT id, email, first_name, last_name, bio, city, campus, profile_image, created_at FROM users WHERE id = $1`,
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userRes.rows[0];

    // Get user's books
    const booksRes = await query(
      'SELECT id, title, author, condition, status FROM books WHERE owner_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    // Get user's exchange history
    const exchangesRes = await query(
      `SELECT 
        e.id, e.status, e.created_at, e.updated_at,
        b.title, b.author,
        u.first_name, u.last_name
       FROM exchanges e
       JOIN books b ON e.book_id = b.id
       JOIN users u ON CASE 
         WHEN b.owner_id = $1 THEN e.requester_id
         ELSE b.owner_id
       END = u.id
       WHERE e.requester_id = $1 OR b.owner_id = $1
       ORDER BY e.created_at DESC LIMIT 20`,
      [userId]
    );

    // Get user ratings
    const ratingsRes = await query(
      `SELECT 
        r.id, r.rating, r.review, r.created_at,
        u.first_name, u.last_name
       FROM ratings r
       JOIN users u ON r.rater_id = u.id
       WHERE r.rated_user_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );

    // Calculate average rating
    const avgRes = await query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as total_ratings FROM ratings WHERE rated_user_id = $1',
      [userId]
    );

    const avgRating = parseFloat(avgRes.rows[0].avg_rating) || 0;
    const totalRatings = parseInt(avgRes.rows[0].total_ratings, 10) || 0;

    // Get completed exchanges count
    const completedRes = await query(
      `SELECT COUNT(*) FROM exchanges 
       WHERE (requester_id = $1 OR (SELECT owner_id FROM books WHERE id = book_id) = $1) 
       AND status = 'COMPLETED'`,
      [userId]
    );

    res.json({
      user,
      books: booksRes.rows,
      exchanges: exchangesRes.rows,
      ratings: ratingsRes.rows,
      stats: {
        totalBooks: booksRes.rows.length,
        totalExchanges: exchangesRes.rows.length,
        completedExchanges: parseInt(completedRes.rows[0].count, 10),
        averageRating: avgRating.toFixed(1),
        totalRatings,
        joinDate: user.created_at
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add rating/review
router.post('/:userId/rate', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { exchangeId, rating, review } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Verify exchange exists and is completed
    const exchangeRes = await query(
      'SELECT id, status FROM exchanges WHERE id = $1',
      [exchangeId]
    );

    if (exchangeRes.rows.length === 0) {
      return res.status(404).json({ message: 'Exchange not found' });
    }

    if (exchangeRes.rows[0].status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Can only rate completed exchanges' });
    }

    // Check if already rated
    const existingRes = await query(
      'SELECT id FROM ratings WHERE exchange_id = $1 AND rater_id = $2',
      [exchangeId, req.user.id]
    );

    if (existingRes.rows.length > 0) {
      return res.status(400).json({ message: 'You have already rated this exchange' });
    }

    // Add rating
    const ratingRes = await query(
      `INSERT INTO ratings (exchange_id, rater_id, rated_user_id, rating, review)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, rating, review, created_at`,
      [exchangeId, req.user.id, userId, rating, review || null]
    );

    res.status(201).json(ratingRes.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update user profile (bio, profile image, location)
router.put('/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { bio, profileImage, city, campus } = req.body;

    console.log('Profile update request:', { userId, bio, city, campus, profileImage });
    console.log('Auth user:', req.user.id);

    // Can only update own profile
    if (req.user.id !== parseInt(userId)) {
      console.log('Authorization failed: user', req.user.id, 'trying to update', userId);
      return res.status(403).json({ message: 'Can only update your own profile' });
    }

    const updateRes = await query(
      `UPDATE users SET 
        bio = COALESCE($1, bio),
        profile_image = COALESCE($2, profile_image),
        city = COALESCE($3, city),
        campus = COALESCE($4, campus),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, email, first_name, last_name, bio, profile_image, city, campus`,
      [bio || null, profileImage || null, city || null, campus || null, userId]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Profile updated successfully:', updateRes.rows[0]);
    res.json(updateRes.rows[0]);
  } catch (err) {
    console.error('Profile update error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
