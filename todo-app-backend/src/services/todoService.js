const Todo = require('../models/Todo');
const Comment = require('../models/Comment');
const { AppError } = require('../utils/errors');
const { HTTP_STATUS, MESSAGES } = require('../constants');

const POPULATE_TODO = [
  { path: 'user', select: 'name email' },
  { path: 'project', select: 'name color' },
  { path: 'categories', select: 'name color' },
  { path: 'sharedWith', select: 'name email' },
];

function getStartOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function isDueDateInPast(dueDate) {
  if (dueDate == null || dueDate === '') return false;
  const d = dueDate instanceof Date ? dueDate : new Date(dueDate);
  if (Number.isNaN(d.getTime())) return false;
  const today = getStartOfToday();
  d.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
}

function hasAccess(todo, userId) {
  const ownerMatch = todo.user._id && todo.user._id.toString() === userId.toString();
  const sharedMatch = todo.sharedWith?.some(
    (u) => u._id && u._id.toString() === userId.toString()
  );
  return ownerMatch || sharedMatch;
}

function hasAccessByRefs(todo, userId) {
  const ownerMatch = todo.user && todo.user.toString() === userId.toString();
  const sharedMatch = todo.sharedWith?.some((id) => id.toString() === userId.toString());
  return ownerMatch || sharedMatch;
}

async function getById(todoId, userId) {
  const todo = await Todo.findById(todoId).populate(POPULATE_TODO);
  if (!todo) {
    throw new AppError(MESSAGES.TODO_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  if (!hasAccess(todo, userId)) {
    throw new AppError(MESSAGES.NOT_AUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }
  return todo;
}

async function getAll(userId, projectId) {
  const query = {
    $or: [{ user: userId }, { sharedWith: userId }],
  };
  if (projectId) {
    query.project = projectId;
  }
  return Todo.find(query)
    .populate(POPULATE_TODO)
    .sort('-createdAt');
}

async function create(userId, payload) {
  const { title, description, priority, dueDate, project, categories, sharedWith } = payload;
  const trimmedTitle = typeof title === 'string' ? title.trim() : '';
  if (!trimmedTitle) {
    throw new AppError(MESSAGES.TITLE_REQUIRED, HTTP_STATUS.BAD_REQUEST);
  }
  if (isDueDateInPast(dueDate)) {
    throw new AppError(MESSAGES.DUE_DATE_PAST, HTTP_STATUS.BAD_REQUEST);
  }

  const todo = await Todo.create({
    user: userId,
    title: trimmedTitle,
    description: description ?? '',
    priority: priority ?? 'medium',
    dueDate: dueDate || null,
    project: project || null,
    categories: categories || [],
    sharedWith: sharedWith || [],
  });
  await todo.populate(POPULATE_TODO);
  return todo;
}

async function update(todoId, userId, payload) {
  const todo = await Todo.findById(todoId);
  if (!todo) {
    throw new AppError(MESSAGES.TODO_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  if (!hasAccessByRefs(todo, userId)) {
    throw new AppError(MESSAGES.NOT_AUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }

  const isOwner = todo.user.toString() === userId.toString();
  const {
    title,
    description,
    completed,
    priority,
    dueDate,
    project,
    categories,
    sharedWith,
  } = payload;

  ////// restrict todo is completed
  if (todo.completed && completed === undefined) {
    throw new AppError('Cannot update a completed todo. Unmark it first.', HTTP_STATUS.BAD_REQUEST);
  }

  if (todo.completed && completed === true) {
    const otherFields = [title, description, priority, dueDate, project, categories, sharedWith];
    if (otherFields.some(f => f !== undefined)) {
      throw new AppError('Cannot update fields of a completed todo.', HTTP_STATUS.BAD_REQUEST);
    }
  }


  if (title !== undefined) {
    const trimmed = typeof title === 'string' ? title.trim() : '';
    if (!trimmed) throw new AppError(MESSAGES.TITLE_REQUIRED, HTTP_STATUS.BAD_REQUEST);
    todo.title = trimmed;
  }
  if (description !== undefined) todo.description = description;
  if (completed !== undefined) todo.completed = completed;
  if (priority !== undefined) todo.priority = priority;

  if (dueDate !== undefined) {
    const hasNewDate = dueDate !== null && dueDate !== '';
    if (hasNewDate && isDueDateInPast(dueDate)) {
      throw new AppError(MESSAGES.DUE_DATE_PAST, HTTP_STATUS.BAD_REQUEST);
    }
    todo.dueDate = hasNewDate ? dueDate : null;
  }

  if (isOwner) {
    if (project !== undefined) todo.project = project || null;
    if (categories !== undefined) todo.categories = categories || [];
    if (sharedWith !== undefined) todo.sharedWith = sharedWith || [];
  }

  await todo.save();
  await todo.populate(POPULATE_TODO);
  await todo.populate('user', 'name email');
  return todo;
}

async function remove(todoId, userId) {
  const todo = await Todo.findById(todoId);
  if (!todo) {
    throw new AppError(MESSAGES.TODO_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  if (todo.user.toString() !== userId.toString()) {
    throw new AppError(MESSAGES.NOT_AUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }
  await Comment.deleteMany({ todo: todo._id });
  await todo.deleteOne();
}

module.exports = {
  getById,
  getAll,
  create,
  update,
  remove,
};
