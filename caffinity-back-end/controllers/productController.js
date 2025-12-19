const { pool } = require('../models/db');

const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.status(200).json({
      success: true,
      count: result.rows.length,
      products: result.rows
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch products' 
    });
  }
};

const getFlashSaleProducts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE flash_sale = true ORDER BY created_at DESC'
    );
    res.status(200).json({
      success: true,
      count: result.rows.length,
      products: result.rows
    });
  } catch (error) {
    console.error('Get flash sale error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch flash sale products' 
    });
  }
};

module.exports = {
  getAllProducts,
  getFlashSaleProducts
};