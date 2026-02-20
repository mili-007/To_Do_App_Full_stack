import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Create axios instance
const axiosInstance = axios.create();

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStr = localStorage.getItem('user');
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.token && config.headers) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch {
        // Invalid JSON, continue without token
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      // window.dispatchEvent(new CustomEvent('auth:logout', { 
      //   detail: { reason: 'token_expired' } 
      // }));
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;

