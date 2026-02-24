const { HTTP_STATUS, MESSAGES } = require('../constants');
const { AppError } = require('../utils/errors');

const isDevelopment = () =>
  process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const dev = isDevelopment();

  // statusCode and message
  if (err instanceof AppError) {
    const body = { message: err.message };
    if (dev && err.stack) body.stack = err.stack;
    return res.status(err.statusCode).json(body);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: MESSAGES.NOT_AUTHORIZED_INVALID_TOKEN,
    });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: MESSAGES.NOT_AUTHORIZED_TOKEN_EXPIRED,
    });
  }

  // Mongoose validation
  if (err.name === 'ValidationError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: err.message,
    });
  }

  // Mongo duplicate key (duplicate email)
  if (err.code === 11000) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: MESSAGES.USER_ALREADY_EXISTS,
    });
  }

  // Database errors
  if (err.name === 'MongoServerError' || err.name === 'MongooseError') {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.DB_ERROR,
      error: dev ? err.message : MESSAGES.DB_ERROR_GENERIC,
    });
  }

  // JWT secret missing 
  if (err.name === 'JWTSecretError') {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.JWT_MISSING,
      error: MESSAGES.JWT_CONFIGURE,
    });
  }

  // Unknown error and return generic message
  console.error('Error:', err.message);
  if (dev) console.error(err.stack);

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: MESSAGES.SERVER_ERROR,
    error: dev ? err.message : undefined,
  });
}

module.exports = errorHandler;
