import {
  Alert,
  AlertTitle,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { Fragment, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addPage } from "../../../shared/breadcrumns/breadcrumbsSlice";
import { Toaster } from "../../../shared/toast/toaster.component";
import {
  showToastError,
  showToastSuccess,
} from "../../../shared/toast/toastSlice";
import { CourseStudentCard } from "./components/course-student-card.component";
import { CoursesSearchBar } from "./components/courses-search-bar.component";
import {
  errorCourseEvent,
  followCourseEvent,
  searchCoursesEvent,
} from "./constants";
import { StudentSessionsSocket } from "./student-sessions-socket.manager";
import { selectStudentsSchedule, setCourses } from "./studentsScheduleSlice";

export function CoursesSearching() {
  const courses = useAppSelector(selectStudentsSchedule).courses;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      dispatch(addPage({ name: "Cursos", url: location.pathname }));
      const socket = StudentSessionsSocket.getCourseInstanceWithToken();
      socket.on(searchCoursesEvent, searchCoursesListener);
      socket.on(followCourseEvent, followCourseListener);
      socket.on(errorCourseEvent, errorListener);
      return () => {
        socket.off(searchCoursesEvent);
        socket.off(followCourseEvent);
        socket.off(errorCourseEvent);
      };
    } catch (error) {
      containError();
    }
  });

  const containError = () => {
    dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
    navigate("/home", { replace: true });
  };

  const followCourseListener = (event: any) => {
    dispatch(showToastSuccess("Curso agregado a lista de seguidos"));
    navigate("/students/courses/following/", { replace: true });
  };

  const searchCoursesListener = (event: any) => {
    dispatch(setCourses(event));
  };

  const errorListener = (event: any) => {
    const error: Array<string> = event.error;
    if (error.indexOf("No autorizado") >= 0) {
      navigate("/login", { replace: true });
      dispatch(showToastError({ content: ["Tu sesión ha expirado"] }));
    } else {
      dispatch(showToastError({ content: error }));
    }
  };

  return (
    <Container maxWidth={"md"} sx={{ mb: "10rem" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: [-100, 30, 0] }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0 }}
      >
        <Typography
          sx={{ color: "white", textAlign: "left", mb: "1.5rem" }}
          component="h1"
          variant="h4"
        >
          Búsqueda de cursos
        </Typography>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: [100, -30, 0] }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0 }}
      >
        <CoursesSearchBar />
      </motion.div>
      <Divider sx={{ my: "2rem", mb: "2rem", backgroundColor: "#31E1F7" }} />
      <Fragment>
        <Stack spacing={2}>
          {courses.length > 0 ? (
            courses.map((course) => (
              <motion.div
                key={course.nrc}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [100, -30, 0] }}
                transition={{ duration: 0.5 }}
                exit={{ opacity: 0 }}
              >
                <CourseStudentCard
                  key={course.nrc}
                  course={course}
                  option={"follow"}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              exit={{ opacity: 0 }}
            >
              <Alert severity="info" sx={{ textAlign: "left" }}>
                <AlertTitle>Sin resultados</AlertTitle>
                No hay resultados para mostrar de acuerdo a la búsqueda
              </Alert>
            </motion.div>
          )}
        </Stack>
      </Fragment>
      <Toaster />
    </Container>
  );
}
