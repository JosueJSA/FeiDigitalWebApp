import {
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addPage } from "../../shared/breadcrumns/breadcrumbsSlice";
import { Toaster } from "../../shared/toast/toaster.component";
import { showToastError } from "../../shared/toast/toastSlice";
import { AcademicSocket } from "./academic-socket.manager";
import { selectAcademic, setAcademic } from "./academicSlice";
import { errorEvent, getShortAcademicEvent } from "./constants";

export function AcademicShortDetails() {
  const { id } = useParams();
  const academic = useAppSelector(selectAcademic);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      dispatch(addPage({ name: "Académico", url: location.pathname }));
      const socket = AcademicSocket.getInstanceWithToken();
      getAcademic();
      socket.on(getShortAcademicEvent, getAcademicListener);
      socket.on(errorEvent, errorListener);
      return () => {
        socket.off(getShortAcademicEvent);
        socket.off(errorEvent);
      };
    } catch (error) {
      containError();
    }
  }, [id]);

  const containError = () => {
    dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
    navigate("/home", { replace: true });
  };

  const getAcademic = () => {
    AcademicSocket.getShortAcademicEvent(id as string);
  };

  const getAcademicListener = (event: any) => {
    dispatch(setAcademic(event));
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
    <Container maxWidth="sm" sx={{ my: "3rem", textAlign: "justify" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: 100 }}
        exit={{ opacity: 0 }}
      >
        <Card elevation={8} sx={{ backgroundColor: "#171D2C" }}>
          <CardContent>
            <Typography variant="h4" sx={{ color: "white" }}>
              Académico
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "white", my: ".3rem", mb: "1.5rem" }}
            >
              La información se actualizará automáticamente cuando se detecten
              cambios.
            </Typography>
            <Divider sx={{ mb: "1.5rem", backgroundColor: "#E94560" }} />
            <Typography
              variant="body1"
              sx={{ color: "white", my: ".3rem", mb: "1.5rem" }}
            >
              Nombre: {academic.fullName} <br />
              Correo electrónico: {academic.email} <br />
              Estado: {academic.status} <br />
              Puesto en FEI: {academic.position} <br />
              Ubicación: {academic.feiLocationCode} <br />
              última actualización:{" "}
              {new Date(
                academic.updated ? academic.updated : new Date()
              ).toLocaleDateString()}{" "}
              <br />
            </Typography>
          </CardContent>
          <CardActions></CardActions>
        </Card>
      </motion.div>
      <Toaster />
    </Container>
  );
}
