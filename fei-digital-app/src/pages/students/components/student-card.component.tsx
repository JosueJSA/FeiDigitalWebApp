import {
  Button,
  Card,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import { Student } from "../interfaces/student.interface";
import { useNavigate } from "react-router-dom";

export default function StudentCard(props: { key: string; student: Student }) {
  const navigate = useNavigate();

  const handleRequest = (event: React.MouseEvent<HTMLElement>) => {
    navigate(`/students/student/${props.student.id!}`, { replace: true });
  };

  const handleEdit = (event: React.MouseEvent<HTMLElement>) => {
    navigate(`/students/student-edition/${props.student.id!}`, {
      replace: true,
    });
  };

  return (
    <Card
      elevation={6}
      sx={{ backgroundColor: "#1E263B", color: "white", padding: "1rem" }}
    >
      <Grid container>
        <Grid item xs={9} sx={{ textAlign: "justify" }}>
          <Typography variant="body1">
            Nombre: {props.student.name} <br />
            Correo electrónico: {props.student.email}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Stack spacing={2} direction={"row"}>
            <Button
              variant="outlined"
              startIcon={<RemoveRedEyeIcon />}
              onClick={handleRequest}
              aria-label="Ver estudiante"
              sx={{
                borderColor: "#00B8DD",
                color: "white",
                width: "100%",
                height: "100%",
                textTransform: "none",
              }}
            >
              Ver
            </Button>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              aria-label="Editar estudiante"
              sx={{
                borderColor: "#00B8DD",
                color: "white",
                width: "100%",
                height: "100%",
                textTransform: "none",
              }}
            >
              Editar
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}
