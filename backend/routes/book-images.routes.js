const express = require('express');
const { query } = require('../db/pool');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Add image to book
router.post('/:bookId/images', authMiddleware, async (req, res) => {
  try {
    const { bookId } = req.params;
    const { imageUrl } = req.body;

    // Verify book exists and user owns it
    const bookRes = await query('SELECT owner_id FROM books WHERE id = $1', [bookId]);
    if (bookRes.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (bookRes.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ message: 'Can only add images to your own books' });
    }

    // Add image
    const imageRes = await query(
      `INSERT INTO book_images (book_id, image_url, display_order)
       VALUES ($1, $2, (SELECT COALESCE(MAX(display_order), -1) + 1 FROM book_images WHERE book_id = $1))
       RETURNING id, image_url, display_order`,
      [bookId, imageUrl]
    );

    res.status(201).json(imageRes.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all images for a book
router.get('/:bookId/images', async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rows } = await query(
      'SELECT id, image_url, display_order FROM book_images WHERE book_id = $1 ORDER BY display_order ASC',
      [bookId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete image
router.delete('/images/:imageId', authMiddleware, async (req, res) => {
  try {
    const { imageId } = req.params;

    // Verify user owns the book
    const imageRes = await query(
      `SELECT bi.id, b.owner_id FROM book_images bi
       JOIN books b ON bi.book_id = b.id WHERE bi.id = $1`,
      [imageId]
    );

    if (imageRes.rows.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (imageRes.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ message: 'Can only delete your own images' });
    }

    await query('DELETE FROM book_images WHERE id = $1', [imageId]);
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
