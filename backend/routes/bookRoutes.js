const express = require('express');
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBook);
router.post('/', authMiddleware, bookController.createBook);
router.put('/:id', authMiddleware, bookController.updateBook);
router.delete('/:id', authMiddleware, bookController.deleteBook);
router.get('/user/:userId', bookController.getUserBooks);

module.exports = router;
