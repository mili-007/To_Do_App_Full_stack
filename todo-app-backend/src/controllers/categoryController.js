const categoryService = require('../services/categoryService');
const apiResponse = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/errors');
const { HTTP_STATUS, MESSAGES } = require('../constants');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAll(req.user._id);
  return apiResponse.success(res, categories);
});

const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getById(req.params.id, req.user._id);
  return apiResponse.success(res, category);
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.create(req.user._id, req.body);
  return apiResponse.success(res, category, HTTP_STATUS.CREATED);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.update(req.params.id, req.user._id, req.body);
  return apiResponse.success(res, category);
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.remove(req.params.id, req.user._id);
  return apiResponse.success(res, { message: MESSAGES.CATEGORY_REMOVED });
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
