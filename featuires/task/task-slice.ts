import Tasks from "@/components/tasks";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: {
  tasks?: Array<Task>;
  loading: Boolean;
} = {
  tasks: [],
  loading: false,
};

export const fetchTasks = createAsyncThunk(
  "task/fetch-all",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/task");
      return res;
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
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        const {
          data,
        }: {
          data: Task[];
        } = action.payload;
        state.tasks = [...data];
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.loading = false;
      });
  },
  selectors: {
    completedTasks: (state) =>
      state.tasks?.filter((task) => {
        const today = new Date();
        const taskDate = new Date(task.dueDate);
        today.setHours(0, 0, 0, 0);
        taskDate.setHours(0, 0, 0, 0);

        return (
          task.completed &&
          taskDate.getDate() === today.getDate() &&
          taskDate.getFullYear() === today.getFullYear() &&
          taskDate.getMonth() === today.getMonth()
        );
      }),
    incompleteTasks: (state) =>
      state.tasks?.filter((task) => {
        const tomorrow = new Date();
        const taskDate = new Date(task.dueDate);
        const yesterday = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        yesterday.setDate(yesterday.getDate() - 1);

        yesterday.setHours(0, 0, 0, 0);
        tomorrow.setHours(0, 0, 0, 0);
        taskDate.setHours(0, 0, 0, 0);
        return !task.completed && taskDate < tomorrow && taskDate > yesterday;
      }),
    pastDueDate: (state) =>
      state.tasks?.filter((task) => {
        const today = new Date();
        const taskDate = new Date(task.dueDate);
        today.setHours(0, 0, 0, 0);
        taskDate.setHours(0, 0, 0, 0);
        return !task.completed && taskDate < today;
      }),
    upcomingTasks: (state) =>
      state.tasks?.filter((task) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        return new Date(task.dueDate) >= tomorrow;
      }),
    projectTasks: (state, action: PayloadAction<string>) => {
      return state.tasks?.filter((task) => task.projectId === action.payload);
    },
  },
});

export const { addTask, completeTask } = taskSlice.actions;
export const {
  completedTasks,
  incompleteTasks,
  pastDueDate,
  upcomingTasks,
  projectTasks,
} = taskSlice.selectors;
export default taskSlice.reducer;
