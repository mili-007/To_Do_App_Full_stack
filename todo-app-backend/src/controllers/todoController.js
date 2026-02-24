const todoService = require('../services/todoService');
const commentService = require('../services/commentService');
const apiResponse = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/errors');
const { HTTP_STATUS, MESSAGES } = require('../constants');

const getTodoById = asyncHandler(async (req, res) => {
  const todo = await todoService.getById(req.params.id, req.user._id);
  return apiResponse.success(res, todo);
});

const getTodos = asyncHandler(async (req, res) => {
  const { project } = req.query;
  const todos = await todoService.getAll(req.user._id, project);
  return apiResponse.success(res, todos);
});

const createTodo = asyncHandler(async (req, res) => {
  const todo = await todoService.create(req.user._id, req.body);
  return apiResponse.success(res, todo, HTTP_STATUS.CREATED);
});

const updateTodo = asyncHandler(async (req, res) => {
  const todo = await todoService.update(req.params.id, req.user._id, req.body);
  return apiResponse.success(res, todo);
});

const deleteTodo = asyncHandler(async (req, res) => {
  await todoService.remove(req.params.id, req.user._id);
  return apiResponse.success(res, { message: MESSAGES.TODO_REMOVED });
});

const getComments = asyncHandler(async (req, res) => {
  const comments = await commentService.getCommentsByTodo(req.params.todoId, req.user._id);
  return apiResponse.success(res, comments);
});

const createComment = asyncHandler(async (req, res) => {
  const comment = await commentService.create(
    req.params.todoId,
    req.user._id,
    req.body.content
  );
  return apiResponse.success(res, comment, HTTP_STATUS.CREATED);
});

module.exports = {
  getTodoById,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getComments,
  createComment,
};
