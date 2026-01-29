const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { getPrisma } = require('../config/prisma');
const { toMongoLikeUser } = require('../utils/mongoLike');

// Generate JWT Token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    const error = new Error('JWT_SECRET is not defined in environment variables');
    error.name = 'JWTSecretError';
    throw error;
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

    // -----------------------------------
    // MongoDB (old) - kept for reference
    // -----------------------------------
    // const mongoose = require('mongoose');
    // if (mongoose.connection.readyState !== 1) {
    //   return res.status(500).json({
    //     message: 'Database connection error',
    //     error: 'Database is not connected. Please check your MONGODB_URI and ensure MongoDB is running.'
    //   });
    // }

    // Log request body for debugging
    console.log('Registration request body:', { 
      name: req.body?.name ? 'provided' : 'missing',
      email: req.body?.email ? 'provided' : 'missing',
      password: req.body?.password ? 'provided' : 'missing'
    });

    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    let user;
    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();

      const userExists = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: {
          name: String(name).trim(),
          email: normalizedEmail,
          password: hashedPassword,
        },
        select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
      });
      user = toMongoLikeUser(user);
    } else {
      // Default: MongoDB
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      user = await User.create({
        name,
        email: normalizedEmail,
        password,
      });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    console.error('Error Stack:', error.stack);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'User already exists' });
    }
    if (error.name === 'JWTSecretError') {
      return res.status(500).json({ 
        message: 'Server configuration error: JWT_SECRET is missing',
        error: 'Please configure JWT_SECRET in your .env file'
      });
    }
    if (error.name === 'MongoServerError' || error.name === 'MongooseError') {
      return res.status(500).json({ 
        message: 'Database connection error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Unable to connect to database'
      });
    }
    
    // Generic error response with detailed info in development
    // Always include error details in development mode for debugging
    const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    res.status(500).json({ 
      message: 'Server error',
      error: isDevelopment ? error.message : 'An internal server error occurred',
      errorName: isDevelopment ? error.name : undefined,
      stack: isDevelopment ? error.stack : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();
    const normalizedEmail = String(email || '').trim().toLowerCase();

    let user;
    let isPasswordMatch = false;

    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();
      const dbUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: { id: true, name: true, email: true, password: true, createdAt: true, updatedAt: true },
      });
      if (!dbUser) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      isPasswordMatch = await bcrypt.compare(password, dbUser.password);
      if (!isPasswordMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      // strip password before sending
      // eslint-disable-next-line no-unused-vars
      const { password: _pw, ...safeUser } = dbUser;
      user = toMongoLikeUser(safeUser);
    } else {
      // Default: MongoDB
      user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login Error:', error);
    console.error('Error Stack:', error.stack);
    
    // Handle specific error types
    if (error.name === 'JWTSecretError') {
      return res.status(500).json({ 
        message: 'Server configuration error: JWT_SECRET is missing',
        error: 'Please configure JWT_SECRET in your .env file'
      });
    }
    if (error.name === 'MongoServerError' || error.name === 'MongooseError') {
      return res.status(500).json({ 
        message: 'Database connection error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Unable to connect to database'
      });
    }
    
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

    // -----------------------------------
    // MongoDB (old) - kept for reference
    // -----------------------------------
    // const user = await User.findById(req.user._id).select('-password');
    // res.json(user);

    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();
      const user = await prisma.user.findUnique({
        where: { id: req.user._id },
        select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
      });
      res.json(toMongoLikeUser(user));
    } else {
      const user = await User.findById(req.user._id).select('-password');
      res.json(user);
    }
  } catch (error) {
    console.error('Get Profile Error:', error);
    console.error('Error Stack:', error.stack);
    
    if (error.name === 'MongoServerError' || error.name === 'MongooseError') {
      return res.status(500).json({ 
        message: 'Database connection error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Unable to connect to database'
      });
    }
    
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};