/**
 * Central place for HTTP status codes and common API messages.
 * Use these instead of magic numbers/strings so the code is self-documenting.
 */

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const MESSAGES = {
  // Auth
  AUTH_REQUIRED: 'Please provide all fields',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_ALREADY_EXISTS: 'User already exists',
  EMAIL_PASSWORD_REQUIRED: 'Email and password are required',
  JWT_MISSING: 'Server configuration error: JWT_SECRET is missing',
  JWT_CONFIGURE: 'Please configure JWT_SECRET in your .env file',

  // Generic
  SERVER_ERROR: 'Server error',
  NOT_AUTHORIZED: 'Not authorized',
  NOT_AUTHORIZED_NO_TOKEN: 'Not authorized, no token',
  NOT_AUTHORIZED_INVALID_TOKEN: 'Not authorized, invalid token',
  NOT_AUTHORIZED_TOKEN_EXPIRED: 'Not authorized, token expired',
  NOT_AUTHORIZED_TOKEN_FAILED: 'Not authorized, token failed',
  USER_NOT_FOUND: 'User not found',
  DB_NOT_CONNECTED: 'Database is not connected. Please check your MONGODB_URI and ensure MongoDB is running.',
  DB_ERROR: 'Database connection error',
  DB_ERROR_GENERIC: 'Unable to connect to database',

  // Resources
  TODO_NOT_FOUND: 'Todo not found',
  PROJECT_NOT_FOUND: 'Project not found',
  CATEGORY_NOT_FOUND: 'Category not found',
  COMMENT_NOT_FOUND: 'Comment not found',
  TITLE_REQUIRED: 'Title is required',
  PROJECT_NAME_REQUIRED: 'Project name is required',
  CATEGORY_NAME_REQUIRED: 'Category name is required',
  COMMENT_CONTENT_REQUIRED: 'Comment content is required',
  CATEGORY_NAME_EXISTS: 'Category with this name already exists',
  DUE_DATE_PAST: 'Due date cannot be in the past. Please select today or a future date.',

  // Success
  TODO_REMOVED: 'Todo removed',
  PROJECT_REMOVED: 'Project removed',
  CATEGORY_REMOVED: 'Category removed',
  COMMENT_REMOVED: 'Comment removed',
};

module.exports = {
  HTTP_STATUS,
  MESSAGES,
};
