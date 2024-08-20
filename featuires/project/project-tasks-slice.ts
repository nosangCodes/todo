import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const initialState: {
  projectTasks?: ProjectTaskRes | null;
  loading: Boolean;
  error: string;
} = {
  projectTasks: null,
  loading: true,
  error: "",
};

export const fetchProjectTasks = createAsyncThunk(
  "project-tasks/fetch",
  async (
    { projectId, signal }: { projectId: string; signal?: AbortSignal },
    { rejectWithValue }
  ) => {
    try {
      const res: { data: ProjectTaskRes } = await axios.get(
        `/api/task/${projectId}`,
        {
          signal,
        }
      );
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.error);
      }
      console.error("ERROR FETCHING PROJECT TASKS", error);
      return rejectWithValue("Something went wrong!");
    }
  }
);

export const projectTasks = createSlice({
  name: "project-tasks",
  initialState,
  reducers: {
    clearProjectTasks: (state) => {
      state.projectTasks = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.projectTasks = action.payload;
      })
      .addCase(fetchProjectTasks.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearProjectTasks } = projectTasks.actions;

export default projectTasks.reducer;
