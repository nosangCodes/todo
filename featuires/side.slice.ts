import { createSlice } from "@reduxjs/toolkit";

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
      if (state.isOpen) {
        state.width = "260px";
      } else {
        state.width = "50px";
      }
    },
  },
});

export const { toggleSideBar } = sideBarSlice.actions;
export default sideBarSlice.reducer;
