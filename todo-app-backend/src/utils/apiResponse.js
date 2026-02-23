const { HTTP_STATUS } = require('../constants');

function success(res, data, statusCode = HTTP_STATUS.OK) {
  return res.status(statusCode).json(data);
}

function error(res, statusCode, message, errorDetail = undefined) {
  const body = { message };
  if (errorDetail !== undefined) {
    body.error = errorDetail;
  }
  return res.status(statusCode).json(body);
}

module.exports = {
  success,
  error,
};
