import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import projectService from './projectService';
import type { Project } from '../../types';

interface ProjectState {
  projects: Project[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: ProjectState = {
  projects: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

// Get projects
export const getProjects = createAsyncThunk<
  Project[],
  void,
  { rejectValue: string }
>(
  'projects/getAll',
  async (_, thunkAPI) => {
    try {
      return await projectService.getProjects();
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

// Create project
export const createProject = createAsyncThunk<
  Project,
  { name: string; description?: string; color?: string },
  { rejectValue: string }
>(
  'projects/create',
  async (projectData, thunkAPI) => {
    try {
      return await projectService.createProject(projectData);
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

// Update project
export const updateProject = createAsyncThunk<
  Project,
  { id: string; projectData: { name?: string; description?: string; color?: string } },
  { rejectValue: string }
>(
  'projects/update',
  async ({ id, projectData }, thunkAPI) => {
    try {
      return await projectService.updateProject(id, projectData);
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

// Delete project
export const deleteProject = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'projects/delete',
  async (id, thunkAPI) => {
    try {
      await projectService.deleteProject(id);
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

export const projectSlice = createSlice({
  name: 'projects',
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
      .addCase(getProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.projects = action.payload;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to fetch projects';
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.projects.unshift(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.isLoading = false;
        state.projects = state.projects.map((project) =>
          project._id === action.payload._id ? action.payload : project
        );
      })
      .addCase(deleteProject.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.projects = state.projects.filter((project) => project._id !== action.payload);
      });
  }
});

export const { reset } = projectSlice.actions;
export default projectSlice.reducer;

