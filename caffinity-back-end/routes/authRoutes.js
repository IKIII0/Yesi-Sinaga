const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

// REGISTER
router.post('/register', authController.register);

// LOGIN
router.post('/login', authController.login);

// GET AUTH PROFILE (current user)
router.get('/profile', authenticateToken, userController.getAuthProfile);

// UPDATE AUTH PROFILE (current user)
router.put('/profile', authenticateToken, userController.updateAuthProfile);

// TEST ENDPOINT
router.post('/test/register', authController.testRegister);

module.exports = router;