const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testConnection } = require("./models/db");
const corsOptions = require("./middleware/corsMiddleware");

// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orders");

const app = express();

// ==================== MIDDLEWARE ====================
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle pre-flight
app.options("*", cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Request Body:", req.body);
  }
  next();
});

// ==================== DATABASE CONNECTION ====================
testConnection().then((success) => {
  if (success) {
    console.log("✅ Database ready");
  } else {
    console.log("⚠️  Database connection failed - running in limited mode");
  }
});

// ==================== ROUTES ====================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// ==================== HEALTH CHECK ====================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    message: "Caffinity API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ==================== DEFAULT ROUTE ====================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Caffinity Coffee Shop API",
    version: "1.0.0",
    endpoints: {
      auth: [
        "POST /api/auth/register",
        "POST /api/auth/login",
        "POST /api/auth/test/register",
      ],
      products: ["GET /api/products", "GET /api/products/flash-sale"],
      users: [
        "GET /api/users",
        "GET /api/users/:id",
        "GET /api/users/profile (requires auth)",
        "GET /api/users/debug/db-check",
      ],
      debug: ["GET /api/health"],
    },
    documentation: "Check /api/health for service status",
  });
});

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error("🔥🔥🔥 GLOBAL ERROR HANDLER FIRED!");
  console.error("🔥 Error:", err);

  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
    type: err.name,
    timestamp: new Date().toISOString(),
  });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  🚀 Caffinity Server Started!
  ==================================
  📡 Port: ${PORT}
  🔗 Local: http://localhost:${PORT}
  
  📊 Available Endpoints:
  - Health Check:    http://localhost:${PORT}/api/health
  - All Products:    http://localhost:${PORT}/api/products
  - Flash Sale:      http://localhost:${PORT}/api/products/flash-sale
  - All Users:       http://localhost:${PORT}/api/users
  - User by ID:      http://localhost:${PORT}/api/users/1
  - Register:        http://localhost:${PORT}/api/auth/register
  - Login:           http://localhost:${PORT}/api/auth/login
  - DB Check:        http://localhost:${PORT}/api/users/debug/db-check
  
  ==================================
  🕒 Server started at: ${new Date().toLocaleTimeString()}
  ==================================
  `);
});
