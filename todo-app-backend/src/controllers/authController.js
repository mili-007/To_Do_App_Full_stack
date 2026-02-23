const authService = require('../services/authService');
const apiResponse = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/errors');
const { HTTP_STATUS } = require('../constants');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.register({ name, email, password });
  return apiResponse.success(res, {
    _id: result.user._id,
    name: result.user.name,
    email: result.user.email,
    token: result.token,
  }, HTTP_STATUS.CREATED);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  return apiResponse.success(res, {
    _id: result.user._id,
    name: result.user.name,
    email: result.user.email,
    token: result.token,
  });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user._id);
  return apiResponse.success(res, user);
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
