const Comment = require('../models/Comment');
const Todo = require('../models/Todo');

// @desc    Get all comments for a todo
// @route   GET /api/todos/:todoId/comments
// @access  Private
const getComments = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.todoId);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Check if user has access to this todo
    const hasAccess = todo.user.toString() === req.user._id.toString() ||
      todo.sharedWith.some(id => id.toString() === req.user._id.toString());
    
    if (!hasAccess) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Get all comments for this todo (One-to-Many relationship)
    const comments = await Comment.find({ todo: req.params.todoId })
      .populate('user', 'name email')
      .sort('createdAt');
    
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a comment
// @route   POST /api/todos/:todoId/comments
// @access  Private
const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const todo = await Todo.findById(req.params.todoId);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Check if user has access to this todo
    const hasAccess = todo.user.toString() === req.user._id.toString() ||
      todo.sharedWith.some(id => id.toString() === req.user._id.toString());
    
    if (!hasAccess) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const comment = await Comment.create({
      content,
      todo: req.params.todoId,
      user: req.user._id
    });
    
    // Populate user info before sending
    await comment.populate('user', 'name email');
    
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user owns the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    comment.content = content || comment.content;
    
    const updatedComment = await comment.save();
    await updatedComment.populate('user', 'name email');
    
    res.json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user owns the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await comment.deleteOne();
    res.json({ message: 'Comment removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment
};

