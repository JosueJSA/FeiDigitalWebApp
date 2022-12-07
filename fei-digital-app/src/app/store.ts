import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import studentReducer from "../pages/students/studentSlice";
import toastReducer from "../shared/toast/toastSlice";
import academicReducer from "../pages/academics/academicSlice";
import academicsScheduleReducer from "../pages/scheduling/academics-sessions/academicsScheduleSlice";
import studentsScheduleReducer from "../pages/scheduling/students-sessions/studentsScheduleSlice";
import navbarReducer from "../shared/navbar/navbarSlice";
import breadcrumbReducer from "../shared/breadcrumns/breadcrumbsSlice";

export const store = configureStore({
  reducer: {
    student: studentReducer,
    toast: toastReducer,
    academic: academicReducer,
    academicsSchedule: academicsScheduleReducer,
    studentsSchedule: studentsScheduleReducer,
    navbar: navbarReducer,
    breadcrumb: breadcrumbReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
