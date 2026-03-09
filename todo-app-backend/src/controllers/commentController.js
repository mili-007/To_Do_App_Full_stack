const commentService = require('../services/commentService');
const apiResponse = require('../utils/apiResponse');
const { MESSAGES } = require('../constants');

const updateComment = async (req, res, next) => {
  try {
    const comment = await commentService.update(
      req.params.id,
      req.user._id,
      req.body.content
    );
    return apiResponse.success(res, comment);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    await commentService.remove(req.params.id, req.user._id);
    return apiResponse.success(res, { message: MESSAGES.COMMENT_REMOVED });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateComment,
  deleteComment,
};
