import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  projects: Array<Project>;
} = {
  projects: [
    {
      id: "1",
      name: "Home",
    },
    {
      id: "2",
      name: "Office",
    },
  ],
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    addNewProject: (state, action: PayloadAction<{ name: string }>) => {
      const { name } = action.payload;
      const id = new Date().getTime().toString();
      state.projects.push({
        name,
        id,
      });
    },
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

export const { addNewProject } = projectSlice.actions;
export const { projectExist } = projectSlice.selectors;
export default projectSlice.reducer;
