import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import commentService from './commentService';
import type { Comment } from '../../types';

interface CommentState {
  comments: Record<string, Comment[]>; // Keyed by todoId
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: CommentState = {
  comments: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

// Get comments for a todo
export const getComments = createAsyncThunk<
  { todoId: string; comments: Comment[] },
  string,
  { rejectValue: string }
>(
  'comments/getAll',
  async (todoId, thunkAPI) => {
    try {
      const comments = await commentService.getComments(todoId);
      return { todoId, comments };
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

// Create comment
export const createComment = createAsyncThunk<
  { todoId: string; comment: Comment },
  { todoId: string; content: string },
  { rejectValue: string }
>(
  'comments/create',
  async ({ todoId, content }, thunkAPI) => {
    try {
      const comment = await commentService.createComment(todoId, { content });
      return { todoId, comment };
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

// Update comment
export const updateComment = createAsyncThunk<
  Comment,
  { id: string; content: string },
  { rejectValue: string }
>(
  'comments/update',
  async ({ id, content }, thunkAPI) => {
    try {
      return await commentService.updateComment(id, { content });
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

// Delete comment
export const deleteComment = createAsyncThunk<
  { todoId: string; commentId: string },
  { todoId: string; commentId: string },
  { rejectValue: string }
>(
  'comments/delete',
  async ({ todoId, commentId }, thunkAPI) => {
    try {
      await commentService.deleteComment(commentId);
      return { todoId, commentId };
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

export const commentSlice = createSlice({
  name: 'comments',
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
      .addCase(getComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getComments.fulfilled, (state, action: PayloadAction<{ todoId: string; comments: Comment[] }>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments[action.payload.todoId] = action.payload.comments;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to fetch comments';
      })
      .addCase(createComment.fulfilled, (state, action: PayloadAction<{ todoId: string; comment: Comment }>) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (!state.comments[action.payload.todoId]) {
          state.comments[action.payload.todoId] = [];
        }
        state.comments[action.payload.todoId].push(action.payload.comment);
      })
      .addCase(updateComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.isLoading = false;
        // Find and update comment in all todos
        Object.keys(state.comments).forEach(todoId => {
          state.comments[todoId] = state.comments[todoId].map(comment =>
            comment._id === action.payload._id ? action.payload : comment
          );
        });
      })
      .addCase(deleteComment.fulfilled, (state, action: PayloadAction<{ todoId: string; commentId: string }>) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (state.comments[action.payload.todoId]) {
          state.comments[action.payload.todoId] = state.comments[action.payload.todoId].filter(
            comment => comment._id !== action.payload.commentId
          );
        }
      });
  }
});

export const { reset } = commentSlice.actions;
export default commentSlice.reducer;

