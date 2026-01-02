import axiosInstance from '../../config/axios';
import type { Todo, TodoFormData } from '../../types';

// Use absolute URL - CORS is now properly configured on backend
// Match the port with your backend server (check your .env PORT)
const API_URL = 'http://localhost:8003/api/todos';

// Get all todos
const getTodos = async (): Promise<Todo[]> => {
  const response = await axiosInstance.get<Todo[]>(API_URL);
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
const deleteTodo = async (todoId: string): Promise<void> => {
  await axiosInstance.delete(`${API_URL}/${todoId}`);
};

const todoService = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};

export default todoService;

