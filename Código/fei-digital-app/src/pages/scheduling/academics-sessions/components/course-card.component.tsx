import React from "react";
import { Button, Card, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Course } from "../interfaces";
import { setCourse } from "../academicsScheduleSlice";
import { useAppDispatch } from "../../../../app/hooks";

export function CourseCard(props: {
  key: string;
  course: Course;
  onUpdateDialog: () => void;
  onDeleteDialog: () => void;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleConsultCourse = (event: React.MouseEvent<HTMLElement>) => {
    dispatch(setCourse(props.course));
    navigate(`/academics/courses/sessions/${props.course.nrc}`, {
      replace: true,
    });
  };

  const handleUpdateDialog = (event: React.MouseEvent<HTMLElement>) => {
    dispatch(setCourse(props.course));
    props.onUpdateDialog();
  };

  const handleDeleteDialog = (event: React.MouseEvent<HTMLElement>) => {
    dispatch(setCourse(props.course));
    props.onDeleteDialog();
  };

  return (
    <Card
      elevation={6}
      sx={{ backgroundColor: "#1E263B", color: "white", padding: "1rem" }}
    >
      <Grid container rowSpacing={2}>
        <Grid item xs={12} md={8} sx={{ textAlign: "left" }}>
          <Typography component="h2" variant="body1">
            Nombre del curso: {props.course.name}
          </Typography>
          <Typography variant="body1">NRC: {props.course.nrc}</Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={2} direction={"row"}>
            <Button
              id={props.course.nrc + "watch"}
              onClick={handleConsultCourse}
              aria-label="Ver clases"
              aria-required="true"
              variant="outlined"
              sx={{ borderColor: "#00B8DD", color: "white" }}
            >
              <RemoveRedEyeIcon />
            </Button>
            <Button
              id={props.course.nrc + "update"}
              onClick={handleUpdateDialog}
              aria-label="Editar curso"
              aria-required="true"
              variant="outlined"
              sx={{ borderColor: "#00B8DD", color: "white" }}
            >
              <EditIcon />
            </Button>
            <Button
              id={props.course.nrc + "delete"}
              onClick={handleDeleteDialog}
              aria-label="Eliminar curso"
              aria-required="true"
              variant="outlined"
              sx={{ borderColor: "#00B8DD", color: "white" }}
            >
              <DeleteIcon />
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}
