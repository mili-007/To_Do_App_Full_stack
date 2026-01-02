import axiosInstance from '../../config/axios';
import type { User, LoginData, RegisterData } from '../../types';

// Use absolute URL - CORS is now properly configured on backend
// Match the port with your backend server (check your .env PORT)
const API_URL = 'http://localhost:8003/api/auth';

// Register user
const register = async (userData: RegisterData): Promise<User> => {
  const response = await axiosInstance.post<User>(`${API_URL}/register`, userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

// Login user
const login = async (userData: LoginData): Promise<User> => {
  const response = await axiosInstance.post<User>(`${API_URL}/login`, userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

// Logout user
const logout = (): void => {
  localStorage.removeItem('user');
};

// Get user profile
const getProfile = async (token: string): Promise<User> => {
  const response = await axiosInstance.get<User>(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getProfile
};

export default authService;

