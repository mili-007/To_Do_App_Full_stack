const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { HTTP_STATUS, MESSAGES } = require('../constants');

async function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: MESSAGES.NOT_AUTHORIZED_NO_TOKEN,
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    if (!process.env.JWT_SECRET) {
      const err = new Error(MESSAGES.JWT_MISSING);
      err.name = 'JWTSecretError';
      return next(err);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: MESSAGES.USER_NOT_FOUND,
      });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { protect };
