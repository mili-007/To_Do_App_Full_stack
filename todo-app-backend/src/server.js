const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const corsMiddleware = require('./middleware/cors');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

validateEnv();

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

const mountRoutes = require('./routes');
mountRoutes(app);

app.use(errorHandler);

connectDB().catch((err) => {
  console.error('Database connection failed:', err.message);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function validateEnv() {
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing.join(', '));
    console.error('Set MONGODB_URI and JWT_SECRET in .env');
    process.exit(1);
  }
}
