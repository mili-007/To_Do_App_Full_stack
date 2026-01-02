import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import todoService from './todoService';
import type { Todo, TodoState, TodoFormData } from '../../types';

const initialState: TodoState = {
  todos: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

// Get todos
export const getTodos = createAsyncThunk<
  Todo[],
  void,
  { rejectValue: string }
>(
  'todos/getAll',
  async (_, thunkAPI) => {
    try {
      return await todoService.getTodos();
    } catch (error) {
      const message = (
        error instanceof Error &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
      ) ? error.response.data.message : 
      (error instanceof Error ? error.message : String(error));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create todo
export const createTodo = createAsyncThunk<
  Todo,
  TodoFormData,
  { rejectValue: string }
>(
  'todos/create',
  async (todoData, thunkAPI) => {
    try {
      return await todoService.createTodo(todoData);
    } catch (error) {
      const message = (
        error instanceof Error &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
      ) ? error.response.data.message : 
      (error instanceof Error ? error.message : String(error));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update todo
interface UpdateTodoPayload {
  id: string;
  todoData: Partial<TodoFormData> & { 
    completed?: boolean;
    project?: string | null;
    categories?: string[];
    sharedWith?: string[];
  };
}

export const updateTodo = createAsyncThunk<
  Todo,
  UpdateTodoPayload,
  { rejectValue: string }
>(
  'todos/update',
  async ({ id, todoData }, thunkAPI) => {
    try {
      return await todoService.updateTodo(id, todoData);
    } catch (error) {
      const message = (
        error instanceof Error &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
      ) ? error.response.data.message : 
      (error instanceof Error ? error.message : String(error));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete todo
export const deleteTodo = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'todos/delete',
  async (id, thunkAPI) => {
    try {
      await todoService.deleteTodo(id);
      return id;
    } catch (error) {
      const message = (
        error instanceof Error &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
      ) ? error.response.data.message : 
      (error instanceof Error ? error.message : String(error));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTodos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todos = action.payload;
      })
      .addCase(getTodos.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to fetch todos';
      })
      .addCase(createTodo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todos.unshift(action.payload);
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to create todo';
      })
      .addCase(updateTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.isLoading = false;
        state.todos = state.todos.map((todo) =>
          todo._id === action.payload._id ? action.payload : todo
        );
      })
      .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
      });
  }
});

export const { reset } = todoSlice.actions;
export default todoSlice.reducer;

