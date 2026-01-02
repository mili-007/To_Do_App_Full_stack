const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not set in .env file');
      console.log('Please create a .env file with MONGODB_URI=your-connection-string');
      throw new Error('MONGODB_URI is not configured');
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Add connection options for better error handling
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Full error:', error);
    console.log('⚠️  Server will continue but database operations will fail');
    console.log('Please check your MONGODB_URI in .env file');
    // Re-throw to allow callers to handle
    throw error;
  }
};

module.exports = connectDB;