const pool = require('../config/database');

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connected successfully');
    
    // Cek tabel yang ada
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name IN ('users', 'products', 'cart', 'orders', 'order_items')
      ORDER BY table_name
    `);
    
    console.log('📊 Tables found:', result.rows.map(r => r.table_name));
    
    // Buat tabel jika tidak ada
    if (!result.rows.some(r => r.table_name === 'users')) {
      console.log('⚠️  Users table not found, creating...');
      await createTables(client);
    }
    
    client.release();
    return true;
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err.message);
    return false;
  }
}

async function createTables(client = null) {
  const shouldReleaseClient = !client;
  
  try {
    if (!client) {
      client = await pool.connect();
    }
    
    console.log('🛠️  ========== START CREATE TABLES ==========');
    
    // Tabel users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created users table');
    
    // Tabel products
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(50),
        image_url VARCHAR(255),
        flash_sale BOOLEAN DEFAULT false,
        stock INTEGER DEFAULT 100,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created products table');
    
    // Tabel cart (mengikuti schema.sql)
    await client.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL,
        product_name VARCHAR(100) NOT NULL,
        product_price DECIMAL(10,2) NOT NULL,
        product_image VARCHAR(255),
        quantity INTEGER DEFAULT 1,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created cart table');
    
    // Tabel orders (mengikuti schema.sql)
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        shipping_address TEXT,
        payment_method VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created orders table');
    
    // Tabel order_items (mengikuti schema.sql)
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL,
        product_name VARCHAR(100) NOT NULL,
        product_price DECIMAL(10,2) NOT NULL,
        quantity INTEGER NOT NULL,
        subtotal DECIMAL(10,2) GENERATED ALWAYS AS (product_price * quantity) STORED
      )
    `);
    console.log('✅ Created order_items table');
    
    console.log('🎉 ========== TABLES CREATED SUCCESSFULLY ==========');
    
  } catch (error) {
    console.error('🔥 Error creating tables:', error);
    throw error;
  } finally {
    if (shouldReleaseClient && client) {
      client.release();
    }
  }
}

module.exports = {
  pool,
  testConnection,
  createTables
};