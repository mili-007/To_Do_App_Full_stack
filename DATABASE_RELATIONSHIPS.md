# Database Relationships Documentation

This document explains the database relationships implemented in the To-Do App.

## Overview

The application now includes three types of database relationships:
1. **One-to-Many** (1:N)
2. **Many-to-One** (N:1)
3. **Many-to-Many** (N:M)

## Relationship Types Implemented

### 1. One-to-Many Relationships

#### Project → Todos
- **Relationship**: One Project has Many Todos
- **Implementation**: 
  - `Project` model has no direct reference to todos
  - `Todo` model has a `project` field that references `Project._id`
  - When a project is deleted, todos are updated to remove the project reference (not deleted)
- **Use Case**: Organize todos into projects (e.g., "Work", "Personal", "Shopping")

#### Todo → Comments
- **Relationship**: One Todo has Many Comments
- **Implementation**:
  - `Comment` model has a `todo` field that references `Todo._id`
  - When a todo is deleted, all associated comments are deleted (cascade delete)
- **Use Case**: Allow users to add comments/notes to todos for collaboration

#### User → Comments
- **Relationship**: One User has Many Comments
- **Implementation**:
  - `Comment` model has a `user` field that references `User._id`
- **Use Case**: Track which user created each comment

### 2. Many-to-One Relationships

These are the inverse of the One-to-Many relationships:

- **Todos → Project**: Many todos belong to one project
- **Comments → Todo**: Many comments belong to one todo
- **Comments → User**: Many comments belong to one user

### 3. Many-to-Many Relationships

#### Todos ↔ Categories
- **Relationship**: Many Todos can have Many Categories, and Many Categories can have Many Todos
- **Implementation**:
  - `Todo` model has a `categories` array field containing `Category._id` references
  - `Category` model has no direct reference to todos
  - When a category is deleted, it's removed from all todos' categories arrays
- **Use Case**: Tag todos with multiple categories (e.g., "urgent", "work", "home")

#### Users ↔ Todos (Sharing)
- **Relationship**: Many Users can share Many Todos
- **Implementation**:
  - `Todo` model has a `sharedWith` array field containing `User._id` references
  - Users can view and edit todos shared with them (but only owner can modify relationships)
- **Use Case**: Collaborate on todos by sharing them with other users

## Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  timestamps: true
}
```

### Project Model
```javascript
{
  name: String,
  description: String,
  user: ObjectId (ref: 'User'), // Owner
  color: String,
  timestamps: true
}
```

### Category Model
```javascript
{
  name: String (unique per user),
  color: String,
  user: ObjectId (ref: 'User'), // Owner
  timestamps: true
}
```

### Todo Model
```javascript
{
  user: ObjectId (ref: 'User'), // Owner
  title: String,
  description: String,
  completed: Boolean,
  priority: Enum ['low', 'medium', 'high'],
  dueDate: Date,
  project: ObjectId (ref: 'Project'), // Many-to-One
  categories: [ObjectId] (ref: 'Category'), // Many-to-Many
  sharedWith: [ObjectId] (ref: 'User'), // Many-to-Many
  timestamps: true
}
```

### Comment Model
```javascript
{
  content: String,
  todo: ObjectId (ref: 'Todo'), // Many-to-One
  user: ObjectId (ref: 'User'), // Many-to-One
  timestamps: true
}
```

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects for user
- `GET /api/projects/:id` - Get project with todos
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project (removes project reference from todos)

### Categories
- `GET /api/categories` - Get all categories for user
- `GET /api/categories/:id` - Get category with todos
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category (removes from todos)

### Comments
- `GET /api/todos/:todoId/comments` - Get all comments for a todo
- `POST /api/todos/:todoId/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Todos (Updated)
- `GET /api/todos` - Get all todos (including shared)
- `POST /api/todos` - Create todo (can include project, categories, sharedWith)
- `PUT /api/todos/:id` - Update todo (can modify relationships if owner)
- `DELETE /api/todos/:id` - Delete todo (only owner, cascades to comments)

## Access Control

- **Projects**: Only the owner can view, update, or delete
- **Categories**: Only the owner can view, update, or delete
- **Todos**: 
  - Owner can do everything
  - Shared users can view and update (but not modify relationships or delete)
- **Comments**: 
  - Anyone with access to the todo can create comments
  - Only the comment creator can update or delete their own comments

## Frontend Services

All relationships are accessible through TypeScript services:
- `projectService.ts` - Project operations
- `categoryService.ts` - Category operations
- `commentService.ts` - Comment operations
- `todoService.ts` - Updated to support relationships

## Example Usage

### Creating a Todo with Relationships
```typescript
const todo = await todoService.createTodo({
  title: "Complete project",
  description: "Finish the database relationships",
  priority: "high",
  dueDate: "2024-12-31",
  project: "project_id_here", // Many-to-One
  categories: ["category_id_1", "category_id_2"], // Many-to-Many
  sharedWith: ["user_id_1", "user_id_2"] // Many-to-Many
});
```

### Getting Todos with Populated Relationships
```typescript
const todos = await todoService.getTodos();
// Each todo will have:
// - project: { _id, name, color }
// - categories: [{ _id, name, color }, ...]
// - sharedWith: [{ _id, name, email }, ...]
// - user: { _id, name, email }
```

## Benefits

1. **Organization**: Projects help group related todos
2. **Flexibility**: Categories allow multiple tags per todo
3. **Collaboration**: Sharing enables team work on todos
4. **Communication**: Comments provide context and discussion
5. **Scalability**: Proper indexing ensures good performance

