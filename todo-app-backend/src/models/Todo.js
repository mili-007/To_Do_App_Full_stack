const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  // Many-to-One: Many todos belong to one project
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  // Many-to-Many: Todos can have many categories
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  // Many-to-Many: Users can share todos with other users
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for faster queries
todoSchema.index({ user: 1, createdAt: -1 });
todoSchema.index({ project: 1 });
todoSchema.index({ categories: 1 });
todoSchema.index({ sharedWith: 1 });

module.exports = mongoose.model('Todo', todoSchema);