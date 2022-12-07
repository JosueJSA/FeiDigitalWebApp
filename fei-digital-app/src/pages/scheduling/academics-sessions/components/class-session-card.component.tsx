import React, { useState } from "react";
import {
  Button,
  Card,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch } from "../../../../app/hooks";
import { DAYS } from "../../constants";
import { setClassSession } from "../academicsScheduleSlice";
import dayjs from "dayjs";
import { EconexDrawer } from "../../common/econex/econex-drawer.component";

export function ClassSessionCard(props: {
  key: string;
  session: any;
  onOpenDeleteDialog: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleUpdateClassSession = (event: React.MouseEvent<HTMLElement>) => {
    dispatch(setClassSession(props.session));
    navigate(
      `/academics/courses/sessions/session/edition/${props.session.id}`,
      {
        replace: true,
      }
    );
  };

  const handleWatchLocation = (event: React.MouseEvent<HTMLElement>) => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const handleDeleteClassSession = (event: React.MouseEvent<HTMLElement>) => {
    dispatch(setClassSession(props.session));
    props.onOpenDeleteDialog();
  };

  return (
    <Card
      elevation={6}
      sx={{ backgroundColor: "#1E263B", color: "white", padding: "1rem" }}
    >
      <Grid container rowSpacing={3}>
        <Grid item xs={12} md={10} sx={{ textAlign: "left" }}>
          <Typography component="h2" variant="body1">
            Fecha de clase:{" "}
            {new Date(props.session.classDate).toLocaleDateString("es-MX")}{" "}
          </Typography>
          <Typography variant="body1">
            Hora de inicio:{" "}
            {dayjs(props.session.initialTime)
              .toDate()
              .toLocaleTimeString("es-MX")}{" "}
            <br />
            Hora de fin:{" "}
            {dayjs(props.session.endTime)
              .toDate()
              .toLocaleTimeString("es-MX")}{" "}
            <br />
            Aula de clase: {props.session.classroomName}
          </Typography>
          {props.session.repeated ? (
            <Typography variant="body1">
              <br />
              La clase se repetirá cada:{" "}
              {DAYS[new Date(props.session.classDate).getDay()]} <br />
              Hasta:{" "}
              {" " +
                new Date(props.session.classDateEnd).toLocaleDateString(
                  "es-MX"
                )}
            </Typography>
          ) : (
            <div></div>
          )}
        </Grid>
        <Grid item xs={12} md={2}>
          <Stack spacing={1} direction={"column"}>
            <Button
              variant="outlined"
              aria-label="Ver clases"
              sx={{ color: "white" }}
              onClick={handleWatchLocation}
              startIcon={<RemoveRedEyeIcon />}
            >
              Ver
            </Button>
            <Button
              variant="outlined"
              onClick={handleUpdateClassSession}
              aria-label="Editar clase"
              sx={{ color: "white" }}
              startIcon={<EditIcon />}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteClassSession}
              aria-label="Eliminar clase"
              sx={{ color: "white" }}
              startIcon={<DeleteIcon />}
            >
              Eliminar
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
