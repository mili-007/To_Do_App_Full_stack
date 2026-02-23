import axiosInstance from '../../config/axios';
import { API_ENDPOINTS } from '../../config/api';
import type { Todo, TodoFormData } from '../../types';

const API_URL = API_ENDPOINTS.TODOS;

// Get all todos
const getTodos = async (projectId?: string): Promise<Todo[]> => {
  const response = await axiosInstance.get<Todo[]>(API_URL, {
    params: projectId ? { project: projectId } : {}
  });
  return response.data;
};

// Get a single todo by ID
const getTodoById = async (todoId: string): Promise<Todo> => {
  const response = await axiosInstance.get<Todo>(`${API_URL}/${todoId}`);
  console.log(response.data, "++++++++")
  return response.data;
};

// Create todo
const createTodo = async (todoData: TodoFormData): Promise<Todo> => {
  const response = await axiosInstance.post<Todo>(API_URL, todoData);
  return response.data;
};

// Update todo
const updateTodo = async (todoId: string, todoData: Partial<TodoFormData> & { completed?: boolean; project?: string | null; categories?: string[]; sharedWith?: string[] }): Promise<Todo> => {
  const response = await axiosInstance.put<Todo>(`${API_URL}/${todoId}`, todoData);
  return response.data;
};

// Delete todo
const deleteTodo = async (todoId: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete<{ message: string }>(`${API_URL}/${todoId}`);
  return response.data;
};

const todoService = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
};

export default todoService;

