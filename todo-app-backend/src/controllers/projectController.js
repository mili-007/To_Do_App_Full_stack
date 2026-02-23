const projectService = require('../services/projectService');
const apiResponse = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/errors');
const { HTTP_STATUS, MESSAGES } = require('../constants');

const getProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getAll(req.user._id);
  return apiResponse.success(res, projects);
});

const getProject = asyncHandler(async (req, res) => {
  const project = await projectService.getById(req.params.id, req.user._id);
  return apiResponse.success(res, project);
});

const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.create(req.user._id, req.body);
  return apiResponse.success(res, project, HTTP_STATUS.CREATED);
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.update(req.params.id, req.user._id, req.body);
  return apiResponse.success(res, project);
});

const deleteProject = asyncHandler(async (req, res) => {
  await projectService.remove(req.params.id, req.user._id);
  return apiResponse.success(res, { message: MESSAGES.PROJECT_REMOVED });
});

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
