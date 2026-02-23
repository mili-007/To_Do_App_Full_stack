const commentService = require('../services/commentService');
const apiResponse = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/errors');
const { MESSAGES } = require('../constants');

const updateComment = asyncHandler(async (req, res) => {
  const comment = await commentService.update(
    req.params.id,
    req.user._id,
    req.body.content
  );
  return apiResponse.success(res, comment);
});

const deleteComment = asyncHandler(async (req, res) => {
  await commentService.remove(req.params.id, req.user._id);
  return apiResponse.success(res, { message: MESSAGES.COMMENT_REMOVED });
});

module.exports = {
  updateComment,
  deleteComment,
};
