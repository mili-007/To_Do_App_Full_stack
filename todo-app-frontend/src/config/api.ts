// API Configuration
// Uses environment variables for API base URL
// In Vite, environment variables must be prefixed with VITE_

const getApiBaseUrl = (): string => {
  // Check for VITE_API_URL first (for full URL)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback to constructing from VITE_API_BASE_URL and VITE_API_PORT
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost';
  const port = import.meta.env.VITE_API_PORT || '8003';
  const apiPath = import.meta.env.VITE_API_PATH || '/api';
  
  return `${baseUrl}:${port}${apiPath}`;
};

export const API_BASE_URL = getApiBaseUrl();

// Individual API endpoints
export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/auth`,
  TODOS: `${API_BASE_URL}/todos`,
  PROJECTS: `${API_BASE_URL}/projects`,
  CATEGORIES: `${API_BASE_URL}/categories`,
  COMMENTS: `${API_BASE_URL}/comments`,
} as const;

// Log API URL in development (helpful for debugging)
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
}

