import Tasks from "@/components/tasks";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface TaskState {
  tasks?: Array<Task>;
  today: Array<Task>;
  upcoming: Array<Task>;
  pastDueDate: Array<Task>;
  loading: Boolean;
  todaysTaskCount?: number;
  pastTasksCount?: number;
}

const initialState: TaskState = {
  tasks: [],
  today: [],
  loading: false,
  upcoming: [],
  pastDueDate: [],
  todaysTaskCount: 0,
  pastTasksCount: 0,
};

export const fetchTasks = createAsyncThunk(
  "task/fetch-all",
  async (
    { type }: { type: "today" | "upcoming" | "past" | string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(`/api/task?type=${type}`);
      if (res.status === 200) {
        return res.data;
      }
      return rejectWithValue({ message: "Something went wrong!" });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, "id">>) => {
      state.tasks?.push({
        ...action.payload,
        id: new Date().getTime().toString(),
      });
    },
    completeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks?.map((task) => {
        if (task.id === action.payload) {
          return {
            ...task,
            completed: true,
          };
        } else {
          return task;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchTasks.fulfilled,
        (
          state,
          action: PayloadAction<{
            today?: Array<Task>;
            todaysTaskCount?: number;
            pastTasksCount?: number;
            upcoming?: Array<Task>;
            pastDueDate?: Array<Task>;
          }>
        ) => {
          state.loading = false;
          state.today = action.payload?.today ?? [];
          state.upcoming = action.payload?.upcoming ?? [];
          state.pastDueDate = action.payload?.pastDueDate ?? [];
          state.todaysTaskCount = action.payload.todaysTaskCount
          state.pastTasksCount = action.payload.pastTasksCount
        }
      )
      .addCase(fetchTasks.rejected, (state) => {
        state.loading = false;
      });
  },
  selectors: {
    projectTasks: (state, action: PayloadAction<string>) => {
      return state.tasks?.filter((task) => task.projectId === action.payload);
    },
  },
});

export const { addTask, completeTask } = taskSlice.actions;
export const { projectTasks } = taskSlice.selectors;
export default taskSlice.reducer;
