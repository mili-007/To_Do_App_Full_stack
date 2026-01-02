const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please add a comment'],
    trim: true
  },
  todo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
commentSchema.index({ todo: 1, createdAt: -1 });
commentSchema.index({ user: 1 });

module.exports = mongoose.model('Comment', commentSchema);

