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
import { BreadcrumbsNav } from "../../shared/breadcrumns/breadcrumbs.component";
import { addPage } from "../../shared/breadcrumns/breadcrumbsSlice";
import { LocalSession } from "../../shared/session";
import { Toaster } from "../../shared/toast/toaster.component";
import { showToastError } from "../../shared/toast/toastSlice";
import { getStudentAsync, selectStudent } from "./studentSlice";

export function StudentDetails() {
  const { id } = useParams();
  const student = useAppSelector(selectStudent);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      dispatch(addPage({ name: "Mi perfil", url: location.pathname }));
      if (id) {
        const getDetails = async () => {
          await fetchStudent();
        };
        getDetails();
      }
    } catch (error) {
      containError();
    }
  }, [id]);

  const containError = () => {
    dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
    navigate("/home", { replace: true });
  };

  const fetchStudent = async () => {
    try {
      const response = await dispatch(
        getStudentAsync({
          studentId: id!,
          auth: LocalSession.getSession().token,
        })
      );
      if (response.payload.message === "Unauthorized") {
        dispatch(showToastError({ content: ["Tu sesión ha expirado"] }));
        navigate("/login", { replace: true });
      } else if (
        response.payload.statusCode < 2000 ||
        response.payload.statusCode > 299
      ) {
        dispatch(showToastError({ content: response.payload.message }));
      }
    } catch (error) {
      containError();
    }
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "left", mb: "10rem" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: 20 }}
        exit={{ opacity: 0 }}
      >
        <Card elevation={8} sx={{ backgroundColor: "#171D2C" }}>
          <CardContent>
            <Typography component="h1" variant="h4" sx={{ color: "white" }}>
              Estudiante
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "white", my: ".3rem", mb: "1.5rem" }}
            >
              La información mostrada solo podrá ser vista por el personal
              académico y tú.
            </Typography>
            <Divider sx={{ mb: "1.5rem", backgroundColor: "#E94560" }} />
            <Typography
              variant="body1"
              sx={{ color: "white", my: ".3rem", mb: "1.5rem" }}
            >
              Nombre: {student.name} <br />
              Correo electrónico: {student.email} <br />
              Contraseña: {student.password} <br />
              Estado: {student.status} <br />
              última actualización:{" "}
              {new Date(student.updated!).toLocaleDateString()} <br />
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
      <Toaster />
    </Container>
  );
}
