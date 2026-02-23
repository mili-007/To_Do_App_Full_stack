import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import todoService from './todoService';
import type { Todo, TodoState, TodoFormData } from '../../types';
import { getErrorMessage } from '../../utils/getErrorMessage';

const initialState: TodoState = {
  todos: [],
  selectedTodo: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  getTodoOnId: '',
  filterProjectId: null
};

// Get todos
export const getTodos = createAsyncThunk<
  Todo[],
  string | undefined,
  { rejectValue: string }
>(
  'todos/getAll',
  async (projectId, thunkAPI) => {
    try {
      return await todoService.getTodos(projectId);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// Get single todo by ID (for detail page; avoids scanning the list)
export const getTodoById = createAsyncThunk<
  Todo,
  string,
  { rejectValue: string }
>(
  'todos/getById',
  async (id, thunkAPI) => {
    try {
      return await todoService.getTodoById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
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
      return thunkAPI.rejectWithValue(getErrorMessage(error));
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
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// Delete todo
export const deleteTodo = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: string }
>(
  'todos/delete',
  async (id, thunkAPI) => {
    try {
      return await todoService.deleteTodo(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
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
    },
    clearSelectedTodo: (state) => {
      state.selectedTodo = null;
    },
    setFilterProjectId: (state, action: PayloadAction<string | null>) => {
      state.filterProjectId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTodos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        console.log(action?.payload, "******* to do all *****")
        state.isLoading = false;
        state.isSuccess = true;
        state.todos = action.payload;
      })
      .addCase(getTodos.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to fetch todos';
      })
      .addCase(getTodoById.pending, (state) => {
        state.isLoading = true;
        state.selectedTodo = null;
      })
      .addCase(getTodoById.fulfilled, (state, action: PayloadAction<Todo>) => {
        console.log(action.payload, "action.payload")
        state.isLoading = false;
        state.selectedTodo = action.payload;
      })
      .addCase(getTodoById.rejected, (state, action) => {
        state.isLoading = false;
        state.selectedTodo = null;
        state.isError = true;
        state.message = action.payload || 'Failed to fetch todo';
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
        state.todos = state.todos?.map((todo) =>
          todo._id === action.payload._id ? action.payload : todo
        );
        if (state.selectedTodo?._id === action.payload._id) {
          state.selectedTodo = action.payload;
        }
      })
      .addCase(deleteTodo.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to delete todo';
      })
  }
});

export const { reset, clearSelectedTodo, setFilterProjectId } = todoSlice.actions;
export default todoSlice.reducer;

