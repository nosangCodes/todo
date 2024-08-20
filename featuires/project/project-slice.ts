import { Project } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: {
  projects: Array<Project>;
  loading: Boolean;
} = {
  projects: [],
  loading: false,
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

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    addNewProject: (state, action: PayloadAction<{ name: string }>) => {

    },
    clearProjects: (state) => {
      state.projects = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        const {
          data,
        }: {
          data: Array<Project>;
        } = action.payload;

        state.projects = data;
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.loading = false;
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
