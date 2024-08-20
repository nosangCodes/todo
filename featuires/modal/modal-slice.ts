import { AppDispatch } from "@/lib/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ModalType =
  | "addTask"
  | "editTask"
  | "addProject"
  | "inviteUser"
  | "projectMembers";

type ModalData = {
  projectId?: string;
};
interface ModalStore {
  isOpen: boolean;
  type: ModalType | null;
  data: ModalData;
}

const initialState: ModalStore = {
  isOpen: false,
  type: null,
  data: {},
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ type: ModalType; data?: ModalData }>
    ) => {
      const { type, data } = action.payload;
      state.type = type;
      if (data?.projectId) {
        state.data.projectId = data?.projectId;
      }
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
