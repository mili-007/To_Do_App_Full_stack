import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
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

// Typed hooks for use throughout the app
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

