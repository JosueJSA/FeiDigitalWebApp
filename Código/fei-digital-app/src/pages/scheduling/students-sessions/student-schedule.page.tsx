import {
  Alert,
  AlertTitle,
  Card,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addPage } from "../../../shared/breadcrumns/breadcrumbsSlice";
import { LocalSession } from "../../../shared/session";
import { showToastError } from "../../../shared/toast/toastSlice";
import { CustomTextField } from "../../../styles";
import { errorSessionsEvent } from "../academics-sessions/constants";
import { convertToDateTime } from "../constants";
import { SessionStudentDetailedCard } from "./components/session-student-detailed-card.component";
import { getSessionsStudentEvent, updateForRequestersEvent } from "./constants";
import { SessionStudentDetailed } from "./interfaces";
import { StudentSessionsSocket } from "./student-sessions-socket.manager";
import {
  selectStudentsSchedule,
  setSessionsStudentDetailed,
  setUpdateWithSession,
} from "./studentsScheduleSlice";

export function StudentSchedule() {
  const [messages, setMessages] = useState(0);
  const [date, setDate] = useState<Dayjs | null>(dayjs(Date.now()));
  const sessions = useAppSelector(selectStudentsSchedule).sessionsDetailed;
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      dispatch(addPage({ name: "Horario", url: location.pathname }));
      const socket = StudentSessionsSocket.getSessionInstanceWithToken();
      if (messages === 0) handleInit();
      socket.on(updateForRequestersEvent, updateForRequestersListener);
      socket.on(getSessionsStudentEvent, getSessionsStudentListener);
      socket.on(errorSessionsEvent, errorListener);
      return () => {
        socket.off(updateForRequestersEvent);
        socket.off(getSessionsStudentEvent);
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

  const updateForRequestersListener = (event: any) => {
    dispatch(setUpdateWithSession(event));
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

  const getSessionsStudentListener = (event: any) => {
    let list: SessionStudentDetailed[] = [];
    event.forEach((session: any) => {
      list.push({
        ...session,
        initialTime: new Date(parseInt(session.initialTime)).toISOString(),
        endTime: new Date(parseInt(session.endTime)).toISOString(),
      });
    });
    dispatch(setSessionsStudentDetailed(list));
  };

  const handleDateSelection = (newValue: Dayjs | null) => {
    setDate(newValue);
    getSessionSchedule(newValue!.toDate());
  };

  const handleInit = () => {
    try {
      StudentSessionsSocket.getSessionsByFollowerEvent(
        date!.toDate(),
        LocalSession.getSession().id
      );
      setMessages(messages + 1);
    } catch (error) {
      dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
      navigate("/home", { replace: true });
    }
  };

  const getSessionSchedule = (date: Date) => {
    try {
      StudentSessionsSocket.getSessionsByFollowerEvent(
        date,
        LocalSession.getSession().id
      );
    } catch (error) {
      console.log(error);
    }
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
          animate={{ opacity: 1, x: [100, -30, 0] }}
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
            }}
          >
            <DesktopDatePicker
              label="Selecciona una fecha"
              inputFormat="MM/DD/YYYY"
              value={date}
              onChange={handleDateSelection}
              renderInput={(params) => (
                <CustomTextField
                  id="calendar"
                  sx={{ display: "flex" }}
                  {...params}
                />
              )}
            />
          </Card>
        </motion.div>
        <Divider sx={{ my: "2rem", mb: "3rem", backgroundColor: "#31E1F7" }} />
        <Stack spacing={2}>
          {sessions && sessions.length > 0 ? (
            sessions.map((session: any) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [100, -30, 0] }}
                transition={{ duration: 0.5 }}
                exit={{ opacity: 0 }}
              >
                <SessionStudentDetailedCard
                  key={session.id!}
                  session={session}
                />
              </motion.div>
            ))
          ) : (
            <Alert severity="info" sx={{ textAlign: "left" }}>
              <AlertTitle>Sin resultados</AlertTitle>
              No hay resultados para mostrar de acuerdo a la búsqueda
            </Alert>
          )}
        </Stack>
      </LocalizationProvider>
    </Container>
  );
}
