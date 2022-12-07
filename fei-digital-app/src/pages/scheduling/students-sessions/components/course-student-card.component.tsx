import React from "react";
import { Button, Card, Grid, Stack, Typography } from "@mui/material";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import RemoveCircleOutlinedIcon from "@mui/icons-material/RemoveCircleOutlined";
import { Course } from "../../academics-sessions/interfaces";
import { LocalSession } from "../../../../shared/session";
import { StudentSessionsSocket } from "../student-sessions-socket.manager";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../app/hooks";
import { showToastError } from "../../../../shared/toast/toastSlice";

export function CourseStudentCard(props: {
  key: string;
  course: Course;
  option: string;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleFollowCourse = (event: React.MouseEvent<HTMLElement>) => {
    try {
      StudentSessionsSocket.followCourse(
        LocalSession.getSession().id,
        props.course.nrc
      );
    } catch (error) {
      dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
      navigate("/home", { replace: true });
    }
  };

  const handleUnfollowCourse = (event: React.MouseEvent<HTMLElement>) => {
    try {
      StudentSessionsSocket.unFollowCourse(
        LocalSession.getSession().id,
        props.course.nrc
      );
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
      <Grid container spacing={4}>
        <Grid item xs={8} sx={{ textAlign: "justify" }}>
          <Typography variant="body1">
            Nombre del curso: {props.course.name} <br />
            NRC: {props.course.nrc}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Stack spacing={0} direction={"row"}>
            <Button
              onClick={handleFollowCourse}
              sx={{
                display: props.option === "follow" ? "felx" : "none",
                height: "100%",
                width: "100%",
                backgroundColor: "#00B8DD",
                color: "black",
              }}
              color="primary"
              variant="contained"
              startIcon={<AddCircleOutlinedIcon />}
            >
              Seguir
            </Button>
            <Button
              onClick={handleUnfollowCourse}
              sx={{
                display: props.option !== "follow" ? "felx" : "none",
                height: "100%",
                width: "100%",
                backgroundColor: "#00B8DD",
                color: "black",
              }}
              color="error"
              variant="contained"
              startIcon={<RemoveCircleOutlinedIcon />}
            >
              Dejar de seguir
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}
