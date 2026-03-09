const mongoose = require('mongoose');

// This variable will store the connection once it's established
let conn = null;

async function connectDB() {
  // If we already have a connection, return it immediately (Caching)
  if (conn) {
    return conn;
  }

  // Check if the URI is configured
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set in .env');
    throw new Error('MONGODB_URI is not configured');
  }

  try {
    // Attempt to connect to MongoDB
    conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('Database connection error:', error.message);
    throw error;
  }
}

module.exports = connectDB;
