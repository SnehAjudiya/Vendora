import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ProjectRow } from "../../components/MySite/pages/Projects/ProjectTable";
import {
  fetchProjectsApi,
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
  getProjectByIdApi,
} from "../../api/projectsApi";

interface ProjectsState {
  projects: ProjectRow[];
  loading: boolean;
  error: string | null;
  selectedProject: ProjectRow | any | null;
}

const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
  selectedProject: null,
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  fetchProjectsApi,
);

export const addProject = createAsyncThunk(
  "projects/addProject",
  createProjectApi,
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  updateProjectApi,
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  deleteProjectApi,
);

export const getProjectById = createAsyncThunk(
  "projects/getProjectById",
  getProjectByIdApi,
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action: PayloadAction<ProjectRow[]>) => {
          state.loading = false;
          state.projects = action.payload;
        },
      )
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch projects";
      })

      .addCase(addProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        addProject.fulfilled,
        (state, action: PayloadAction<ProjectRow>) => {
          state.loading = false;
          state.projects.unshift(action.payload);
        },
      )
      .addCase(addProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add Project";
      })

      .addCase(updateProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateProject.fulfilled,
        (state, action: PayloadAction<ProjectRow>) => {
          state.loading = false;
          let index = state.projects.findIndex(
            (p) => p.project_code === action.payload.project_code,
          );

          if (index !== -1) {
            state.projects[index] = action.payload;
          }
        },
      )
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update Project";
      })

      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(
          (p) => p.project_code !== action.payload,
        );
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete Project";
      })

      .addCase(getProjectById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProject = action.payload;
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch Project";
      });
  },
});

export default projectsSlice.reducer;
