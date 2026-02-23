import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import projectService from './projectService';
import type { Project } from '../../types';
import { getErrorMessage } from '../../utils/getErrorMessage';

interface ProjectState {
  projects: Project[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  selectedProject: Project | null;
}

const initialState: ProjectState = {
  projects: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  selectedProject: null
};

// Get single project
export const getProject = createAsyncThunk<
  Project,
  string,
  { rejectValue: string }
>(
  'projects/getOne',
  async (id, thunkAPI) => {
    try {
      return await projectService.getProject(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

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
      return thunkAPI.rejectWithValue(getErrorMessage(error));
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
      return thunkAPI.rejectWithValue(getErrorMessage(error));
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
      return thunkAPI.rejectWithValue(getErrorMessage(error));
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
      return await projectService.deleteProject(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
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
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null;
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
      })
      .addCase(getProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.isLoading = false;
        state.selectedProject = action.payload;
      });
  }
});

export const { reset, clearSelectedProject } = projectSlice.actions;
export default projectSlice.reducer;

