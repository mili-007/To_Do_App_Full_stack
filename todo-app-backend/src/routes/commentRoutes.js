const express = require('express');
const router = express.Router();
const { updateComment, deleteComment } = require('../controllers/commentController');

router.route('/:id')
  .put(updateComment)
  .delete(deleteComment);

module.exports = router;

