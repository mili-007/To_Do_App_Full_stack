const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  color: {
    type: String,
    default: '#3B82F6' // Default blue color
  }
}, {
  timestamps: true
});

// Index for faster queries
projectSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);

