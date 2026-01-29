export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Individual API endpoints
export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/auth`,
  TODOS: `${API_BASE_URL}/todos`,
  PROJECTS: `${API_BASE_URL}/projects`,
  CATEGORIES: `${API_BASE_URL}/categories`,
  COMMENTS: `${API_BASE_URL}/comments`,
} as const;

