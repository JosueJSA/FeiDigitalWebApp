import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Academic } from "./interfaces/academic.interface";

export interface AcademicContext {
  academic: Academic;
  academicsList: Academic[];
}

const initialState: AcademicContext = {
  academic: {
    id: "",
    email: "",
    password: "",
    fullName: "",
    position: "",
    status: "",
    updated: new Date().toISOString(),
    feiLocationCode: "#E13",
  },
  academicsList: [],
};

export const academicSlice = createSlice({
  name: "academic",
  initialState,
  reducers: {
    setAcademic: (state, action: PayloadAction<Academic | any>) => {
      state.academic = Object.assign(state.academic, action.payload);
    },
    setAcademicsList: (state, action: PayloadAction<Academic[]>) => {
      state.academicsList = [...action.payload];
    },
    setEmptyAcademicState: (state) => {
      state.academic = {
        id: "",
        email: "",
        password: "",
        fullName: "",
        position: "",
        status: "",
        updated: new Date().toISOString(),
        feiLocationCode: "",
      };
      state.academicsList = [];
    },
  },
});

export const { setAcademic, setAcademicsList, setEmptyAcademicState } =
  academicSlice.actions;
export const selectAcademic = (state: RootState) => state.academic.academic;
export const selectAcademicsList = (state: RootState) =>
  state.academic.academicsList;
export default academicSlice.reducer;
