import {
  Alert,
  AlertTitle,
  Container,
  Divider,
  Fab,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import AddIcon from "@mui/icons-material/Add";
import {
  selectAcademicsSchedule,
  setClassSessionsList,
} from "./academicsScheduleSlice";
import { ClassSessionCard } from "./components/class-session-card.component";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ClassSession } from "./interfaces";
import { convertToDateTime } from "../constants";
import { SessionDeleteConfirmation } from "./components/delete-session-confirmation.component";
import { motion } from "framer-motion";
import { AcademicSessionsSocket } from "./academic-sessions-socket.manager";
import {
  deleteSessionsEvent,
  errorSessionsEvent,
  getSessionsEvent,
} from "./constants";
import { addPage } from "../../../shared/breadcrumns/breadcrumbsSlice";
import { showToastError } from "../../../shared/toast/toastSlice";

export function Sessions() {
  const { nrc } = useParams();
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [messages, setMessages] = useState(0);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const sessions = useAppSelector(selectAcademicsSchedule).classSessionsList;

  useEffect(() => {
    try {
      dispatch(addPage({ name: "Clases", url: location.pathname }));
      const socket = AcademicSessionsSocket.getSessionInstanceWithToken();
      if (messages === 0) getSessionsByCourse();
      socket.on(getSessionsEvent, getSessionsListener);
      socket.on(deleteSessionsEvent, deleteSessionsListener);
      socket.on(errorSessionsEvent, errorListener);
      return () => {
        socket.off(getSessionsEvent);
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

  const errorListener = (event: any) => {
    const error: Array<string> = event.error;
    if (error.indexOf("No autorizado") >= 0) {
      navigate("/login", { replace: true });
      dispatch(showToastError({ content: ["Tu sesión ha expirado"] }));
    } else {
      dispatch(showToastError({ content: error }));
    }
  };

  const deleteSessionsListener = (event: any) => {
    getSessionsByCourse();
    setOpened(false);
  };

  const getSessionsListener = (event: any) => {
    let list: ClassSession[] = [];
    event.forEach((session: any) => {
      list.push({
        id: session.id,
        classDate: session.classDate,
        classDateEnd: session.classDateEnd,
        initialTime: new Date(parseInt(session.initialTime)).toISOString(),
        endTime: new Date(parseInt(session.endTime)).toISOString(),
        repeated: session.repeated,
        courseNrc: nrc as string,
        classroomCode: session.classroom.code,
        classroomName: session.classroom.name,
      });
    });
    dispatch(setClassSessionsList(list));
  };

  const getSessionsByCourse = () => {
    AcademicSessionsSocket.getSessionsByCourseEvent(nrc as string);
    setMessages(messages + 1);
  };

  const handleAddClassSession = (event: React.MouseEvent<HTMLElement>) => {
    navigate("/academics/courses/sessions/add", {
      replace: true,
    });
  };

  const handleOpenDeleteDialog = () => {
    setOpened(true);
  };

  const onCloseDeleteDialog = () => {
    setOpened(false);
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
            Sessiones de clase
          </Typography>
        </motion.div>
        <Divider sx={{ my: "2rem", mb: "2rem", backgroundColor: "#31E1F7" }} />
        <Stack spacing={2}>
          {sessions && sessions.length > 0 ? (
            sessions.map((session) => (
              <motion.div
                key={session.id!}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: [100, -30, 0] }}
                transition={{ duration: 0.5 }}
                exit={{ opacity: 0 }}
              >
                <ClassSessionCard
                  key={session.id!}
                  session={session}
                  onOpenDeleteDialog={handleOpenDeleteDialog}
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
        onClick={handleAddClassSession}
        color="success"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
      <SessionDeleteConfirmation
        key={"delete"}
        opened={opened}
        onClose={onCloseDeleteDialog}
      />
    </div>
  );
}
