import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/featuires/counter/counter-slice";
import modalReducer from "@/featuires/modal/modal-slice";
import taskReducer from "@/featuires/task/task-slice";
import projectReducer from "@/featuires/project/project-slice";
import projectTasksReducer from "@/featuires/project/project-tasks-slice";
import projectMembersReducer from "@/featuires/project/project-members.slice"
import sidebarReducer from "@/featuires/side.slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      modal: modalReducer,
      task: taskReducer,
      project: projectReducer,
      projectTasks: projectTasksReducer,
      projectMembers: projectMembersReducer,
      sideBar: sidebarReducer
   },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
