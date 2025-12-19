const cors = require("cors");

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://caffinity-front-end.vercel.app",
    "https://caffinity-fe.vercel.app",
  ],
  credentials: true,
};

module.exports = corsOptions;
