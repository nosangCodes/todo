import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: {
  projectTasks?: ProjectTaskRes;
  loading: Boolean;
} = {
  projectTasks: undefined,
  loading: false,
};

export const fetchProjectTasks = createAsyncThunk(
  "project-tasks/fetch",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const res: { data: ProjectTaskRes } = await axios.get(
        `/api/task/${projectId}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const projectTasks = createSlice({
  name: "project-tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.projectTasks = action.payload;
      })
      .addCase(fetchProjectTasks.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default projectTasks.reducer;
