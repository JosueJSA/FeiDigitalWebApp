import { Button, Card, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Academic } from "../interfaces/academic.interface";

export default function AcademicCard(props: {
  key: string;
  academic: Academic;
}) {
  const navigate = useNavigate();

  const handleRequest = (event: React.MouseEvent<HTMLElement>) => {
    navigate(`/academics/resume/academic/${props.academic.id!}`, {
      replace: true,
    });
  };

  return (
    <Card
      elevation={6}
      sx={{
        backgroundColor: "#1E263B",
        color: "white",
        padding: "1rem",
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={8} sx={{ textAlign: "left" }}>
          <Typography component="h2" variant="body1">
            Nombre: {props.academic.fullName}
          </Typography>
          <Typography variant="body1">
            Correo electrónico: {props.academic.email}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
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
              Ver info
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}
