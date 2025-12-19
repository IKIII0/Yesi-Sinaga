const { pool } = require('../models/db');

// Helper untuk hitung total dari cart
const calculateCartTotal = (cartRows) => {
  return cartRows.reduce((sum, row) => {
    const price = Number(row.product_price) || 0;
    const qty = Number(row.quantity) || 0;
    return sum + price * qty;
  }, 0);
};

// POST /api/orders - buat order dari cart user yang sedang login
const createOrderFromCart = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  const { shipping_address, payment_method } = req.body || {};

  const client = await pool.connect();

  try {
    console.log(`🔵 [ORDER] POST /api/orders - user ${userId}`);

    await client.query('BEGIN');

    // Ambil semua item cart user
    const cartResult = await client.query(
      `SELECT * FROM cart WHERE user_id = $1 ORDER BY added_at ASC`,
      [userId]
    );

    const cartRows = cartResult.rows;

    if (cartRows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Hitung total dari cart
    const totalAmount = calculateCartTotal(cartRows);

    // Insert ke tabel orders
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, totalAmount, 'pending', shipping_address || null, payment_method || null]
    );

    const order = orderResult.rows[0];

    // Insert ke order_items untuk setiap row cart
    const orderItems = [];

    for (const row of cartRows) {
      const itemResult = await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          order.id,
          row.product_id,
          row.product_name,
          row.product_price,
          row.quantity,
        ]
      );
      orderItems.push(itemResult.rows[0]);
    }

    // Hapus cart user
    await client.query(`DELETE FROM cart WHERE user_id = $1`, [userId]);

    await client.query('COMMIT');

    console.log(`✅ [ORDER] Created order ${order.id} with ${orderItems.length} items for user ${userId}`);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order,
        items: orderItems,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('🔥 [ORDER] ERROR createOrderFromCart:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create order from cart',
      error: error.message,
    });
  } finally {
    client.release();
  }
};

// GET /api/orders - semua order milik user login
const getUserOrders = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  try {
    console.log(`🔵 [ORDER] GET /api/orders - user ${userId}`);

    const result = await pool.query(
      `SELECT *
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('🔥 [ORDER] ERROR getUserOrders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get user orders',
      error: error.message,
    });
  }
};

// GET /api/orders/:id - detail order (header + items)
const getOrderById = async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  try {
    console.log(`🔵 [ORDER] GET /api/orders/${id} - user ${userId}`);

    const orderResult = await pool.query(
      `SELECT * FROM orders WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(
      `SELECT * FROM order_items WHERE order_id = $1 ORDER BY id ASC`,
      [id]
    );

    return res.status(200).json({
      success: true,
      data: {
        order,
        items: itemsResult.rows,
      },
    });
  } catch (error) {
    console.error('🔥 [ORDER] ERROR getOrderById:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get order details',
      error: error.message,
    });
  }
};

// PUT /api/orders/:id/confirm - user mengkonfirmasi pesanan sudah sampai
const confirmOrder = async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  try {
    console.log(`🔵 [ORDER] PUT /api/orders/${id}/confirm - user ${userId}`);

    const result = await pool.query(
      `UPDATE orders
       SET status = 'completed'
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const order = result.rows[0];

    return res.status(200).json({
      success: true,
      message: 'Order confirmed as completed',
      data: order,
    });
  } catch (error) {
    console.error('🔥 [ORDER] ERROR confirmOrder:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to confirm order',
      error: error.message,
    });
  }
};

module.exports = {
  createOrderFromCart,
  getUserOrders,
  getOrderById,
  confirmOrder,
};
