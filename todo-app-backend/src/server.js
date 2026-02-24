const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const corsMiddleware = require('./middleware/cors');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

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
