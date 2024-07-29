import Tasks from "@/components/tasks";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: string;
  name: string;
  priority: "1" | "2" | "3" | "4";
  completed: boolean;
  duedate: string;
  projectId?: string;
}

const initialState: {
  tasks?: Array<Task>;
} = {
  tasks: [
    {
      id: "1",
      name: "Complete this",
      priority: "1",
      completed: false,
      duedate: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Start",
      priority: "2",
      completed: false,
      duedate: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Start",
      priority: "3",
      completed: false,
      duedate: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Start",
      priority: "4",
      completed: false,
      duedate: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Start",
      priority: "4",
      completed: true,
      duedate: new Date().toISOString(),
    },
  ],
};

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
  selectors: {
    completedTasks: (state) =>
      state.tasks?.filter((task) => {
        const today = new Date();
        const taskDate = new Date(task.duedate);
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
        const taskDate = new Date(task.duedate);
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
        const taskDate = new Date(task.duedate);
        today.setHours(0, 0, 0, 0);
        taskDate.setHours(0, 0, 0, 0);
        return !task.completed && taskDate < today;
      }),
    upcomingTasks: (state) =>
      state.tasks?.filter((task) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        return new Date(task.duedate) >= tomorrow;
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
