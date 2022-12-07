import React, { useEffect } from "react";
import { Container, Divider, Typography } from "@mui/material";
import { ClassSessionForm } from "./components/class-session-form.component";
import { motion } from "framer-motion";
import { AcademicSessionsSocket } from "./academic-sessions-socket.manager";
import { addSsessionEvent, errorSessionsEvent } from "./constants";
import { useLocation, useNavigate } from "react-router-dom";
import { selectAcademicsSchedule } from "./academicsScheduleSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addPage } from "../../../shared/breadcrumns/breadcrumbsSlice";
import { showToastError } from "../../../shared/toast/toastSlice";

export function ClassSessionRegistrer() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const course = useAppSelector(selectAcademicsSchedule).course;

  useEffect(() => {
    try {
      dispatch(addPage({ name: "Registro de clase", url: location.pathname }));
      const socket = AcademicSessionsSocket.getSessionInstanceWithToken();
      socket.on(addSsessionEvent, addSessionListener);
      socket.on(errorSessionsEvent, errorListener);
      return () => {
        socket.off(addSsessionEvent);
        socket.off(errorSessionsEvent);
      };
    } catch (error) {
      containError();
    }
  });

  const containError = () => {
    dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
    navigate("/home", { replace: true });
  };

  const addSessionListener = (event: any) => {
    navigate(`/academics/courses/sessions/${course!.nrc}`, { replace: true });
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
    <Container maxWidth="sm" sx={{ my: "6rem" }}>
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
          Registro de clase
        </Typography>
      </motion.div>
      <Divider sx={{ my: "2rem", mb: "2rem", backgroundColor: "#31E1F7" }} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: [100, -30, 0] }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0 }}
      >
        <ClassSessionForm key={"registration"} type={"registration"} />
      </motion.div>
    </Container>
  );
}
