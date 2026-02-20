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

/** Form values for Login form (react-hook-form). */
export type LoginFormValues = {
  email: string;
  password: string;
};

/** Form values for Register form (react-hook-form). */
export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

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

/** Props for ProjectForm component. */
export interface ProjectFormProps {
  onSubmit: (projectData: { name: string; description?: string; color?: string }) => void;
  isLoading: boolean;
  /** When true, render without card wrapper (e.g. inside a modal). */
  embedded?: boolean;
}

/** Form values for Project create form (react-hook-form). */
export type ProjectFormValues = {
  name: string;
  description: string;
  color: string;
};

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

/** Props for CategoryForm component. */
export interface CategoryFormProps {
  onSubmit: (categoryData: { name: string; color?: string }) => void;
  isLoading: boolean;
  /** When true, render without card wrapper (e.g. inside a modal). */
  embedded?: boolean;
}

/** Form values for Category create form (react-hook-form). */
export type CategoryFormValues = {
  name: string;
  color: string;
};

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

/** Props for CommentSection component. */
export interface CommentSectionProps {
  todoId: string;
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
  /** Todo currently loaded for the detail page (from getTodoById). */
  selectedTodo: Todo | null;
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

/** Payload for updating a todo (detail view / inline edit). */
export interface TodoDetailUpdatePayload {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed?: boolean;
  project?: string | null;
  categories?: string[];
}

/** Form values for todo edit forms (TodoDetailView, TodoItem) – react-hook-form. */
export type TodoEditFormValues = {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completed?: boolean;
  project: string | null;
  categories: string[];
};

/** Props for TodoForm component. */
export interface TodoFormProps {
  /** When set, form is in edit mode (prefill + update on submit). */
  initialTodo?: Todo | null;
  onCancel?: () => void;
  onSuccess?: () => void;
  /** When true, omit card wrapper and heading (e.g. inside a modal) */
  embedded?: boolean;
}

/** Props for TodoDetailView component. */
export interface TodoDetailViewProps {
  todo: Todo;
  onUpdate: (todoData: TodoDetailUpdatePayload) => void;
  onDelete: () => void;
  /** When set, Edit button opens parent's Add/Edit modal instead of inline edit */
  onEdit?: () => void;
  isOwner: boolean;
}

/** Props for TodoItem component. */
export interface TodoItemProps {
  todo: Todo;
  /** When set, View button opens this todo in parent's modal */
  onView?: (todo: Todo) => void;
  /** When set, Edit button opens parent's Add/Edit modal */
  onEdit?: (todo: Todo) => void;
}

