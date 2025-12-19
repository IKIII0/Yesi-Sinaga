const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET ALL USERS
router.get('/', userController.getAllUsers);

// GET USER BY ID
router.get('/:id', userController.getUserById);

// UPDATE USER (protected, only self)
router.put('/:id', authenticateToken, userController.updateUser);

// GET USER PROFILE (WITH AUTH)
router.get('/profile', authenticateToken, userController.getUserProfile);

// DATABASE CHECK
router.get('/debug/db-check', userController.dbCheck);

// routes/userRoutes.js - tambahkan di akhir
router.get('/debug/db-tables', async (req, res) => {
  try {
    const { pool } = require('../models/db');
    const result = await pool.query(`
      SELECT table_name, table_schema 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    res.json({
      success: true,
      tables: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;