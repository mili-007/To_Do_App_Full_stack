const Comment = require('../models/Comment');
const Todo = require('../models/Todo');

// Get all comments for a todo
const getComments = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.todoId);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    const hasAccess = todo.user.toString() === req.user._id.toString() ||
      todo.sharedWith.some(id => id.toString() === req.user._id.toString());
    
    if (!hasAccess) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const comments = await Comment.find({ todo: req.params.todoId })
      .populate('user', 'name email')
      .sort('createdAt');
    
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a comment
const createComment = async (req, res) => {
  try {
    const { content } = req.body;

    const trimmedContent = typeof content === 'string' ? content.trim() : '';
    if (!trimmedContent) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const todo = await Todo.findById(req.params.todoId);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    const hasAccess = todo.user.toString() === req.user._id.toString() ||
      todo.sharedWith.some(id => id.toString() === req.user._id.toString());
    
    if (!hasAccess) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const comment = await Comment.create({
      content: trimmedContent,
      todo: req.params.todoId,
      user: req.user._id
    });
    
    await comment.populate('user', 'name email');
    
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (content !== undefined) {
      const trimmedContent = typeof content === 'string' ? content.trim() : '';
      if (!trimmedContent) {
        return res.status(400).json({ message: 'Comment content is required' });
      }
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    comment.content = content !== undefined ? (typeof content === 'string' ? content.trim() : comment.content) : comment.content;
    
    const updatedComment = await comment.save();
    await updatedComment.populate('user', 'name email');
    
    res.json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
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
