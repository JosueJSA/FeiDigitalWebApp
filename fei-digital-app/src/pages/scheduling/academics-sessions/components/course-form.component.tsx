import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import CloseIcon from "@mui/icons-material/Close";
import { selectAcademicsSchedule } from "../academicsScheduleSlice";
import { LocalSession } from "../../../../shared/session";
import { CustomTextField } from "../../../../styles";
import { AcademicSessionsSocket } from "../academic-sessions-socket.manager";
import { showToastError } from "../../../../shared/toast/toastSlice";
import { useNavigate } from "react-router-dom";

export function CourseForm(props: {
  key: string;
  type: string;
  opened: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [nrc, setNrc] = useState("");
  const course = useAppSelector(selectAcademicsSchedule).course;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    prepareFields();
  }, [props.opened]);

  const prepareFields = () => {
    if (props.type === "update") {
      if (course) {
        setName(course.name);
        setNrc(course.nrc);
      }
    } else {
      clearFields();
    }
  };

  const clearFields = () => {
    setName("");
    setNrc("");
  };

  const handleTypeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleTypeNrc = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNrc(event.target.value);
  };

  const handleCloseDialog = (event: React.MouseEvent<HTMLElement>) => {
    props.onClose();
  };

  const handleClickAddCourse = (event: React.MouseEvent<HTMLElement>) => {
    try {
      AcademicSessionsSocket.addCourseEvent({
        nrc: nrc,
        name: name,
        idAcademicPersonal: LocalSession.getSession().id,
      });
      clearFields();
    } catch (error) {
      dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
      navigate("/home", { replace: true });
    }
  };

  const handleClickUpdateCourse = (event: React.MouseEvent<HTMLElement>) => {
    try {
      AcademicSessionsSocket.updateCourseEvent(course!.nrc, {
        nrc: nrc,
        name: name,
        idAcademicPersonal: LocalSession.getSession().id,
      });
      clearFields();
    } catch (error) {
      dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
      navigate("/home", { replace: true });
    }
  };

  return (
    <Dialog
      open={props.opened}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle sx={{ backgroundColor: "#16213E", color: "white" }}>
        <Typography sx={{ color: "white", textAlign: "left", mb: "1rem" }}>
          Curso
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={{
            position: "absolute",
            color: "white",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Divider sx={{ backgroundColor: "#31E1F7", my: ".5rem", mb: "1rem" }} />
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: "#16213E", color: "white" }}>
        <form>
          <Stack
            sx={{ color: "white", mt: "1rem" }}
            spacing={4}
            direction="column"
          >
            <CustomTextField
              id="name"
              value={name}
              label="Nombre del curso"
              variant="outlined"
              onChange={handleTypeName}
            />
            <CustomTextField
              id="nrc"
              value={nrc}
              label="NRC"
              variant="outlined"
              onChange={handleTypeNrc}
            />
          </Stack>
          {props.type && props.type === "update" ? (
            <Button
              variant="contained"
              onClick={handleClickUpdateCourse}
              sx={{
                backgroundColor: "#31E1F7",
                color: "black",
                width: "100%",
                mt: "2rem",
                mb: "1rem",
                "&:hover": {
                  backgroundColor: "#D800A6",
                  color: "white",
                },
              }}
            >
              Guardar cambios
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleClickAddCourse}
              sx={{
                backgroundColor: "#31E1F7",
                color: "black",
                width: "100%",
                mt: "2rem",
                mb: "1rem",
                "&:hover": {
                  backgroundColor: "#D800A6",
                  color: "white",
                },
              }}
            >
              Agregar curso
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
