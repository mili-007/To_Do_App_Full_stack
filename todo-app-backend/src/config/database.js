const mongoose = require('mongoose');         ///// Connect DB using with mongoose ORM

const connectDB = async () => {
  try {
    // MONGODB_URI pass for connection
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not set in .env file');
      console.log('Please create a .env file with MONGODB_URI=your-connection-string');
      throw new Error('MONGODB_URI is not configured');
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,          //////// Wait till MongoDB server connect. after that throw error 
      socketTimeoutMS: 45000,                  ///// wait till query response 
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Full error:', error);
    console.log('Server will continue but database operations will fail');
    console.log('Please check your MONGODB_URI in .env file');
    throw error;
  }
};

module.exports = connectDB;