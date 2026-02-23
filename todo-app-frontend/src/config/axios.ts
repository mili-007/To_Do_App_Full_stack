import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
// import { toast } from '../utils/toast';
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
        // ignore invalid stored user
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      // const message =
      //   error.response?.data?.message ?? 'Session expired. Please log in again.';
      // toast.error(message);
      localStorage.removeItem('user');
      runUnauthorizedHandler();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

