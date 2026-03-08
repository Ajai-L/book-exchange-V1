const express = require('express');
const exchangeController = require('../controllers/exchangeController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, exchangeController.getExchanges);
router.get('/:id', authMiddleware, exchangeController.getExchange);
router.post('/', authMiddleware, exchangeController.createExchange);
router.put('/:id', authMiddleware, exchangeController.updateExchange);
router.delete('/:id', authMiddleware, exchangeController.deleteExchange);

module.exports = router;
