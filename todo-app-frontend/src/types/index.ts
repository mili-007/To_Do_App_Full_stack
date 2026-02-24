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

export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export interface Project {
  _id: string;
  name: string;
  description?: string;
  color: string;
  user: User;
  createdAt: string;
  updatedAt?: string;
  todos?: Todo[];
}

export interface ProjectFormData {
  name: string;
  description?: string;
  color?: string;
}

export interface ProjectFormProps {
  onSubmit: (projectData: { name: string; description?: string; color?: string }) => void;
  isLoading: boolean;
  embedded?: boolean;
}

export type ProjectFormValues = {
  name: string;
  description: string;
  color: string;
};

export interface Category {
  _id: string;
  name: string;
  color: string;
  user: string;
  createdAt: string;
  updatedAt?: string;
  todos?: Todo[];
}

export interface CategoryFormData {
  name: string;
  color?: string;
}

export interface CategoryFormProps {
  onSubmit: (categoryData: { name: string; color?: string }) => void;
  isLoading: boolean;
  embedded?: boolean;
}

export type CategoryFormValues = {
  name: string;
  color: string;
};

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

export interface CommentSectionProps {
  todoId: string;
}

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
  selectedTodo: Todo | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  getTodoOnId: string;
  filterProjectId: string | null;
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
export interface TodoDetailUpdatePayload {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed?: boolean;
  project?: string | null;
  categories?: string[];
}

export type TodoEditFormValues = {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completed?: boolean;
  project: string | null;
  categories: string[];
};

export interface TodoFormProps {
  initialTodo?: Todo | null;
  onCancel?: () => void;
  onSuccess?: () => void;
  embedded?: boolean;
}

export interface TodoDetailViewProps {
  todo: Todo;
  onUpdate: (todoData: TodoDetailUpdatePayload) => void;
  onDelete: () => void;
  onEdit?: () => void;
  // isOwner: boolean;
}

export interface TodoItemProps {
  todo: Todo;
  onView?: (todo: Todo) => void;
  onEdit?: (todo: Todo) => void;
}

