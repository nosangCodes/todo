import { AppDispatch } from "@/lib/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ModalType = "addTask" | "editTask" | "addProject";

interface ModalStore {
  isOpen: boolean;
  type: ModalType | null;
}

const initialState: ModalStore = {
  isOpen: false,
  type: null,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ModalType>) => {
      state.type = action.payload;
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.type = null;
      state.isOpen = false;
    },
  },
});

export const { closeModal, openModal } = modalSlice.actions;
export default modalSlice.reducer;
