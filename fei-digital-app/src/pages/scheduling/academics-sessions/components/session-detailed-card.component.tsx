import React, { useState } from "react";
import { Button, Card, Grid, Stack, Typography } from "@mui/material";
import { SessionDetailed } from "../interfaces";
import dayjs from "dayjs";
import { EconexDrawer } from "../../common/econex/econex-drawer.component";
import { AcademicSessionsSocket } from "../academic-sessions-socket.manager";
import { useAppDispatch } from "../../../../app/hooks";
import { useNavigate } from "react-router-dom";
import { showToastError } from "../../../../shared/toast/toastSlice";

export function SessionDetailedCard(props: {
  key: string;
  session: SessionDetailed;
}) {
  const [messages, setMessages] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onClose = () => {
    setIsOpen(false);
  };

  const handleWatchLocation = (event: React.MouseEvent<HTMLElement>) => {
    setIsOpen(true);
  };

  const handleStartClass = (event: React.MouseEvent<HTMLElement>) => {
    try {
      AcademicSessionsSocket.startSessionEvent(props.session.id);
    } catch (error) {
      dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
      navigate("/home", { replace: true });
    }
  };

  return (
    <Card
      elevation={6}
      sx={{ backgroundColor: "#1E263B", color: "white", padding: "1rem" }}
    >
      <Grid container>
        <Grid item xs={10} sx={{ textAlign: "justify" }}>
          <Typography variant="body1">
            Nrc: {props.session.nrc} Nombre: {props.session.name}
            <br />
            Fecha de clase:{" "}
            {new Date(props.session.classDate).toLocaleDateString()} <br />
            De:{" "}
            {dayjs(props.session.initialTime)
              .toDate()
              .toLocaleTimeString("es-MX")}{" "}
            a:{" "}
            {dayjs(props.session.endTime).toDate().toLocaleTimeString("es-MX")}{" "}
            <br />
            Aula de clase: {props.session.classroomName}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Stack spacing={1} direction={"column"}>
            <Button
              onClick={handleWatchLocation}
              color="info"
              variant="outlined"
            >
              Ver clase
            </Button>
            <Button
              onClick={handleStartClass}
              color="success"
              variant="outlined"
            >
              Iniciar
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <EconexDrawer
        key={"econex"}
        classroomCode={props.session.classroomCode}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Card>
  );
}
