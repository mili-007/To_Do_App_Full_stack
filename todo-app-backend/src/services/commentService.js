const Comment = require('../models/Comment');
const Todo = require('../models/Todo');
const { AppError } = require('../utils/errors');
const { HTTP_STATUS, MESSAGES } = require('../constants');

function hasTodoAccess(todo, userId) {
  const owner = todo.user.toString() === userId.toString();
  const shared = todo.sharedWith?.some((id) => id.toString() === userId.toString());
  return owner || shared;
}


////// get comment list based on ID
async function getCommentsByTodo(todoId, userId) {
  const todo = await Todo.findById(todoId);
  if (!todo) {
    throw new AppError(MESSAGES.TODO_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  if (!hasTodoAccess(todo, userId)) {
    throw new AppError(MESSAGES.NOT_AUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }
  return Comment.find({ todo: todoId })
    .populate('user', 'name email')
    .sort('createdAt');
}


///// create new comment 
async function create(todoId, userId, content) {
  const trimmed = typeof content === 'string' ? content.trim() : '';
  if (!trimmed) {
    throw new AppError(MESSAGES.COMMENT_CONTENT_REQUIRED, HTTP_STATUS.BAD_REQUEST);
  }
  const todo = await Todo.findById(todoId);
  if (!todo) {
    throw new AppError(MESSAGES.TODO_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  if (!hasTodoAccess(todo, userId)) {
    throw new AppError(MESSAGES.NOT_AUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }
  const comment = await Comment.create({
    content: trimmed,
    todo: todoId,
    user: userId,
  });
  await comment.populate('user', 'name email');
  return comment;
}


///// update new comment based on ID
async function update(commentId, userId, content) {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError(MESSAGES.COMMENT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  if (comment.user.toString() !== userId.toString()) {
    throw new AppError(MESSAGES.NOT_AUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }
  if (content !== undefined) {
    const trimmed = typeof content === 'string' ? content.trim() : '';
    if (!trimmed) throw new AppError(MESSAGES.COMMENT_CONTENT_REQUIRED, HTTP_STATUS.BAD_REQUEST);
    comment.content = trimmed;
  }
  await comment.save();
  await comment.populate('user', 'name email');
  return comment;
}


///// delete comment based on ID
async function remove(commentId, userId) {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError(MESSAGES.COMMENT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  if (comment.user.toString() !== userId.toString()) {
    throw new AppError(MESSAGES.NOT_AUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }
  await comment.deleteOne();
}

module.exports = {
  getCommentsByTodo,
  create,
  update,
  remove,
};
