const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET CART BY USER ID (Protected)
router.get('/user/:user_id', authenticateToken, cartController.getCartByUserId);

// ADD ITEM TO CART (Protected)
router.post('/', authenticateToken, cartController.addToCart);

// UPDATE CART ITEM QUANTITY (Protected)
router.put('/:id', authenticateToken, cartController.updateCartItem);

// REMOVE ITEM FROM CART (Protected)
router.delete('/:id', authenticateToken, cartController.removeFromCart);

// CLEAR USER'S CART (Protected)
router.delete('/clear/:user_id', authenticateToken, cartController.clearCart);

// GET CART SUMMARY (Protected)
router.get('/summary/:user_id', authenticateToken, cartController.getCartSummary);

// DEBUG: Get all cart items (for development only)
router.get('/debug/all', async (req, res) => {
  try {
    const { pool } = require('../models/db');
    const result = await pool.query('SELECT * FROM cart ORDER BY added_at DESC');
    
    res.json({
      success: true,
      count: result.rows.length,
      cart: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;