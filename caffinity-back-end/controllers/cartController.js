const { pool } = require('../models/db');

// GET CART ITEMS BY USER ID
const getCartByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    console.log(`🔵 [CART] GET /api/cart/user/${user_id}`);

    const result = await pool.query(
      `SELECT * FROM cart 
       WHERE user_id = $1 
       ORDER BY added_at DESC`,
      [user_id]
    );

    console.log(`✅ [CART] Found ${result.rows.length} items for user ${user_id}`);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      cart: result.rows,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🔥 [CART] ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cart items',
      debug: error.message
    });
  }
};

// ADD ITEM TO CART
const addToCart = async (req, res) => {
  try {
    const { user_id, product_id, product_name, product_price, product_image, quantity } = req.body;
    console.log(`🔵 [CART] POST /api/cart - Add item for user ${user_id}`);

    // Validasi input
    if (!user_id || !product_id || !product_name || !product_price) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: user_id, product_id, product_name, product_price'
      });
    }

    // Cek apakah item sudah ada di cart
    const existingItem = await pool.query(
      `SELECT * FROM cart 
       WHERE user_id = $1 AND product_id = $2`,
      [user_id, product_id]
    );

    let result;
    if (existingItem.rows.length > 0) {
      // Update quantity jika sudah ada
      result = await pool.query(
        `UPDATE cart 
         SET quantity = quantity + $1,
             added_at = CURRENT_TIMESTAMP
         WHERE user_id = $2 AND product_id = $3
         RETURNING *`,
        [quantity || 1, user_id, product_id]
      );
      console.log(`🔄 [CART] Updated quantity for existing item`);
    } else {
      // Insert baru jika belum ada
      result = await pool.query(
        `INSERT INTO cart 
         (user_id, product_id, product_name, product_price, product_image, quantity)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [user_id, product_id, product_name, product_price, product_image, quantity || 1]
      );
      console.log(`✅ [CART] Added new item to cart`);
    }

    res.status(200).json({
      success: true,
      message: existingItem.rows.length > 0 ? 'Cart item updated' : 'Item added to cart',
      cartItem: result.rows[0]
    });

  } catch (error) {
    console.error('🔥 [CART] ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add item to cart',
      debug: error.message
    });
  }
};

// UPDATE CART ITEM QUANTITY
const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    console.log(`🔵 [CART] PUT /api/cart/${id} - Update quantity to ${quantity}`);

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be at least 1'
      });
    }

    const result = await pool.query(
      `UPDATE cart 
       SET quantity = $1
       WHERE id = $2
       RETURNING *`,
      [quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

    console.log(`✅ [CART] Updated cart item ${id}`);
    
    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      cartItem: result.rows[0]
    });

  } catch (error) {
    console.error('🔥 [CART] ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update cart item',
      debug: error.message
    });
  }
};

// REMOVE ITEM FROM CART
const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔵 [CART] DELETE /api/cart/${id}`);

    const result = await pool.query(
      `DELETE FROM cart 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

    console.log(`✅ [CART] Removed item ${id} from cart`);
    
    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cartItem: result.rows[0]
    });

  } catch (error) {
    console.error('🔥 [CART] ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove item from cart',
      debug: error.message
    });
  }
};

// CLEAR USER'S CART
const clearCart = async (req, res) => {
  try {
    const { user_id } = req.params;
    console.log(`🔵 [CART] DELETE /api/cart/clear/${user_id}`);

    const result = await pool.query(
      `DELETE FROM cart 
       WHERE user_id = $1 
       RETURNING *`,
      [user_id]
    );

    console.log(`✅ [CART] Cleared ${result.rows.length} items for user ${user_id}`);
    
    res.status(200).json({
      success: true,
      message: `Cleared ${result.rows.length} items from cart`,
      clearedItems: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('🔥 [CART] ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cart',
      debug: error.message
    });
  }
};

// GET CART SUMMARY (total items, total price)
const getCartSummary = async (req, res) => {
  try {
    const { user_id } = req.params;
    console.log(`🔵 [CART] GET /api/cart/summary/${user_id}`);

    const result = await pool.query(
      `SELECT 
         COUNT(*) as total_items,
         SUM(quantity) as total_quantity,
         SUM(product_price * quantity) as total_price
       FROM cart 
       WHERE user_id = $1`,
      [user_id]
    );

    const summary = result.rows[0];
    
    res.status(200).json({
      success: true,
      summary: {
        total_items: parseInt(summary.total_items) || 0,
        total_quantity: parseInt(summary.total_quantity) || 0,
        total_price: parseFloat(summary.total_price) || 0
      }
    });

  } catch (error) {
    console.error('🔥 [CART] ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cart summary',
      debug: error.message
    });
  }
};

module.exports = {
  getCartByUserId,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary
};