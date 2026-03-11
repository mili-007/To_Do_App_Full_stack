const { HTTP_STATUS } = require('../constants');

function success(res, data, statusCode = HTTP_STATUS.OK) {
  return res.status(statusCode).json(data);
}

module.exports = {
  success,
};
