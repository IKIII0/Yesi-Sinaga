const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
};

module.exports = corsOptions;