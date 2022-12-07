import {
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { setPage } from "../../shared/breadcrumns/breadcrumbsSlice";
import { setAcademicSession } from "../../shared/navbar/navbarSlice";
import { LocalSession } from "../../shared/session";
import { Toaster } from "../../shared/toast/toaster.component";
import {
  showToastError,
  showToastSuccess,
} from "../../shared/toast/toastSlice";
import { AcademicSocket } from "./academic-socket.manager";
import { AcademicForm } from "./components/academic-form.component";
import { addAcademicEvent, errorEvent } from "./constants";

export function AcademicSignUp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      dispatch(setPage({ name: "Registro", url: location.pathname }));
      const socket = AcademicSocket.getInstance();
      socket.on(addAcademicEvent, addAcademicListener);
      socket.on(errorEvent, errorListener);
      return () => {
        socket.off(addAcademicEvent);
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

  const addAcademicListener = (event: any) => {
    setSession(event);
    dispatch(setAcademicSession({ id: event.id, name: event.fullName }));
    navigate("/home", { replace: true });
  };

  const setSession = (event: any) => {
    LocalSession.setSession({
      id: event.id,
      name: event.fullName,
      token: event.token,
      type: "Académico",
    });
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
    <Container maxWidth="xs" sx={{ mb: "10rem", textAlign: "left" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: 20 }}
        exit={{ opacity: 0 }}
      >
        <Card
          elevation={8}
          sx={{ padding: "1rem", backgroundColor: "#171D2C" }}
        >
          <CardContent>
            <Typography variant="h5" component="h1" sx={{ color: "white" }}>
              Registro de académico
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "white", my: ".3rem", mb: "3rem" }}
            >
              Por favor, llena los campos correspondientes a tu cuenta como
              académico
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
