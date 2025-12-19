const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const orderController = require('../controllers/orderController');

// Create order from current user's cart
router.post('/', authenticateToken, orderController.createOrderFromCart);

// Get all orders for current user
router.get('/', authenticateToken, orderController.getUserOrders);

// Get single order detail (header + items)
router.get('/:id', authenticateToken, orderController.getOrderById);

// Confirm order as completed
router.put('/:id/confirm', authenticateToken, orderController.confirmOrder);

module.exports = router;
