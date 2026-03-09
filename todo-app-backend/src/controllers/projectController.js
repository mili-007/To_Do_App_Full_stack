const projectService = require('../services/projectService');
const apiResponse = require('../utils/apiResponse');
const { HTTP_STATUS, MESSAGES } = require('../constants');

const getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getAll(req.user._id);
    return apiResponse.success(res, projects);
  } catch (error) {
    next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await projectService.getById(req.params.id, req.user._id);
    return apiResponse.success(res, project);
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const project = await projectService.create(req.user._id, req.body);
    return apiResponse.success(res, project, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.update(req.params.id, req.user._id, req.body);
    return apiResponse.success(res, project);
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    await projectService.remove(req.params.id, req.user._id);
    return apiResponse.success(res, { message: MESSAGES.PROJECT_REMOVED });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
