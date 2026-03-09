const todoService = require('../services/todoService');
const commentService = require('../services/commentService');
const apiResponse = require('../utils/apiResponse');
const { HTTP_STATUS, MESSAGES } = require('../constants');

const getTodoById = async (req, res, next) => {
  try {
    const todo = await todoService.getById(req.params.id, req.user._id);
    return apiResponse.success(res, todo);
  } catch (error) {
    next(error);
  }
};

const getTodos = async (req, res, next) => {
  try {
    const { project } = req.query;
    const todos = await todoService.getAll(req.user._id, project);
    return apiResponse.success(res, todos);
  } catch (error) {
    next(error);
  }
};

const createTodo = async (req, res, next) => {
  try {
    const todo = await todoService.create(req.user._id, req.body);
    return apiResponse.success(res, todo, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const todo = await todoService.update(req.params.id, req.user._id, req.body);
    return apiResponse.success(res, todo);
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    await todoService.remove(req.params.id, req.user._id);
    return apiResponse.success(res, { message: MESSAGES.TODO_REMOVED });
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const comments = await commentService.getCommentsByTodo(req.params.todoId, req.user._id);
    return apiResponse.success(res, comments);
  } catch (error) {
    next(error);
  }
};

const createComment = async (req, res, next) => {
  try {
    const comment = await commentService.create(
      req.params.todoId,
      req.user._id,
      req.body.content
    );
    return apiResponse.success(res, comment, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodoById,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getComments,
  createComment,
};
