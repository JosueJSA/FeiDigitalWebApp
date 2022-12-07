import {
  Alert,
  AlertTitle,
  Card,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { convertToDateTime } from "../constants";
import {
  clearSessionDeailed,
  selectAcademicsSchedule,
  setSessionDetailed,
  setSessiosDetailed,
} from "./academicsScheduleSlice";
import { SessionDetailedCard } from "./components/session-detailed-card.component";
import { SessionDetailed } from "./interfaces";
import { ClassroomStatus } from "./components/classroom-status.component";
import { CustomTextField } from "../../../styles";
import { LocalSession } from "../../../shared/session";
import { motion } from "framer-motion";
import { AcademicSessionsSocket } from "./academic-sessions-socket.manager";
import {
  endSessionEvent,
  errorSessionsEvent,
  getSessionsForAcademicEvent,
  getSessionsStartedEvent,
  startSessionEvent,
} from "./constants";
import { useLocation, useNavigate } from "react-router-dom";
import { addPage } from "../../../shared/breadcrumns/breadcrumbsSlice";
import { showToastError } from "../../../shared/toast/toastSlice";
import { Toaster } from "../../../shared/toast/toaster.component";

export function AcademicSchedule() {
  const [date, setDate] = useState<Dayjs | null>(dayjs(Date.now()));
  const [messages, setMessages] = useState(0);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const sessions = useAppSelector(selectAcademicsSchedule).sessionsDetaied;

  useEffect(() => {
    try {
      dispatch(addPage({ name: "Horario", url: location.pathname }));
      const socket = AcademicSessionsSocket.getSessionInstanceWithToken();
      if (messages === 0) {
        handleInit();
        getSessionActivated();
      }
      socket.on(getSessionsForAcademicEvent, getSessionsForAcademicListener);
      socket.on(getSessionsStartedEvent, getSessionStartedListener);
      socket.on(startSessionEvent, getSessionStartedListener);
      socket.on(endSessionEvent, endSessionListener);
      socket.on(errorSessionsEvent, errorListener);
      return () => {
        socket.off(getSessionsForAcademicEvent);
        socket.off(getSessionsStartedEvent);
        socket.off(startSessionEvent);
        socket.off(endSessionEvent);
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

  const handleInit = () => {
    getSessionsDetailed(date!.toDate());
    setMessages(messages + 1);
  };

  const getSessionActivated = () => {
    AcademicSessionsSocket.getSessionActivated(LocalSession.getSession().id);
    setMessages(messages + 1);
  };

  const getSessionStartedListener = (event: any) => {
    dispatch(setSessionDetailed(event));
  };

  const getSessionsForAcademicListener = (event: any) => {
    let list: SessionDetailed[] = [];
    event.forEach((session: any) => {
      list.push({
        ...session,
        initialTime: new Date(parseInt(session.initialTime)).toISOString(),
        endTime: new Date(parseInt(session.endTime)).toISOString(),
      });
    });
    dispatch(setSessiosDetailed(list));
  };

  const endSessionListener = (event: any) => {
    dispatch(clearSessionDeailed());
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

  const getSessionsDetailed = (date: Date) => {
    AcademicSessionsSocket.getSessionDetailedForAcademics(
      LocalSession.getSession().id,
      date
    );
  };

  const handleDateSelection = (newValue: Dayjs | null) => {
    setDate(newValue);
    getSessionsDetailed(newValue!.toDate());
  };

  return (
    <Container maxWidth="md" sx={{ mb: "10rem" }}>
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
          Horario
        </Typography>
      </motion.div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [-100, 30, 0] }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0 }}
        >
          <Card
            elevation={6}
            sx={{
              backgroundColor: "#171D2C",
              color: "white",
              padding: "1rem",
              my: "1rem",
              mb: "2rem",
            }}
          >
            <DesktopDatePicker
              label="Selecciona una fecha"
              inputFormat="MM/DD/YYYY"
              value={date}
              onChange={handleDateSelection}
              renderInput={(params) => (
                <CustomTextField sx={{ display: "flex" }} {...params} />
              )}
            />
          </Card>
        </motion.div>
        <motion.div
          className="box"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            duration: 1,
            times: 2,
            repeatDelay: 2,
            repeat: Infinity,
          }}
        >
          <ClassroomStatus />
        </motion.div>
        <Divider sx={{ my: "2rem", mb: "2rem", backgroundColor: "#31E1F7" }} />
        <Stack spacing={2}>
          {sessions && sessions.length > 0 ? (
            sessions.map((session) => (
              <motion.div
                key={session.id!}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [-200, 100, 0] }}
                transition={{ duration: 0.5 }}
                exit={{ opacity: 0 }}
              >
                <SessionDetailedCard key={session.id!} session={session} />
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
      </LocalizationProvider>
      <Toaster />
    </Container>
  );
}
