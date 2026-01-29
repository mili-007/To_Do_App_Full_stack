const Comment = require('../models/Comment');
const Todo = require('../models/Todo');
const { getPrisma } = require('../config/prisma');
const { toMongoLikeComment, toMongoLikeUser } = require('../utils/mongoLike');

// @desc    Get all comments for a todo
// @route   GET /api/todos/:todoId/comments
// @access  Private
const getComments = async (req, res) => {
  try {
    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

    // -----------------------------------
    // MongoDB (old) - kept for reference
    // -----------------------------------
    // const todo = await Todo.findById(req.params.todoId);
    // if (!todo) return res.status(404).json({ message: 'Todo not found' });
    // const hasAccess = todo.user.toString() === req.user._id.toString() ||
    //   todo.sharedWith.some(id => id.toString() === req.user._id.toString());
    // if (!hasAccess) return res.status(401).json({ message: 'Not authorized' });
    // const comments = await Comment.find({ todo: req.params.todoId })
    //   .populate('user', 'name email')
    //   .sort('createdAt');
    // res.json(comments);

    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();
      const todo = await prisma.todo.findUnique({
        where: { id: req.params.todoId },
        include: { sharedWith: true },
      });

      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }

      const hasAccess = todo.userId === req.user._id || (todo.sharedWith || []).some((s) => s.userId === req.user._id);
      if (!hasAccess) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const comments = await prisma.comment.findMany({
        where: { todoId: req.params.todoId },
        orderBy: { createdAt: 'asc' },
        include: { user: { select: { id: true, name: true, email: true } } },
      });

      const shaped = comments.map((c) =>
        toMongoLikeComment({
          ...c,
          user: toMongoLikeUser(c.user),
        })
      );

      return res.json(shaped);
    }

    // Default: MongoDB
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

// @desc    Create a comment
// @route   POST /api/todos/:todoId/comments
// @access  Private
const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

    // -----------------------------------
    // MongoDB (old) - kept for reference
    // -----------------------------------
    // const todo = await Todo.findById(req.params.todoId);
    // if (!todo) return res.status(404).json({ message: 'Todo not found' });
    // const hasAccess = todo.user.toString() === req.user._id.toString() ||
    //   todo.sharedWith.some(id => id.toString() === req.user._id.toString());
    // if (!hasAccess) return res.status(401).json({ message: 'Not authorized' });
    // const comment = await Comment.create({
    //   content,
    //   todo: req.params.todoId,
    //   user: req.user._id
    // });
    // await comment.populate('user', 'name email');
    // res.status(201).json(comment);

    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();
      const todo = await prisma.todo.findUnique({
        where: { id: req.params.todoId },
        include: { sharedWith: true },
      });

      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }

      const hasAccess = todo.userId === req.user._id || (todo.sharedWith || []).some((s) => s.userId === req.user._id);
      if (!hasAccess) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const comment = await prisma.comment.create({
        data: {
          content,
          todo: { connect: { id: req.params.todoId } },
          user: { connect: { id: req.user._id } },
        },
        include: { user: { select: { id: true, name: true, email: true } } },
      });

      return res.status(201).json(
        toMongoLikeComment({
          ...comment,
          user: toMongoLikeUser(comment.user),
        })
      );
    }

    // Default: MongoDB
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
      content,
      todo: req.params.todoId,
      user: req.user._id,
    });

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
    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

    // -----------------------------------
    // MongoDB (old) - kept for reference
    // -----------------------------------
    // const comment = await Comment.findById(req.params.id);
    // if (!comment) return res.status(404).json({ message: 'Comment not found' });
    // if (comment.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    // comment.content = content || comment.content;
    // const updatedComment = await comment.save();
    // await updatedComment.populate('user', 'name email');
    // res.json(updatedComment);

    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();
      const existing = await prisma.comment.findUnique({
        where: { id: req.params.id },
        select: { id: true, userId: true },
      });

      if (!existing) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      if (existing.userId !== req.user._id) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const updated = await prisma.comment.update({
        where: { id: req.params.id },
        data: { content: content || undefined },
        include: { user: { select: { id: true, name: true, email: true } } },
      });

      return res.json(
        toMongoLikeComment({
          ...updated,
          user: toMongoLikeUser(updated.user),
        })
      );
    }

    // Default: MongoDB
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

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
    const DB_PROVIDER = (process.env.DB_PROVIDER || 'mongo').toLowerCase();

    // -----------------------------------
    // MongoDB (old) - kept for reference
    // -----------------------------------
    // const comment = await Comment.findById(req.params.id);
    // if (!comment) return res.status(404).json({ message: 'Comment not found' });
    // if (comment.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    // await comment.deleteOne();
    // res.json({ message: 'Comment removed' });

    if (DB_PROVIDER === 'postgres') {
      const prisma = getPrisma();
      const existing = await prisma.comment.findUnique({
        where: { id: req.params.id },
        select: { id: true, userId: true },
      });

      if (!existing) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      if (existing.userId !== req.user._id) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      await prisma.comment.delete({ where: { id: req.params.id } });
      return res.json({ message: 'Comment removed' });
    }

    // Default: MongoDB
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

