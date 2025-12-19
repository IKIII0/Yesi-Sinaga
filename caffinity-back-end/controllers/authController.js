const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../models/db');

const register = async (req, res) => {
  console.log('='.repeat(60));
  console.log('🔵 [REGISTER] Starting registration process');
  console.log('🔵 Request body:', req.body);
  
  try {
    const { username, email, password } = req.body;
    
    // Validasi input
    if (!username || !email || !password) {
      console.log('🔴 [REGISTER] Missing fields');
      return res.status(400).json({ 
        success: false,
        error: 'All fields are required',
        details: { username: !!username, email: !!email, password: !!password }
      });
    }
    
    console.log('🔵 [REGISTER] Validating input...');
    
    // Check if user exists
    console.log('🔵 [REGISTER] Checking if user exists...');
    const userCheck = await pool.query(
      'SELECT id, username, email FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    
    console.log('🔵 [REGISTER] User check result:', userCheck.rows);
    
    if (userCheck.rows.length > 0) {
      console.log('🔴 [REGISTER] User already exists');
      return res.status(400).json({ 
        success: false,
        error: 'User with this email or username already exists',
        existing: userCheck.rows[0]
      });
    }
    
    // Hash password
    console.log('🔵 [REGISTER] Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    let newUser;
    try {
      console.log('🔵 [REGISTER] Inserting user into database...');
      
      newUser = await pool.query(
        `INSERT INTO users (username, email, password) 
         VALUES ($1, $2, $3) 
         RETURNING id, username, email, created_at`,
        [username, email, hashedPassword]
      );
      
      console.log('✅ [REGISTER] Database INSERT successful!');
      console.log('✅ [REGISTER] User created:', newUser.rows[0]);
      
    } catch (dbError) {
      console.error('🔥🔥🔥 [REGISTER] DATABASE INSERT ERROR:', dbError);
      
      if (dbError.code === '23505') {
        return res.status(400).json({
          success: false,
          error: 'User with this email or username already exists',
          detail: dbError.detail,
          code: dbError.code
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Database insertion failed',
        debug: dbError.message,
        code: dbError.code,
        detail: dbError.detail
      });
    }

    // Generate JWT token
    console.log('🔵 [REGISTER] Generating JWT token...');
    const token = jwt.sign(
      { 
        id: newUser.rows[0].id, 
        email: newUser.rows[0].email,
        username: newUser.rows[0].username 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );
    
    console.log('✅ [REGISTER] Token generated');
    console.log('🎉 [REGISTER] Registration successful!');
    console.log('='.repeat(60));
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser.rows[0],
      token
    });
    
  } catch (error) {
    console.error('🔥🔥🔥 [REGISTER] UNEXPECTED ERROR:', error);
    
    res.status(500).json({ 
      success: false,
      error: 'Registration failed',
      debug: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    });
  }
};

const login = async (req, res) => {
  console.log('🔵 [LOGIN] Attempting login for:', req.body.email);
  
  try {
    const { email, password } = req.body;
    
    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      console.log('🔴 [LOGIN] User not found:', email);
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }
    
    const user = result.rows[0];
    console.log('🔵 [LOGIN] User found:', user.username);
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('🔴 [LOGIN] Invalid password for:', email);
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        username: user.username 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    console.log('✅ [LOGIN] Successful for:', user.username);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('🔥 [LOGIN] ERROR:', error);
    res.status(500).json({ 
      success: false,
      error: 'Login failed',
      debug: error.message 
    });
  }
};

const testRegister = async (req, res) => {
  console.log('🧪 [TEST] Register test endpoint called');
  res.json({
    success: true,
    message: 'Test endpoint working',
    received: req.body,
    timestamp: new Date().toISOString(),
    server: 'Caffinity Backend'
  });
};

module.exports = {
  register,
  login,
  testRegister
};

// controllers/authController.js - tambahkan di akhir
const debugRegistration = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Step-by-step debug
    console.log('\n🔍 [DEBUG REGISTRATION] Step-by-step:');
    console.log('1. Received data:', { username, email, password: password ? '[SET]' : '[EMPTY]' });
    
    // Cek koneksi
    console.log('2. Testing database connection...');
    const client = await pool.connect();
    console.log('   ✅ Database connected');
    
    // Cek tabel users
    console.log('3. Checking users table...');
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      )
    `);
    console.log('   Table exists?', tableCheck.rows[0].exists);
    
    if (tableCheck.rows[0].exists) {
      // Cek data
      const userCount = await client.query('SELECT COUNT(*) FROM users');
      console.log('   Total users:', userCount.rows[0].count);
      
      // Cek jika user sudah ada
      const existing = await client.query(
        'SELECT id, username, email FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );
      console.log('   Existing users with same email/username:', existing.rows);
    }
    
    client.release();
    
    res.json({
      success: true,
      steps: {
        connection: 'ok',
        table_exists: tableCheck.rows[0].exists,
        debug_data: {
          username,
          email,
          password_length: password ? password.length : 0
        }
      }
    });
    
  } catch (error) {
    console.error('🔥 [DEBUG REGISTRATION ERROR]:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
};

// Jangan lupa export
module.exports = {
  register,
  login,
  testRegister,
  debugRegistration  // tambahkan ini
};