const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getPrisma } = require('../config/prisma');
const { toMongoLikeUser } = require('../utils/mongoLike');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Check if JWT_SECRET is configured
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not configured');
        return res.status(500).json({ 
          message: 'Server configuration error: JWT_SECRET is missing',
          error: 'Please configure JWT_SECRET in your .env file'
        });
      }

      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

      // -----------------------------------
      // MongoDB (old) - kept for reference
      // -----------------------------------
      // req.user = await User.findById(decoded.id).select('-password');

      // -----------------------------------
      // PostgreSQL + Prisma (new)
      // -----------------------------------
      if (DB_PROVIDER === 'postgres') {
        const prisma = getPrisma();
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
        });
        req.user = toMongoLikeUser(user);
      } else {
        // Default: MongoDB
        req.user = await User.findById(decoded.id).select('-password');
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Not authorized, invalid token' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired' });
      }
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };