# Frontend Integration Guide

This guide explains how the database relationships are integrated into the frontend.

## Overview

The frontend now supports:
- **Projects** (One-to-Many with Todos)
- **Categories** (Many-to-Many with Todos)
- **Comments** (One-to-Many with Todos)
- **Todo Sharing** (Many-to-Many with Users)

## Redux Store Structure

The Redux store now includes:
```typescript
{
  auth: AuthState,
  todos: TodoState,
  projects: ProjectState,
  categories: CategoryState,
  comments: CommentState
}
```

## Components

### 1. TodoForm Component
**Location**: `src/components/todos/TodoForm.tsx`

**New Features**:
- Project selection dropdown
- Category selection (multi-select with colored badges)
- Automatically fetches projects and categories on mount

**Usage**:
```tsx
<TodoForm />
```

### 2. TodoItem Component
**Location**: `src/components/todos/TodoItem.tsx`

**New Features**:
- Displays project badge (if assigned)
- Shows category badges (if any)
- Shows sharing indicator
- Includes comment section
- Edit mode supports project and category selection (owner only)

**Display**:
- Project badge with custom color
- Category badges with custom colors
- Shared users count
- Comment section with add/view/delete functionality

### 3. CommentSection Component
**Location**: `src/components/comments/CommentSection.tsx`

**Features**:
- Collapsible comment section
- Add new comments
- View all comments for a todo
- Delete own comments
- Shows comment author and timestamp

**Usage**:
```tsx
<CommentSection todoId={todo._id} />
```

### 4. ProjectManager Component
**Location**: `src/components/projects/ProjectManager.tsx`

**Features**:
- List all projects
- Create new projects with name, description, and color
- Delete projects (removes from todos automatically)

**Usage**:
```tsx
<ProjectManager />
```

### 5. CategoryManager Component
**Location**: `src/components/categories/CategoryManager.tsx`

**Features**:
- List all categories
- Create new categories with name and color
- Delete categories (removes from todos automatically)

**Usage**:
```tsx
<CategoryManager />
```

## Dashboard Layout

The Dashboard now has a 4-column layout:
- **Left Column (1/4)**: TodoForm, ProjectManager, CategoryManager
- **Right Column (3/4)**: TodoList

## Redux Actions

### Projects
```typescript
import { getProjects, createProject, updateProject, deleteProject } from '../features/projects/projectSlice';

// Get all projects
dispatch(getProjects());

// Create project
dispatch(createProject({ name: 'Work', description: 'Work tasks', color: '#3B82F6' }));

// Update project
dispatch(updateProject({ id: 'project_id', projectData: { name: 'Updated Name' } }));

// Delete project
dispatch(deleteProject('project_id'));
```

### Categories
```typescript
import { getCategories, createCategory, updateCategory, deleteCategory } from '../features/categories/categorySlice';

// Get all categories
dispatch(getCategories());

// Create category
dispatch(createCategory({ name: 'Urgent', color: '#EF4444' }));

// Update category
dispatch(updateCategory({ id: 'category_id', categoryData: { name: 'Updated Name' } }));

// Delete category
dispatch(deleteCategory('category_id'));
```

### Comments
```typescript
import { getComments, createComment, updateComment, deleteComment } from '../features/comments/commentSlice';

// Get comments for a todo
dispatch(getComments('todo_id'));

// Create comment
dispatch(createComment({ todoId: 'todo_id', content: 'This is a comment' }));

// Update comment
dispatch(updateComment({ id: 'comment_id', content: 'Updated comment' }));

// Delete comment
dispatch(deleteComment({ todoId: 'todo_id', commentId: 'comment_id' }));
```

### Todos (Updated)
```typescript
import { createTodo, updateTodo } from '../features/todos/todoSlice';

// Create todo with relationships
dispatch(createTodo({
  title: 'New Todo',
  description: 'Description',
  priority: 'high',
  dueDate: '2024-12-31',
  project: 'project_id', // Optional
  categories: ['category_id_1', 'category_id_2'], // Optional
  sharedWith: [] // Optional (for future implementation)
}));

// Update todo with relationships
dispatch(updateTodo({
  id: 'todo_id',
  todoData: {
    project: 'new_project_id',
    categories: ['category_id_1', 'category_id_2']
  }
}));
```

## Data Flow

1. **On Dashboard Load**:
   - Projects and Categories are fetched automatically
   - Todos are fetched with populated relationships

2. **Creating a Todo**:
   - User fills form with optional project and categories
   - Todo is created with relationships
   - Redux store is updated

3. **Viewing Todos**:
   - Todos display with project badges, category badges, and sharing info
   - Comments can be viewed/added per todo

4. **Editing a Todo**:
   - Owner can modify project and categories
   - Shared users can only edit basic fields

## TypeScript Types

All types are defined in `src/types/index.ts`:

```typescript
interface Todo {
  _id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed: boolean;
  user: User | string;
  project?: Project | string | null; // Many-to-One
  categories?: Category[] | string[]; // Many-to-Many
  sharedWith?: User[] | string[]; // Many-to-Many
  createdAt: string;
  updatedAt?: string;
}

interface Project {
  _id: string;
  name: string;
  description?: string;
  color: string;
  user: User;
  createdAt: string;
  updatedAt?: string;
}

interface Category {
  _id: string;
  name: string;
  color: string;
  user: string;
  createdAt: string;
  updatedAt?: string;
}

interface Comment {
  _id: string;
  content: string;
  todo: string;
  user: User;
  createdAt: string;
  updatedAt?: string;
}
```

## API Configuration

Make sure the API URLs in the service files match your backend:

- `todoService.ts`: `http://localhost:8003/api/todos`
- `projectService.ts`: `http://localhost:8003/api/projects`
- `categoryService.ts`: `http://localhost:8003/api/categories`
- `commentService.ts`: `http://localhost:8003/api`

Update these if your backend runs on a different port.

## Features Summary

✅ **Projects**: Organize todos into projects with custom colors
✅ **Categories**: Tag todos with multiple categories
✅ **Comments**: Add comments to todos for collaboration
✅ **Sharing**: Display shared todos (UI ready, backend implemented)
✅ **Access Control**: Owners vs shared users have different permissions

## Next Steps (Optional Enhancements)

1. **User Search for Sharing**: Add a user search/select component for sharing todos
2. **Project/Category Filtering**: Filter todos by project or category
3. **Bulk Operations**: Select multiple todos to assign project/categories
4. **Notifications**: Notify users when todos are shared with them
5. **Activity Feed**: Show recent comments and updates

