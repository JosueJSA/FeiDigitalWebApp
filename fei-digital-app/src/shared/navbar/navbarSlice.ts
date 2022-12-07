import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { LocalSession } from "../session";

export interface NavContext {
  id: string;
  name: string;
  type: string;
}

const initialState: NavContext = {
  id: LocalSession.getSession().id ? LocalSession.getSession().id : "",
  name: LocalSession.getSession().name ? LocalSession.getSession().name : "",
  type: LocalSession.getSession().type ? LocalSession.getSession().type : "",
};

export const navSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setStudentSession: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      state = Object.assign(state, { ...action.payload, type: "Estudiante" });
    },
    setAcademicSession: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      state = Object.assign(state, { ...action.payload, type: "Académico" });
    },
    cleanSession: (state) => {
      state = Object.assign(state, { id: "", name: "", type: "" });
    },
    setAcdemicName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setStudntName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

export const {
  setAcademicSession,
  setStudentSession,
  cleanSession,
  setAcdemicName,
  setStudntName,
} = navSlice.actions;
export const selectNavbar = (state: RootState) => state.navbar;
export default navSlice.reducer;
