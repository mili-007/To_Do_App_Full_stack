const express = require('express');
const router = express.Router();
const {
  getTodoById,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getComments,
  createComment,
} = require('../controllers/todoController');

router.route('/')
  .get(getTodos)
  .post(createTodo);

router.route('/:id')
  .get(getTodoById)
  .put(updateTodo)
  .delete(deleteTodo);

router.route('/:todoId/comments')
  .get(getComments)
  .post(createComment);

module.exports = router;