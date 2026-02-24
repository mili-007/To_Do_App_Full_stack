const mongoose = require('mongoose');

/////// Class creating for check connection ////
class Database {
  constructor() {
    this.conn = null;
  }

  ///// function for connection /////
  async connect() {
    if (this.conn) {
      return this.conn;
    }

    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not set in .env');
      throw new Error('MONGODB_URI is not configured');
    }

    try {
      this.conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,            ////////////// wait 5 second to connection with server  
        socketTimeoutMS: 45000,                   ///////// 45 seconds for data getting/passing 
      });

      // console.log(`MongoDB Connected: ${this.conn.connection.host}`);
      console.log(`Database: ${this.conn.connection.name}`);
      return this.conn;
    } catch (error) {
      console.error('Database connection error:', error.message);
      throw error;
    }
  }
}

const dbInstance = new Database();
module.exports = dbInstance.connect.bind(dbInstance);
