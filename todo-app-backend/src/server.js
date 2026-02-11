const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n⚠️  Please create a .env file in the root directory with the following:');
  console.error('   MONGODB_URI=your-mongodb-connection-string');
  console.error('   JWT_SECRET=your-secret-key-here');
  console.error('   PORT=5000 (optional)');
  console.error('   NODE_ENV=development (optional)');
  console.error('\n⚠️  Server will start but API calls will fail until these are configured.\n');
}

const app = express();

// ============================================
// CORS - MUST BE ABSOLUTE FIRST MIDDLEWARE
// ============================================
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Log for debugging
  console.log(`\n[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  console.log(`Origin: ${origin || 'None'}`);
  
  // Set CORS headers for ALL requests
  if (origin === 'http://localhost:5173') {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    if (origin) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept');
  res.setHeader('Access-Control-Expose-Headers', 'Authorization');
  res.setHeader('Access-Control-Max-Age', '3600');
  
  // Handle OPTIONS preflight - MUST return before any other processing
  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS preflight - sending 200 with CORS headers');
    return res.status(200).end();
  }
  
  next();
});

// Connect to database (after CORS setup)
let dbConnected = false;
connectDB()
  .then(() => {
    dbConnected = true;
    console.log('✅ Database connection established');
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.log('⚠️  Server will continue but API calls requiring database will fail');
    console.log('⚠️  Please check your MONGODB_URI and ensure MongoDB is accessible');
    dbConnected = false;
  });

// Route files
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const projectRoutes = require('./routes/projectRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const commentRoutes = require('./routes/commentRoutes');

// Request logging middleware (for debugging) - BEFORE body parser
app.use((req, res, next) => {
  console.log(`\n=== ${new Date().toISOString()} ===`);
  console.log(`Method: ${req.method}`);
  console.log(`Path: ${req.path}`);
  console.log(`Origin: ${req.headers.origin || 'No origin'}`);
  console.log(`Content-Type: ${req.headers['content-type'] || 'No content-type'}`);
  next();
});

// Body parser
app.use(express.json());

// Test route to verify server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  console.error('Error stack:', err.stack);
  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: isDevelopment ? err.message : undefined,
    stack: isDevelopment ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
