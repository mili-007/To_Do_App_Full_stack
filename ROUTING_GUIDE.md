# Frontend Routing Guide

This document explains the route-based structure of the To-Do App frontend.

## Route Structure

The application now uses a route-based architecture with the following pages:

### Public Routes
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Require Authentication)
All protected routes are wrapped with `PrivateRoute` and `Layout` components:

- `/dashboard` - Main todos page
- `/projects` - Projects management page
- `/categories` - Categories management page
- `/todos/:id` - Individual todo detail page with comments

## Layout Component

The `Layout` component (`src/components/layout/Layout.tsx`) provides:
- Consistent navigation bar across all pages
- User profile display
- Logout functionality
- Active route highlighting

### Navigation Links
- **Todos** - Links to `/dashboard`
- **Projects** - Links to `/projects`
- **Categories** - Links to `/categories`

## Page Components

### 1. Dashboard (`/dashboard`)
**File**: `src/pages/Dashboard.tsx`

**Features**:
- Todo creation form (left sidebar)
- Todo list view (main area)
- Automatically loads projects and categories for form

**Layout**: 2-column grid (1/3 form, 2/3 list)

### 2. Projects Page (`/projects`)
**File**: `src/pages/ProjectsPage.tsx`

**Features**:
- Create new projects
- View all projects in a grid
- Delete projects
- Link to filter todos by project

**Layout**: 2-column grid (1/3 form, 2/3 list)

**Components Used**:
- `ProjectForm` - Create project form
- `ProjectList` - Display projects grid

### 3. Categories Page (`/categories`)
**File**: `src/pages/CategoriesPage.tsx`

**Features**:
- Create new categories
- View all categories in a grid
- Delete categories
- Color customization

**Layout**: 2-column grid (1/3 form, 2/3 list)

**Components Used**:
- `CategoryForm` - Create category form
- `CategoryList` - Display categories grid

### 4. Todo Detail Page (`/todos/:id`)
**File**: `src/pages/TodoDetailPage.tsx`

**Features**:
- View full todo details
- Edit todo (owner only)
- Delete todo (owner only)
- View and add comments
- Quick info sidebar

**Layout**: 2-column grid (2/3 details, 1/3 info)

**Components Used**:
- `TodoDetailView` - Main todo display/edit
- `CommentSection` - Comments functionality

## Navigation Flow

```
Dashboard (/dashboard)
  ├─ Create Todo
  ├─ View Todos List
  └─ Click "View Details" → Todo Detail (/todos/:id)

Projects (/projects)
  ├─ Create Project
  ├─ View Projects
  └─ Click "View Todos" → Dashboard (filtered by project)

Categories (/categories)
  ├─ Create Category
  └─ View Categories

Todo Detail (/todos/:id)
  ├─ View/Edit Todo
  ├─ Add Comments
  └─ Back to Dashboard
```

## Component Structure

### Layout Components
```
src/components/layout/
  └─ Layout.tsx - Main layout with navigation
```

### Page Components
```
src/pages/
  ├─ Dashboard.tsx
  ├─ ProjectsPage.tsx
  ├─ CategoriesPage.tsx
  └─ TodoDetailPage.tsx
```

### Feature Components
```
src/components/
  ├─ projects/
  │   ├─ ProjectForm.tsx
  │   └─ ProjectList.tsx
  ├─ categories/
  │   ├─ CategoryForm.tsx
  │   └─ CategoryList.tsx
  ├─ todos/
  │   ├─ TodoForm.tsx
  │   ├─ TodoList.tsx
  │   ├─ TodoItem.tsx
  │   └─ TodoDetailView.tsx
  └─ comments/
      └─ CommentSection.tsx
```

## Route Protection

All protected routes use the `PrivateRoute` component which:
- Checks if user is authenticated
- Redirects to `/login` if not authenticated
- Wraps content with `Layout` component

## URL Parameters

- `/todos/:id` - `id` parameter is the todo ID
  - Example: `/todos/507f1f77bcf86cd799439011`

## Navigation Examples

### Programmatic Navigation
```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/projects');
navigate(`/todos/${todoId}`);
```

### Link Components
```tsx
import { Link } from 'react-router-dom';

<Link to="/projects">View Projects</Link>
<Link to={`/todos/${todo._id}`}>View Details</Link>
```

## Benefits of Route-Based Structure

1. **Better Organization**: Each feature has its own page
2. **URL Sharing**: Users can share links to specific pages/todos
3. **Browser Navigation**: Back/forward buttons work correctly
4. **SEO Friendly**: Each page has its own URL
5. **Cleaner Code**: Separation of concerns
6. **Scalability**: Easy to add new pages/routes

## Future Enhancements

Potential routes to add:
- `/projects/:id` - Individual project view with todos
- `/categories/:id` - Individual category view with todos
- `/settings` - User settings page
- `/shared` - Shared todos page
- `/search` - Search todos page

