import {
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { addPage } from "../../shared/breadcrumns/breadcrumbsSlice";
import { Toaster } from "../../shared/toast/toaster.component";
import {
  showToastError,
  showToastSuccess,
} from "../../shared/toast/toastSlice";
import { AcademicSocket } from "./academic-socket.manager";
import { setAcademic, setEmptyAcademicState } from "./academicSlice";
import { AcademicForm } from "./components/academic-form.component";
import { errorEvent, getAcademicEvent, updateAcademicEvent } from "./constants";

export function AcademicEdition() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      dispatch(addPage({ name: "Edición de perfíl", url: location.pathname }));
      const socket = AcademicSocket.getInstanceWithToken();
      getAcademic();
      socket.on(getAcademicEvent, getAcademicListener);
      socket.on(updateAcademicEvent, updateAcademicListener);
      socket.on(errorEvent, errorListener);
      return () => {
        socket.off(getAcademicEvent);
        socket.off(updateAcademicEvent);
        socket.off(errorEvent);
      };
    } catch (error) {
      containError();
    }
  });

  const containError = () => {
    dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
    navigate("/home", { replace: true });
  };

  const getAcademic = () => {
    AcademicSocket.getAcademicEvent(id as string);
  };

  const getAcademicListener = (event: any) => {
    dispatch(setAcademic(event));
  };

  const updateAcademicListener = (event: any) => {
    dispatch(setAcademic(event));
    dispatch(showToastSuccess("Cambios guardados exitosamente!"));
    navigate("/home", { replace: true });
  };

  const errorListener = (event: any) => {
    const error: Array<string> = event.error;
    if (error.indexOf("No autorizado") >= 0) {
      navigate("/login", { replace: true });
      dispatch(showToastError({ content: ["Tu sesión ha expirado"] }));
    } else {
      dispatch(showToastError({ content: error }));
    }
  };

  return (
    <Container maxWidth="xs" sx={{ textAlign: "left", mb: "10rem" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: 20 }}
        exit={{ opacity: 0 }}
      >
        <Card elevation={8} sx={{ backgroundColor: "#171D2C" }}>
          <CardContent>
            <Typography component="h1" variant="h4" sx={{ color: "white" }}>
              Actualización de académico
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "white", my: ".3rem", mb: "3rem" }}
            >
              Modifica los campos y guarda tus cambios
            </Typography>
            <AcademicForm />
          </CardContent>
          <CardActions></CardActions>
        </Card>
      </motion.div>
      <Toaster />
    </Container>
  );
}
