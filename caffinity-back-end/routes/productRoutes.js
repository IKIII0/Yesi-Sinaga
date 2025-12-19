const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET ALL PRODUCTS
router.get('/', productController.getAllProducts);

// GET FLASH SALE PRODUCTS
router.get('/flash-sale', productController.getFlashSaleProducts);

module.exports = router;