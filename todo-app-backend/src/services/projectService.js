const Project = require('../models/Project');
const Todo = require('../models/Todo');
const { AppError } = require('../utils/errors');
const { HTTP_STATUS, MESSAGES } = require('../constants');

function trimString(value) {
  return typeof value === 'string' ? value.trim() : value;
}


///// get all project by ID
async function getAll(userId) {
  return Project.find({ user: userId })
    .sort('-createdAt')
    .populate('user', 'name email');
}


///// get project by ID
async function getById(projectId, userId) {
  const project = await Project.findById(projectId).populate('user', 'name email');
  if (!project) {
    throw new AppError(MESSAGES.PROJECT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  if (project.user._id.toString() !== userId.toString()) {
    throw new AppError(MESSAGES.NOT_AUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }
  const todos = await Todo.find({ project: project._id })
    .populate('user', 'name email')
    .populate('categories', 'name color')
    .sort('-createdAt');
  return { ...project.toObject(), todos };
}



//// create new project 
async function create(userId, payload) {
  const { name, description, color } = payload;
  const trimmedName = trimString(name);
  if (!trimmedName) {
    throw new AppError(MESSAGES.PROJECT_NAME_REQUIRED, HTTP_STATUS.BAD_REQUEST);
  }
  return Project.create({
    user: userId,
    name: trimmedName,
    description: trimString(description),
    color: color || '#3B82F6',
  });
}


///// update new project
async function update(projectId, userId, payload) {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError(MESSAGES.PROJECT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  if (project.user.toString() !== userId.toString()) {
    throw new AppError(MESSAGES.NOT_AUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }

  const { name, description, color } = payload;
  if (name !== undefined) {
    const trimmed = trimString(name);
    if (!trimmed) throw new AppError(MESSAGES.PROJECT_NAME_REQUIRED, HTTP_STATUS.BAD_REQUEST);
    project.name = trimmed;
  }
  if (description !== undefined) project.description = trimString(description);
  if (color !== undefined) project.color = color;

  return project.save();
}


///// delete new project
async function remove(projectId, userId) {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError(MESSAGES.PROJECT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  if (project.user.toString() !== userId.toString()) {
    throw new AppError(MESSAGES.NOT_AUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }
  await Todo.updateMany({ project: project._id }, { $unset: { project: 1 } });
  await project.deleteOne();
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
