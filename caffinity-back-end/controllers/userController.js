const { pool } = require('../models/db');

const getAllUsers = async (req, res) => {
  try {
    console.log('🔵 [USERS] GET /api/users requested');
    
    const result = await pool.query(
      'SELECT id, username, email, created_at FROM users ORDER BY created_at DESC'
    );
    
    console.log(`✅ [USERS] Found ${result.rows.length} users`);
    
    res.status(200).json({
      success: true,
      count: result.rows.length,
      users: result.rows,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('🔥 [USERS] ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      debug: error.message
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔵 [USERS] GET /api/users/${id}`);
    
    const result = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user: result.rows[0]
    });
    
  } catch (error) {
    console.error('🔥 [USERS/:id] ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`🔵 [USERS] GET /api/users/profile for user ID: ${userId}`);
    
    const result = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('🔥 [USERS/profile] ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
};

const dbCheck = async (req, res) => {
  try {
    // Check connection
    const client = await pool.connect();
    
    // Check users table
    const users = await client.query('SELECT COUNT(*) as count FROM users');
    const products = await client.query('SELECT COUNT(*) as count FROM products');
    
    client.release();
    
    res.json({
      success: true,
      database: 'connected',
      tables: {
        users: parseInt(users.rows[0].count),
        products: parseInt(products.rows[0].count)
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      database: 'disconnected',
      error: error.message
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const authUserId = req.user?.id;

    console.log(`🔵 [USERS] PUT /api/users/${id} by auth user ${authUserId}`);

    if (!authUserId || String(authUserId) !== String(id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to update this user',
      });
    }

    const { username, email } = req.body;

    if (!username && !email) {
      return res.status(400).json({
        success: false,
        message: 'Nothing to update',
      });
    }

    // Build dynamic update
    const fields = [];
    const values = [];
    let idx = 1;

    if (username) {
      fields.push(`username = $${idx++}`);
      values.push(username);
    }
    if (email) {
      fields.push(`email = $${idx++}`);
      values.push(email);
    }

    values.push(id); // for WHERE

    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING id, username, email, created_at
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    console.log('✅ [USERS] Updated user', result.rows[0]);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('🔥 [USERS] ERROR updateUser:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message,
    });
  }
};

// GET PROFILE for /auth/profile (shape: { success, data: user })
const getAuthProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`🔵 [AUTH] GET /api/auth/profile for user ID: ${userId}`);

    // Ambil juga phone dan address supaya frontend bisa menampilkan dan mengedit keduanya
    const result = await pool.query(
      'SELECT id, username, email, phone, address, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = result.rows[0];

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('🔥 [AUTH/profile] ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message,
    });
  }
};

// UPDATE PROFILE for /auth/profile (expects body: { name, email })
const updateAuthProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`🔵 [AUTH] PUT /api/auth/profile for user ID: ${userId}`);

    const { name, email, phone, address } = req.body;

    // Minimal satu field harus ada
    if (!name && !email && !phone && !address) {
      return res.status(400).json({
        success: false,
        message: 'Nothing to update',
      });
    }

    // Map "name" dari frontend ke kolom username, dan update juga phone & address jika dikirim
    const fields = [];
    const values = [];
    let idx = 1;

    if (name) {
      fields.push(`username = $${idx++}`);
      values.push(name);
    }
    if (email) {
      fields.push(`email = $${idx++}`);
      values.push(email);
    }
    if (phone) {
      fields.push(`phone = $${idx++}`);
      values.push(phone);
    }
    if (address) {
      fields.push(`address = $${idx++}`);
      values.push(address);
    }

    values.push(userId);

    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING id, username, email, phone, address, created_at
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = result.rows[0];

    console.log('✅ [AUTH] Updated profile', user);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    console.error('🔥 [AUTH/profile] ERROR update:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserProfile,
  dbCheck,
  updateUser,
  getAuthProfile,
  updateAuthProfile
};