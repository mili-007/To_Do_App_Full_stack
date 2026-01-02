import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import categoryService from './categoryService';
import type { Category } from '../../types';

interface CategoryState {
  categories: Category[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: CategoryState = {
  categories: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

// Get categories
export const getCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>(
  'categories/getAll',
  async (_, thunkAPI) => {
    try {
      return await categoryService.getCategories();
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

// Create category
export const createCategory = createAsyncThunk<
  Category,
  { name: string; color?: string },
  { rejectValue: string }
>(
  'categories/create',
  async (categoryData, thunkAPI) => {
    try {
      return await categoryService.createCategory(categoryData);
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

// Update category
export const updateCategory = createAsyncThunk<
  Category,
  { id: string; categoryData: { name?: string; color?: string } },
  { rejectValue: string }
>(
  'categories/update',
  async ({ id, categoryData }, thunkAPI) => {
    try {
      return await categoryService.updateCategory(id, categoryData);
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

// Delete category
export const deleteCategory = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'categories/delete',
  async (id, thunkAPI) => {
    try {
      await categoryService.deleteCategory(id);
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

export const categorySlice = createSlice({
  name: 'categories',
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
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to fetch categories';
      })
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories.unshift(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.isLoading = false;
        state.categories = state.categories.map((category) =>
          category._id === action.payload._id ? action.payload : category
        );
      })
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = state.categories.filter((category) => category._id !== action.payload);
      });
  }
});

export const { reset } = categorySlice.actions;
export default categorySlice.reducer;

