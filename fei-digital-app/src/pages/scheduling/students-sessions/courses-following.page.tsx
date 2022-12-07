import {
  Alert,
  AlertTitle,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addPage } from "../../../shared/breadcrumns/breadcrumbsSlice";
import { LocalSession } from "../../../shared/session";
import { Toaster } from "../../../shared/toast/toaster.component";
import { showToastError } from "../../../shared/toast/toastSlice";
import { errorCourseEvent } from "../academics-sessions/constants";
import { CourseStudentCard } from "./components/course-student-card.component";
import { getCoursesStudentEvent, unfollowCourseEvent } from "./constants";
import { StudentSessionsSocket } from "./student-sessions-socket.manager";
import { selectStudentsSchedule, setCourses } from "./studentsScheduleSlice";

export function CoursesFollowing() {
  const [messages, setMessages] = useState(0);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const courses = useAppSelector(selectStudentsSchedule).courses;

  useEffect(() => {
    try {
      dispatch(addPage({ name: "Mis cursos", url: location.pathname }));
      const socket = StudentSessionsSocket.getCourseInstanceWithToken();
      if (messages === 0) getCoursesFollowing();
      socket.on(getCoursesStudentEvent, followCourseListener);
      socket.on(unfollowCourseEvent, unfollowCourseListener);
      socket.on(errorCourseEvent, errorListener);
      return () => {
        socket.off(getCoursesStudentEvent);
        socket.off(unfollowCourseEvent);
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
    dispatch(setCourses(event));
  };

  const unfollowCourseListener = (event: any) => {
    getCoursesFollowing();
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

  const getCoursesFollowing = () => {
    try {
      StudentSessionsSocket.getCoursesByFollowerEvent(
        LocalSession.getSession().id
      );
      setMessages(messages + 1);
    } catch (error) {
      dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
      navigate("/home", { replace: true });
    }
  };

  return (
    <Container maxWidth={"md"} sx={{ my: "6rem" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: [-100, 30, 0] }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0 }}
      >
        <Typography
          sx={{ color: "white", textAlign: "left", mb: "1.5rem" }}
          component="h2"
          variant="h4"
        >
          Cursos seguidos
        </Typography>
      </motion.div>
      <Divider sx={{ my: "2rem", mb: "2rem", backgroundColor: "#31E1F7" }} />
      <Stack spacing={2}>
        {courses.length > 0 ? (
          courses.map((course) => (
            <motion.div
              key={course.nrc}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: [100, -30, 0] }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0 }}
            >
              <CourseStudentCard
                key={course.nrc}
                course={course}
                option={"unfollow"}
              />
            </motion.div>
          ))
        ) : (
          <Alert severity="info" sx={{ textAlign: "left" }}>
            <AlertTitle>Sin cursos seguidos</AlertTitle>
            No siguies ningún curso actualmente
          </Alert>
        )}
      </Stack>
      <Toaster />
    </Container>
  );
}
