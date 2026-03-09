const { HTTP_STATUS } = require('../constants');

function AppError(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
  return {
    message,
    statusCode
  };
}

module.exports = {
  AppError,
};
