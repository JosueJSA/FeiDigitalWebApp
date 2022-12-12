import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { setStudentSession } from "../../shared/navbar/navbarSlice";
import { LocalSession } from "../../shared/session";
import { Student } from "./interfaces/student.interface";
import {
  addStudent,
  getStudent,
  getStudents,
  loginStudent,
  updateStudent,
} from "./students.service";

export interface StudentContext {
  student: Student;
  studentList: Student[];
}

const initialState: StudentContext = {
  student: {
    id: "",
    email: "",
    password: "",
    name: "",
    status: "Disponible",
    updated: new Date().toISOString(),
  },
  studentList: [],
};

export const addStudentAsync = createAsyncThunk(
  "student/addStudentAsync",
  async (student: Student, thunkAPI) => {
    const response = await addStudent(student);
    if (response.id !== undefined) {
      setSession(response);
      thunkAPI.dispatch(
        setStudentSession({ id: response.id, name: response.name })
      );
    }
    return response;
  }
);

export const getStudentAsync = createAsyncThunk(
  "student/getStudentAsync",
  async (payload: { studentId: string; auth: string }, thunkAPI) => {
    const response = await getStudent(payload.studentId, payload.auth);
    if (response.id !== undefined) {
      thunkAPI.dispatch(setStudent(response));
    }
    return response;
  }
);

export const getStudentsAsync = createAsyncThunk(
  "student/getStudentsAsync",
  async (
    payload: { email?: string; name?: string; auth: string },
    thunkAPI
  ) => {
    const response = await getStudents(
      payload.auth,
      payload.email,
      payload.name
    );
    if (response.length !== undefined) {
      thunkAPI.dispatch(setStudentList(response));
    }
    return response;
  }
);

export const loginAsync = createAsyncThunk(
  "student/loginAsync",
  async (payload: { email: string; password: string }, thunkAPI) => {
    const response = await loginStudent(payload.email, payload.password);
    if (response.id !== undefined) {
      setSession(response);
      thunkAPI.dispatch(
        setStudentSession({ id: response.id, name: response.name })
      );
    }
    return response;
  }
);

const setSession = (event: any) => {
  LocalSession.setSession({
    id: event.id,
    name: event.name,
    token: event.access_token,
    type: "Estudiante",
  });
};

export const updateStudentAsync = createAsyncThunk(
  "student/updateStudentAsync",
  async (
    payload: { studentId: string; student: Student; auth: string },
    thunkAPI
  ) => {
    const response = await updateStudent(
      payload.studentId,
      payload.student,
      payload.auth
    );
    if (response.id !== undefined) {
      thunkAPI.dispatch(setStudent(response));
    }
    return response;
  }
);

export const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setStudent: (state, action: PayloadAction<Student | any>) => {
      state.student = Object.assign(state.student, action.payload);
    },
    setStudentList: (state, action: PayloadAction<Student[]>) => {
      state.studentList = [...action.payload];
    },
    setEmptyStudentState: (state) => {
      state.student = {
        id: "",
        email: "",
        password: "",
        name: "",
        status: "Disponible",
      };
      state.studentList = [];
    },
  },
});

export const { setStudent, setStudentList, setEmptyStudentState } =
  studentSlice.actions;
export const selectStudent = (state: RootState) => state.student.student;
export const selectStudentList = (state: RootState) =>
  state.student.studentList;
export default studentSlice.reducer;
