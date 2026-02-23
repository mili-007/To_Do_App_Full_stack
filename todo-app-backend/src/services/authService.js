const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validatePasswordStrength, validatePasswordForLogin } = require('../utils/passwordValidation');
const { AppError } = require('../utils/errors');
const { HTTP_STATUS, MESSAGES } = require('../constants');


/////// generate token function
function generateToken(userId) {
  if (!process.env.JWT_SECRET) {
    const err = new Error(MESSAGES.JWT_MISSING);
    err.name = 'JWTSecretError';
    throw err;
  }
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
}

///// common function sanitize user's data and pass that as a response
function sanitizeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
  };
}

/////// Register API function 
async function register({ name, email, password }) {
  if (!name || !email || !password) {
    throw new AppError(MESSAGES.AUTH_REQUIRED, HTTP_STATUS.BAD_REQUEST);
  }

  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.valid) {
    throw new AppError(
      `Password must be strong: ${passwordValidation.message}`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError(MESSAGES.USER_ALREADY_EXISTS, HTTP_STATUS.BAD_REQUEST);
  }

  const user = await User.create({ name, email, password });
  return {
    user: sanitizeUser(user),
    token: generateToken(user._id),
  };
}

/////// Login API function
async function login({ email, password }) {
  const emailVal = typeof email === 'string' ? email.trim() : '';
  const passwordVal = typeof password === 'string' ? password : '';

  const missing = [];
  if (!emailVal) missing.push('email');
  if (!passwordVal) missing.push('password');
  if (missing.length > 0) {
    const msg =
      missing.length === 2
        ? MESSAGES.EMAIL_PASSWORD_REQUIRED
        : `${missing[0].charAt(0).toUpperCase() + missing[0].slice(1)} is required`;
    throw new AppError(msg, HTTP_STATUS.BAD_REQUEST);
  }

  const loginPasswordCheck = validatePasswordForLogin(passwordVal);
  if (!loginPasswordCheck.valid) {
    throw new AppError(loginPasswordCheck.message, HTTP_STATUS.BAD_REQUEST);
  }

  const user = await User.findOne({ email: emailVal });
  if (!user) {
    throw new AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.BAD_REQUEST);
  }

  const isMatch = await user.comparePassword(passwordVal);
  if (!isMatch) {
    throw new AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.BAD_REQUEST);
  }

  return {
    user: sanitizeUser(user),
    token: generateToken(user._id),
  };
}

/////// get profile API function
async function getProfile(userId) {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  return user;
}

module.exports = {
  register,
  login,
  getProfile,
  generateToken,
};
