import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectAcademicsSchedule } from "../academicsScheduleSlice";
import { AcademicSessionsSocket } from "../academic-sessions-socket.manager";
import { useNavigate } from "react-router-dom";
import { showToastError } from "../../../../shared/toast/toastSlice";

export function SessionDeleteConfirmation(props: {
  key: string;
  opened: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const session = useAppSelector(selectAcademicsSchedule).classSession;

  const handleCloseDialog = (event: React.MouseEvent<HTMLElement>) => {
    props.onClose();
  };

  const handleClickDelete = (event: React.MouseEvent<HTMLElement>) => {
    try {
      AcademicSessionsSocket.deleteSessionEvent(session!.id!);
    } catch (error) {
      dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
      navigate("/home", { replace: true });
    }
  };

  return (
    <Dialog
      open={props.opened}
      onClose={handleCloseDialog}
      aria-labelledby="Confirmación de eliminación de clase"
    >
      <DialogTitle id="alert-dialog-title">Confirmación</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          ¿Estás seguro(a) de que deseas eliminar la clase seleccionada?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseDialog}
          autoFocus
          aria-label="Cancelar eliminación de clase"
          aria-required="true"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleClickDelete}
          aria-label="Aceptar eliminación de clase"
          aria-required="true"
        >
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
