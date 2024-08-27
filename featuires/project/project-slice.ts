import { Project } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: {
  projects: Array<Project>;
  collabProjects: Array<Project>;
  loading?: "projects" | "collapProjects" | null;
} = {
  projects: [],
  collabProjects: [],
  loading: null,
};

export const fetchProjects = createAsyncThunk(
  "projects/fetch-all",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios("/api/project");
      return res;
    } catch (error) {
      return rejectWithValue(JSON.stringify(error));
    }
  }
);
export const fetchCollabProjects = createAsyncThunk(
  "collab-projects/fetch-all",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios("/api/project/collab-projects");
      if (res.status !== 200) {
        return rejectWithValue({ error: "Something went wrong!" });
      }
      return res.data;
    } catch (error) {
      return rejectWithValue(JSON.stringify(error));
    }
  }
);

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    addNewProject: (state, action: PayloadAction<{ name: string }>) => {},
    clearProjects: (state) => {
      state.projects = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = "projects";
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = null;
        const {
          data,
        }: {
          data: Array<Project>;
        } = action.payload;

        state.projects = data;
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.loading = null;
      })
      .addCase(fetchCollabProjects.pending, (state) => {
        state.loading = "collapProjects";
      })
      .addCase(
        fetchCollabProjects.fulfilled,
        (state, action: PayloadAction<Array<Project>>) => {
          state.loading = null;
          state.collabProjects = action.payload;
        }
      )
      .addCase(fetchCollabProjects.rejected, (state) => {
        state.loading = null;
      });
  },
  selectors: {
    projectExist: (state, action: PayloadAction<string>) => {
      const found = state.projects.some(
        (project) => project.name == action.payload
      );
      return found;
    },
  },
});

export const { addNewProject, clearProjects } = projectSlice.actions;
export const { projectExist } = projectSlice.selectors;
export default projectSlice.reducer;
