const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/analytics', adminController.getAnalytics);
router.get('/users', adminController.getUsers);
router.post('/users/:id/block', adminController.blockUser);
router.get('/books', adminController.getBooks);
router.delete('/books/:id', adminController.deleteBookAdmin);
router.get('/reports', adminController.getReports);
router.post('/reports/:id/resolve', adminController.resolveReport);

module.exports = router;
