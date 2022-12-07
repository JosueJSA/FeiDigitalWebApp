import {
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { Encrypter } from "../../encryption";
import { setPage } from "../../shared/breadcrumns/breadcrumbsSlice";
import {
  cleanSession,
  setAcademicSession,
} from "../../shared/navbar/navbarSlice";
import { LocalSession } from "../../shared/session";
import { Toaster } from "../../shared/toast/toaster.component";
import { showToastError } from "../../shared/toast/toastSlice";
import { AcademicSocket } from "../academics/academic-socket.manager";
import { setEmptyAcademicState } from "../academics/academicSlice";
import { AcademicSessionsSocket } from "../scheduling/academics-sessions/academic-sessions-socket.manager";
import { setEmptyAcademicScheduleState } from "../scheduling/academics-sessions/academicsScheduleSlice";
import { StudentSessionsSocket } from "../scheduling/students-sessions/student-sessions-socket.manager";
import { setEmptyStudentScheduleState } from "../scheduling/students-sessions/studentsScheduleSlice";
import { setEmptyStudentState } from "../students/studentSlice";
import { Account } from "./components/account.component";
import { UserTypeDialog } from "./components/user-type.component";
import { errorEvent, signInAcademicEvent } from "./constants";
import { LoginSocket } from "./login-socket.manager";

export function SignIn() {
  const [messages, setMessages] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      dispatch(setPage({ name: "Inicio de sesión", url: location.pathname }));
      if (messages === 0) closeSessions();
      const socket = AcademicSocket.getInstance();
      socket.on(signInAcademicEvent, signInAcademicListener);
      socket.on(errorEvent, errorAcademicListener);
      return () => {
        socket.off(signInAcademicEvent);
        socket.off(errorEvent);
      };
    } catch (err) {
      containError();
    }
  });

  const closeSessions = () => {
    LocalSession.clearSession();
    dispatch(cleanSession());
    dispatch(setEmptyStudentState());
    dispatch(setEmptyAcademicState());
    dispatch(setEmptyStudentScheduleState());
    dispatch(setEmptyAcademicScheduleState());
    try {
      AcademicSocket.killSockets();
      LoginSocket.killSockets();
      AcademicSessionsSocket.killSockets();
      StudentSessionsSocket.killSockets();
    } catch (error) {}
    setMessages(messages + 1);
  };

  const containError = () => {
    dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
    navigate("/home", { replace: true });
  };

  const signInAcademicListener = (event: any) => {
    setSession(event);
    dispatch(setAcademicSession({ id: event.id, name: event.fullName }));
    navigate("/home", { replace: true });
  };

  const setSession = (event: any) => {
    LocalSession.setSession({
      id: event.id,
      name: event.fullName,
      token: event.token,
      type: "Académico",
    });
  };

  const errorAcademicListener = (event: any) => {
    dispatch(showToastError({ content: event.error }));
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "justify" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: 100 }}
        exit={{ opacity: 0 }}
      >
        <Card
          elevation={16}
          sx={{ backgroundColor: "#171D2C", borderRadius: "10px" }}
        >
          <CardContent>
            <Typography component="h2" variant="h4" sx={{ color: "white" }}>
              Iniciar sesión
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "white", my: ".3rem", mb: "3rem" }}
            >
              Por favor, llena los campos correspondientes a tu sesión
            </Typography>
            <Account />
          </CardContent>
          <CardActions>
            <UserTypeDialog />
          </CardActions>
        </Card>
      </motion.div>
      <Toaster />
    </Container>
  );
}
