import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { runUnauthorizedHandler } from './unauthorizedHandler';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.token && config.headers) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch {
        console.log("ignore invalid stored user")
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    //// 401 for unauthorized or someone do change in local // 
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      runUnauthorizedHandler();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

