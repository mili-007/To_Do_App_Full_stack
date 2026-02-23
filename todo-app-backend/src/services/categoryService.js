const Category = require('../models/Category');
const Todo = require('../models/Todo');
const { AppError } = require('../utils/errors');
const { HTTP_STATUS, MESSAGES } = require('../constants');

function trimString(value) {
  return typeof value === 'string' ? value.trim() : value;
}

////// get all category function
async function getAll(userId) {
  return Category.find({ user: userId }).sort('name');
}

///// get category by ID function
async function getById(categoryId, userId) {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError(MESSAGES.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  if (category.user.toString() !== userId.toString()) {
    throw new AppError(MESSAGES.NOT_AUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }
  const todos = await Todo.find({
    categories: category._id,
    $or: [{ user: userId }, { sharedWith: userId }],
  })
    .populate('user', 'name email')
    .populate('project', 'name color')
    .populate('categories', 'name color')
    .sort('-createdAt');
  return { ...category.toObject(), todos };
}


/////// create new category function
async function create(userId, payload) {
  const { name, color } = payload;
  const trimmedName = trimString(name);
  if (!trimmedName) {
    throw new AppError(MESSAGES.CATEGORY_NAME_REQUIRED, HTTP_STATUS.BAD_REQUEST);
  }
  const existing = await Category.findOne({ name: trimmedName, user: userId });
  if (existing) {
    throw new AppError(MESSAGES.CATEGORY_NAME_EXISTS, HTTP_STATUS.BAD_REQUEST);
  }
  return Category.create({
    user: userId,
    name: trimmedName,
    color: color || '#10B981',
  });
}


///// update category function based on ID
async function update(categoryId, userId, payload) {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError(MESSAGES.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  if (category.user.toString() !== userId.toString()) {
    throw new AppError(MESSAGES.NOT_AUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }

  const { name, color } = payload;
  if (name !== undefined) {
    const trimmed = trimString(name);
    if (!trimmed) throw new AppError(MESSAGES.CATEGORY_NAME_REQUIRED, HTTP_STATUS.BAD_REQUEST);
    const existing = await Category.findOne({
      name: trimmed,
      user: userId,
      _id: { $ne: categoryId },
    });
    if (existing) throw new AppError(MESSAGES.CATEGORY_NAME_EXISTS, HTTP_STATUS.BAD_REQUEST);
    category.name = trimmed;
  }
  if (color !== undefined) category.color = color;

  return category.save();
}


/////// delete category function based on ID
async function remove(categoryId, userId) {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError(MESSAGES.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  if (category.user.toString() !== userId.toString()) {
    throw new AppError(MESSAGES.NOT_AUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }
  await Todo.updateMany(
    { categories: category._id },
    { $pull: { categories: category._id } }
  );
  await category.deleteOne();
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
