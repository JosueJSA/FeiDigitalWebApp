import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { Course, SessionDetailed } from "../academics-sessions/interfaces";
import { SessionStudentDetailed } from "./interfaces";

export interface StudentScheduleContext {
  course: Course;
  courses: Course[];
  sessionDetailed: SessionStudentDetailed;
  sessionsDetailed: SessionStudentDetailed[];
}

const initialState: StudentScheduleContext = {
  course: {
    nrc: "",
    name: "",
    idAcademicPersonal: "",
  },
  courses: [],
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
    idStudent: "",
  },
  sessionsDetailed: [],
};

export const studentsScheduleSlice = createSlice({
  name: "studentsScheduleSlice",
  initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = [...action.payload];
    },
    setSessionsStudentDetailed: (
      state,
      action: PayloadAction<SessionStudentDetailed[]>
    ) => {
      state.sessionsDetailed = [...action.payload];
    },
    setUpdateWithSession: (state, action: PayloadAction<SessionDetailed>) => {
      state.sessionsDetailed.forEach((session, index) => {
        if (session.id === action.payload.id) {
          if (action.payload.classroomStatus === "Libre") {
            state.sessionsDetailed[index].idClass = "";
            state.sessionsDetailed[index].classroomStatus = "Libre";
          } else {
            state.sessionsDetailed[index].idClass = action.payload.id;
            state.sessionsDetailed[index].classroomStatus = "Ocupado";
          }
        }
      });
    },
    setEmptyStudentScheduleState: (state) => {
      state = initialState;
    },
  },
});

export const {
  setCourses,
  setSessionsStudentDetailed,
  setUpdateWithSession,
  setEmptyStudentScheduleState,
} = studentsScheduleSlice.actions;
export const selectStudentsSchedule = (state: RootState) =>
  state.studentsSchedule;
export default studentsScheduleSlice.reducer;
