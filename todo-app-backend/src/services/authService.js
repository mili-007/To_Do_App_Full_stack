const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validatePasswordStrength, validatePasswordForLogin } = require('../utils/passwordValidation');
const { AppError } = require('../utils/errors');
const { HTTP_STATUS, MESSAGES } = require('../constants');


/////// generate token function
function generateToken(userId) {
  const secretKey = process.env.JWT_SECRET;
  const expireTime = process.env.JWT_EXPIRE || '7d';
  // secret key check
  if (!secretKey) {
    throw AppError(MESSAGES.JWT_MISSING, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
  //// token create with ID and secret key
  return jwt.sign({ id: userId }, secretKey, { expiresIn: expireTime });
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
    throw AppError(MESSAGES.AUTH_REQUIRED, HTTP_STATUS.BAD_REQUEST);
  }

  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.valid) {
    throw AppError(
      `Password must be strong: ${passwordValidation.message}`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw AppError(MESSAGES.USER_ALREADY_EXISTS, HTTP_STATUS.BAD_REQUEST);
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
    throw AppError(msg, HTTP_STATUS.BAD_REQUEST);
  }

  const loginPasswordCheck = validatePasswordForLogin(passwordVal);
  if (!loginPasswordCheck.valid) {
    throw AppError(loginPasswordCheck.message, HTTP_STATUS.BAD_REQUEST);
  }

  const user = await User.findOne({ email: emailVal });
  if (!user) {
    throw AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.BAD_REQUEST);
  }

  const isMatch = await user.comparePassword(passwordVal);
  if (!isMatch) {
    throw AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.BAD_REQUEST);
  }

  return {
    user: sanitizeUser(user),
    token: generateToken(user._id),
  };
}


module.exports = {
  register,
  login,
  generateToken,
};
