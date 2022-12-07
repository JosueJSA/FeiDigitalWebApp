import {
  Alert,
  AlertTitle,
  Divider,
  Fab,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import { Container } from "@mui/system";
import { CourseForm } from "./components/course-form.component";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectAcademicsSchedule,
  setCoursesList,
} from "./academicsScheduleSlice";
import { CourseCard } from "./components/course-card.component";
import { CourseDeleteConfirmation } from "./components/delete-course-confirmation.component";
import { LocalSession } from "../../../shared/session";
import { motion } from "framer-motion";
import { AcademicSessionsSocket } from "./academic-sessions-socket.manager";
import {
  addCourseEvent,
  deleteCourseEvent,
  errorCourseEvent,
  getCourseByAcademicEvent,
  updateCourseEvent,
} from "./constants";
import { addPage } from "../../../shared/breadcrumns/breadcrumbsSlice";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { showToastError } from "../../../shared/toast/toastSlice";
import { Toaster } from "../../../shared/toast/toaster.component";
import { Socket } from "socket.io-client";

export function Courses() {
  const [updateDialogOpened, setUpdateDialogOpened] = useState(false);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
  const [addDialogOpened, setAddDialogOpened] = useState(false);
  const [messages, setMessages] = useState(0);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const courses = useAppSelector(selectAcademicsSchedule).coursesList;

  useEffect(() => {
    try {
      dispatch(addPage({ name: "Cursos", url: location.pathname }));
      const socket = AcademicSessionsSocket.getCourseInstanceWithToken();
      if (messages === 0) getCourses();
      socket.on(getCourseByAcademicEvent, getCourseByAcademicListener);
      socket.on(addCourseEvent, addCourseListener);
      socket.on(updateCourseEvent, updateCourseListener);
      socket.on(deleteCourseEvent, deleteCourseListener);
      socket.on(errorCourseEvent, errorListener);
      return () => {
        socket.off(getCourseByAcademicEvent);
        socket.off(addCourseEvent);
        socket.off(updateCourseEvent);
        socket.off(deleteCourseEvent);
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

  const getCourses = () => {
    AcademicSessionsSocket.getCoursesEvent(LocalSession.getSession().id);
    setMessages(messages + 1);
  };

  const getCourseByAcademicListener = (event: any) => {
    dispatch(setCoursesList(event));
  };

  const updateCourseListener = (event: any) => {
    setUpdateDialogOpened(false);
    getCourses();
  };

  const addCourseListener = (event: any) => {
    setAddDialogOpened(false);
    getCourses();
  };

  const deleteCourseListener = (event: any) => {
    setDeleteDialogOpened(false);
    getCourses();
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

  const handleAddOpenDialog = (event: React.MouseEvent<HTMLElement>) => {
    setAddDialogOpened(true);
  };

  const handleUpdateOpenDialog = () => {
    setUpdateDialogOpened(true);
  };

  const handleDeleteOpenDialog = () => {
    setDeleteDialogOpened(true);
  };

  const closeAddDialog = () => {
    setAddDialogOpened(false);
  };

  const closeUpdateDialog = () => {
    setUpdateDialogOpened(false);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpened(false);
  };

  return (
    <div>
      <Container maxWidth="md" sx={{ my: "6rem" }}>
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
            Cursos
          </Typography>
        </motion.div>
        <Divider sx={{ my: "2rem", mb: "2rem", backgroundColor: "#31E1F7" }} />
        <Stack spacing={2}>
          {courses && courses.length > 0 ? (
            courses.map((course) => (
              <motion.div
                key={course.nrc}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [-100, 30, 0] }}
                transition={{ duration: 0.5 }}
                exit={{ opacity: 0 }}
              >
                <CourseCard
                  key={course.nrc}
                  course={course}
                  onUpdateDialog={handleUpdateOpenDialog}
                  onDeleteDialog={handleDeleteOpenDialog}
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
      </Container>
      <Fab
        sx={{ position: "absolute", bottom: 20, right: 20 }}
        color="primary"
        aria-label="add"
        onClick={handleAddOpenDialog}
      >
        <AddIcon />
      </Fab>
      <CourseForm
        key="adition"
        type="adition"
        opened={addDialogOpened}
        onClose={closeAddDialog}
      />
      <CourseForm
        key="update"
        type="update"
        opened={updateDialogOpened}
        onClose={closeUpdateDialog}
      />
      <CourseDeleteConfirmation
        key="delete"
        opened={deleteDialogOpened}
        onClose={closeDeleteDialog}
      />
      <Toaster />
    </div>
  );
}
