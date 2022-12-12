import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { ClassSession, Course } from "./interfaces";
import { SessionDetailed } from "./interfaces/session-detailed.interface";

export interface AcademicsScheduleContext {
  course: Course;
  coursesList: Course[];
  classSession: ClassSession;
  classSessionsList: ClassSession[];
  sessionDetailed: SessionDetailed;
  sessionsDetaied: SessionDetailed[];
}

const initialState: AcademicsScheduleContext = {
  course: { name: "", nrc: "", idAcademicPersonal: "" },
  classSession: {
    id: "",
    classDate: new Date().toISOString(),
    classDateEnd: new Date().toISOString(),
    initialTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    repeated: false,
    courseNrc: "",
    classroomCode: "",
    classroomName: "",
  },
  coursesList: [],
  classSessionsList: [],
  sessionDetailed: {
    id: "",
    classDate: new Date().toISOString(),
    initialTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    repeated: false,
    classDateEnd: new Date().toISOString(),
    updated: new Date().toISOString(),
    nrc: "",
    name: "",
    classroomCode: "",
    classroomName: "",
    building: "",
    classroomStatus: "",
    idClass: "",
    idAcademicPersonal: "",
  },
  sessionsDetaied: [],
};

export const academicsScheduleSlice = createSlice({
  name: "academicsScheduleSlice",
  initialState,
  reducers: {
    setCourse: (state, action: PayloadAction<Course | any>) => {
      state.course = Object.assign(state.course!, action.payload);
    },
    setCoursesList: (state, action: PayloadAction<Course[] | any>) => {
      state.coursesList = [...action.payload];
    },
    setClassSession: (state, action: PayloadAction<ClassSession | any>) => {
      state.classSession = Object.assign(state.classSession!, action.payload);
    },
    setClassSessionsList: (state, action: PayloadAction<ClassSession[]>) => {
      state.classSessionsList = [...action.payload];
    },
    setSessiosDetailed: (state, action: PayloadAction<SessionDetailed[]>) => {
      state.sessionsDetaied = [...action.payload];
    },
    setSessionDetailed: (state, action: PayloadAction<SessionDetailed>) => {
      state.sessionDetailed = Object.assign(
        state.sessionDetailed!,
        action.payload
      );
    },
    clearSessionDeailed: (state) => {
      state.sessionDetailed = Object.assign(state.sessionDetailed!, {
        id: "",
        classDate: new Date().toISOString(),
        initialTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        repeated: false,
        classDateEnd: new Date().toISOString(),
        updated: new Date().toISOString(),
        nrc: "",
        name: "",
        classroomCode: "",
        building: "",
        classroomStatus: "",
        idClass: "",
        idAcademicPersonal: "",
      });
    },
    setEmptyAcademicScheduleState: (state) => {
      state = initialState;
    },
  },
});

export const {
  setCourse,
  setCoursesList,
  setClassSession,
  setClassSessionsList,
  setSessiosDetailed,
  setSessionDetailed,
  clearSessionDeailed,
  setEmptyAcademicScheduleState,
} = academicsScheduleSlice.actions;
export const selectAcademicsSchedule = (state: RootState) =>
  state.academicsSchedule;
export default academicsScheduleSlice.reducer;
