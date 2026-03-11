const { HTTP_STATUS } = require('../constants');

function AppError(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
  const err = new Error(message);
  err.name = 'AppError';
  err.statusCode = statusCode;
  return err;
}

module.exports = {
  AppError,
};
