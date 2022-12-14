import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { showToastError } from "../../../../shared/toast/toastSlice";
import { AcademicSessionsSocket } from "../academic-sessions-socket.manager";
import { selectAcademicsSchedule } from "../academicsScheduleSlice";

export function CourseDeleteConfirmation(props: {
  key: string;
  opened: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const course = useAppSelector(selectAcademicsSchedule).course;

  const handleCloseDialog = (event: React.MouseEvent<HTMLElement>) => {
    props.onClose();
  };

  const handleClickDelete = (event: React.MouseEvent<HTMLElement>) => {
    try {
      AcademicSessionsSocket.deleteCourseEvent(course!.nrc);
    } catch (error) {
      dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
      navigate("/home", { replace: true });
    }
  };

  return (
    <Dialog
      open={props.opened}
      onClose={handleCloseDialog}
      aria-labelledby="Confirmación de eliminación de curso"
    >
      <DialogTitle id="alert-dialog-title">Confirmación</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          ¿Estás seguro(a) de que deseas eliminar el curso '{course!.nrc}:{" "}
          {course!.name}', así como TODAS sus clases?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseDialog}
          autoFocus
          aria-label="Cancela eliminación de curso"
          aria-required="true"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleClickDelete}
          aria-label="Aceptar eliminación de curso"
          aria-required="true"
        >
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
