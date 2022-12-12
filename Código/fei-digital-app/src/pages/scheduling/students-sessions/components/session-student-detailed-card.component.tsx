import React, { useState } from "react";
import { Button, Card, Grid, Stack, Typography } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import dayjs from "dayjs";
import { SessionStudentDetailed } from "../interfaces";
import { EconexDrawer } from "../../common/econex/econex-drawer.component";

export function SessionStudentDetailedCard(props: {
  key: string;
  session: SessionStudentDetailed;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const handleClickWatch = (event: React.MouseEvent<HTMLElement>) => {
    setIsOpen(true);
  };

  return (
    <Card
      elevation={6}
      sx={{
        backgroundColor:
          props.session.idClass !== props.session.id ? "#1E263B" : "#1f0003",
        color: "white",
        padding: "1rem",
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={8} sx={{ textAlign: "left" }}>
          <Typography component="h2" variant="body1">
            Nrc: {props.session.nrc} Nombre: {props.session.name}
          </Typography>
          <Typography variant="body1">
            Fecha de clase:{" "}
            {new Date(props.session.classDate).toLocaleDateString()} <br />
            De:{" "}
            {dayjs(props.session.initialTime)
              .toDate()
              .toLocaleTimeString("es-MX")}{" "}
            a:{" "}
            {dayjs(props.session.endTime).toDate().toLocaleTimeString("es-MX")}{" "}
            <br />
            Edificio: {props.session.building} Aula de clase:{" "}
            {props.session.classroomName}
            <br />
            Última actualización:{" "}
            {dayjs(props.session.updated).toDate().toLocaleDateString("es-MX")}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={1} direction={"column"}>
            <Button
              id={props.session.id}
              onClick={handleClickWatch}
              variant="outlined"
              startIcon={<RemoveRedEyeIcon />}
            >
              Ver ubicación
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
