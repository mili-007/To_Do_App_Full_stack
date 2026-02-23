const authRoutes = require('./authRoutes');
const todoRoutes = require('./todoRoutes');
const projectRoutes = require('./projectRoutes');
const categoryRoutes = require('./categoryRoutes');
const commentRoutes = require('./commentRoutes');
const { protect } = require('../middleware/authMiddleware');

function mountRoutes(app) {
  app.use('/api/auth', authRoutes);

  /// All routes with protected middleware 
  app.use('/api/todos', protect, todoRoutes);
  app.use('/api/projects', protect, projectRoutes);
  app.use('/api/categories', protect, categoryRoutes);
  app.use('/api/comments', protect, commentRoutes);
}

module.exports = mountRoutes;
