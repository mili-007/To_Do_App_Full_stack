import axiosInstance from '../../config/axios';
import type { Project, ProjectFormData } from '../../types';

const API_URL = 'http://localhost:8003/api/projects';

// Get all projects
const getProjects = async (): Promise<Project[]> => {
  const response = await axiosInstance.get<Project[]>(API_URL);
  return response.data;
};

// Get single project with todos
const getProject = async (projectId: string): Promise<Project> => {
  const response = await axiosInstance.get<Project>(`${API_URL}/${projectId}`);
  return response.data;
};

// Create project
const createProject = async (projectData: ProjectFormData): Promise<Project> => {
  const response = await axiosInstance.post<Project>(API_URL, projectData);
  return response.data;
};

// Update project
const updateProject = async (projectId: string, projectData: Partial<ProjectFormData>): Promise<Project> => {
  const response = await axiosInstance.put<Project>(`${API_URL}/${projectId}`, projectData);
  return response.data;
};

// Delete project
const deleteProject = async (projectId: string): Promise<void> => {
  await axiosInstance.delete(`${API_URL}/${projectId}`);
};

const projectService = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};

export default projectService;

