const express = require('express');
const router = express.Router();
const { 
  getTodos, 
  createTodo, 
  updateTodo, 
  deleteTodo 
} = require('../controllers/todoController');
const { 
  getComments, 
  createComment 
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// OPTIONS is handled at app level in server.js - no need for route-level handlers

router.route('/')
  .get(protect, getTodos)
  .post(protect, createTodo);

router.route('/:id')
  .put(protect, updateTodo)
  .delete(protect, deleteTodo);

// Comments nested under todos
router.route('/:todoId/comments')
  .get(protect, getComments)
  .post(protect, createComment);

module.exports = router;