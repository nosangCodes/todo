import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

type MemberType = {
  name: string;
  id: string;
  email: string;
  creator: boolean;
};

interface MembersType {
  members: Array<MemberType>;
  loadingId?: string | null;
  loading: boolean;
}

const initialState: MembersType = {
  members: [],
  loadingId: null,
  loading: false,
};

export const fetchProjectMembers = createAsyncThunk(
  "fetch/project-members",
  async ({ projectId }: { projectId: string }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/project/${projectId}/members`);
      if (res.status === 200) {
        return res.data;
      }
      return rejectWithValue({ error: res.statusText });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const projectMembersSlice = createSlice({
  name: "projectMembers",
  initialState,
  reducers: {
    clearProjectMembers: (state) => {
      state.members = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProjectMembers.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(
        fetchProjectMembers.fulfilled,
        (state, action: PayloadAction<Array<MemberType>>) => {
          state.members = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchProjectMembers.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { clearProjectMembers } = projectMembersSlice.actions;
export default projectMembersSlice.reducer;
