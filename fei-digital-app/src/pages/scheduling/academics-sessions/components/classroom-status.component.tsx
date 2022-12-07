import { Button, Card, Grid, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { showToastError } from "../../../../shared/toast/toastSlice";
import { AcademicSessionsSocket } from "../academic-sessions-socket.manager";
import { selectAcademicsSchedule } from "../academicsScheduleSlice";

export function ClassroomStatus() {
  const [messages, setMessages] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const session = useAppSelector(selectAcademicsSchedule).sessionDetailed;

  const handleEndSession = (event: React.MouseEvent<HTMLElement>) => {
    try {
      AcademicSessionsSocket.endSessionEvent(session!.id);
    } catch (error) {
      dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
      navigate("/home", { replace: true });
    }
  };

  return (
    <Card
      elevation={6}
      sx={{
        backgroundColor: "#313c5d",
        color: "white",
        padding: "1rem",
        display: session?.id ? "flex" : "none",
      }}
    >
      <Grid container rowSpacing={3}>
        <Grid item xs={12} md={10} sx={{ textAlign: "left" }}>
          {session ? (
            <Typography variant="body1">
              Nrc: {session.nrc} Nombre: {session.name}
              <br />
              Fecha de clase: {new Date(session.classDate).toDateString()}{" "}
              <br />
              Aula: {session.classroomName} Estado del aula:{" "}
              {session.classroomStatus}
            </Typography>
          ) : (
            <h1>loading...</h1>
          )}
        </Grid>
        <Grid item xs={12} md={2}>
          <Stack spacing={1} direction={"column"}>
            <Button
              onClick={handleEndSession}
              color="error"
              variant="contained"
            >
              Terminar
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}
