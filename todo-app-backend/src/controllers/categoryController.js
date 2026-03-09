const categoryService = require('../services/categoryService');
const apiResponse = require('../utils/apiResponse');
const { HTTP_STATUS, MESSAGES } = require('../constants');

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAll(req.user._id);
    return apiResponse.success(res, categories);
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const category = await categoryService.getById(req.params.id, req.user._id);
    return apiResponse.success(res, category);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.create(req.user._id, req.body);
    return apiResponse.success(res, category, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.update(req.params.id, req.user._id, req.body);
    return apiResponse.success(res, category);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.remove(req.params.id, req.user._id);
    return apiResponse.success(res, { message: MESSAGES.CATEGORY_REMOVED });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
