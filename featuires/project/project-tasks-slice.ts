import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: {
  projectTasks?: ProjectTaskRes | null;
  loading: Boolean;
} = {
  projectTasks: null,
  loading: true,
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
      return rejectWithValue({message: JSON.stringify(error)});
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
        console.error(JSON.stringify(action))
      });
  },
});

export const { clearProjectTasks } = projectTasks.actions;

export default projectTasks.reducer;
