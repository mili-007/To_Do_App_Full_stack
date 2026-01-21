import axiosInstance from '../../config/axios';
import { API_ENDPOINTS } from '../../config/api';
import type { Category, CategoryFormData } from '../../types';

const API_URL = API_ENDPOINTS.CATEGORIES;

// Get all categories
const getCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get<Category[]>(API_URL);
  return response.data;
};

// Get single category with todos
const getCategory = async (categoryId: string): Promise<Category> => {
  const response = await axiosInstance.get<Category>(`${API_URL}/${categoryId}`);
  return response.data;
};

// Create category
const createCategory = async (categoryData: CategoryFormData): Promise<Category> => {
  const response = await axiosInstance.post<Category>(API_URL, categoryData);
  return response.data;
};

// Update category
const updateCategory = async (categoryId: string, categoryData: Partial<CategoryFormData>): Promise<Category> => {
  const response = await axiosInstance.put<Category>(`${API_URL}/${categoryId}`, categoryData);
  return response.data;
};

// Delete category
const deleteCategory = async (categoryId: string): Promise<void> => {
  await axiosInstance.delete(`${API_URL}/${categoryId}`);
};

const categoryService = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};

export default categoryService;

