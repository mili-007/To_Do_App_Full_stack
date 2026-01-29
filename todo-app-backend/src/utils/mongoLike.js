/**
 * Helpers to keep existing API response shapes.
 * Frontend expects Mongo-style `_id` fields.
 */

const renameIdToUnderscoreId = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  // eslint-disable-next-line no-unused-vars
  const { id, ...rest } = obj;
  if (!id) return obj;
  return { _id: id, ...rest };
};

const mapArray = (arr, mapper) => (Array.isArray(arr) ? arr.map(mapper) : arr);

const toMongoLikeUser = (user) => {
  if (!user) return user;
  return renameIdToUnderscoreId(user);
};

const toMongoLikeProject = (project) => {
  if (!project) return project;
  return renameIdToUnderscoreId(project);
};

const toMongoLikeCategory = (category) => {
  if (!category) return category;
  return renameIdToUnderscoreId(category);
};

const toMongoLikeComment = (comment) => {
  if (!comment) return comment;
  const mapped = renameIdToUnderscoreId(comment);
  if (mapped.user && typeof mapped.user === 'object') {
    mapped.user = toMongoLikeUser(mapped.user);
  }
  return mapped;
};

const toMongoLikeTodo = (todo) => {
  if (!todo) return todo;
  const mapped = renameIdToUnderscoreId(todo);

  if (mapped.user && typeof mapped.user === 'object') {
    mapped.user = toMongoLikeUser(mapped.user);
  }

  if (mapped.project && typeof mapped.project === 'object') {
    mapped.project = toMongoLikeProject(mapped.project);
  }

  if (Array.isArray(mapped.categories)) {
    mapped.categories = mapArray(mapped.categories, (c) => (typeof c === 'object' ? toMongoLikeCategory(c) : c));
  }

  if (Array.isArray(mapped.sharedWith)) {
    mapped.sharedWith = mapArray(mapped.sharedWith, (u) => (typeof u === 'object' ? toMongoLikeUser(u) : u));
  }

  if (Array.isArray(mapped.comments)) {
    mapped.comments = mapArray(mapped.comments, toMongoLikeComment);
  }

  return mapped;
};

module.exports = {
  toMongoLikeUser,
  toMongoLikeProject,
  toMongoLikeCategory,
  toMongoLikeTodo,
  toMongoLikeComment,
};

