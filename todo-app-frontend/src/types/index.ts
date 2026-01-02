// User and Auth Types
export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface AuthState {
  user: User | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Project Types (One-to-Many with Todos)
export interface Project {
  _id: string;
  name: string;
  description?: string;
  color: string;
  user: User;
  createdAt: string;
  updatedAt?: string;
  todos?: Todo[]; // Populated when fetching project with todos
}

export interface ProjectFormData {
  name: string;
  description?: string;
  color?: string;
}

// Category Types (Many-to-Many with Todos)
export interface Category {
  _id: string;
  name: string;
  color: string;
  user: string;
  createdAt: string;
  updatedAt?: string;
  todos?: Todo[]; // Populated when fetching category with todos
}

export interface CategoryFormData {
  name: string;
  color?: string;
}

// Comment Types (One-to-Many with Todos and Users)
export interface Comment {
  _id: string;
  content: string;
  todo: string;
  user: User;
  createdAt: string;
  updatedAt?: string;
}

export interface CommentFormData {
  content: string;
}

// Todo Types
export interface Todo {
  _id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed: boolean;
  user: User | string;
  project?: Project | string | null;
  categories?: Category[] | string[];
  sharedWith?: User[] | string[];
  createdAt: string;
  updatedAt?: string;
}

export interface TodoState {
  todos: Todo[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

export interface TodoFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  project?: string | null;
  categories?: string[];
  sharedWith?: string[];
}

