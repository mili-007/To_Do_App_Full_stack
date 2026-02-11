const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validatePasswordStrength, validatePasswordForLogin } = require('../utils/passwordValidation');

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
    // Check if database is connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ 
        message: 'Database connection error',
        error: 'Database is not connected. Please check your MONGODB_URI and ensure MongoDB is running.'
      });
    }

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

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ message: `Password must be strong: ${passwordValidation.message}` });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

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

    const loginPasswordCheck = validatePasswordForLogin(password);
    if (!loginPasswordCheck.valid) {
      return res.status(400).json({ message: loginPasswordCheck.message });
    }

    // Check for user email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
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
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
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
