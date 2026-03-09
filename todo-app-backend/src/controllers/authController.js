const authService = require('../services/authService');
const apiResponse = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants');

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });
    return apiResponse.success(res, {
      _id: result.user._id,
      name: result.user.name,
      email: result.user.email,
      token: result.token,
    }, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return apiResponse.success(res, {
      _id: result.user._id,
      name: result.user.name,
      email: result.user.email,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);
    return apiResponse.success(res, user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
