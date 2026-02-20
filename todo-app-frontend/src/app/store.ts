import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import todoReducer from '../features/todos/todoSlice';
import projectReducer from '../features/projects/projectSlice';
import categoryReducer from '../features/categories/categorySlice';
import commentReducer from '../features/comments/commentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
    projects: projectReducer,
    categories: categoryReducer,
    comments: commentReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

