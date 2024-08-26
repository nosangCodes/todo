import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SideBarState {
  isOpen: boolean;
  width: string;
}

const initialState: SideBarState = {
  isOpen: true,
  width: "260px",
};

export const sideBarSlice = createSlice({
  name: "sideBar",
  initialState,
  reducers: {
    toggleSideBar: (state) => {
      state.isOpen = !state.isOpen;
      window.localStorage.setItem("tasks-sidebar-state", String(state.isOpen));
      if (state.isOpen) {
        state.width = "260px";
      } else {
        state.width = "50px";
      }
    },
    setSideBarState: (state, action: PayloadAction<{ isOpen: boolean }>) => {
      state.isOpen = action.payload.isOpen;
      window.localStorage.setItem("tasks-sidebar-state", String(state.isOpen));
      if (state.isOpen) {
        state.width = "260px";
      } else {
        state.width = "50px";
      }
    },
  },
});

export const { toggleSideBar, setSideBarState } = sideBarSlice.actions;
export default sideBarSlice.reducer;
