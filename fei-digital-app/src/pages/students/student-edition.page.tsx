import {
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { addPage } from "../../shared/breadcrumns/breadcrumbsSlice";
import { LocalSession } from "../../shared/session";
import { Toaster } from "../../shared/toast/toaster.component";
import { showToastError } from "../../shared/toast/toastSlice";
import { StudentForm } from "./components/student-form.component";
import { getStudentAsync } from "./studentSlice";

export function StudentEdition() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      dispatch(addPage({ name: "Edición de perfíl", url: location.pathname }));
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

  const containError = () => {
    dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
    navigate("/home", { replace: true });
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "justify" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: 100 }}
        exit={{ opacity: 0 }}
      >
        <Card
          elevation={8}
          sx={{ padding: "1rem", backgroundColor: "#171D2C" }}
        >
          <CardContent>
            <Typography variant="h4" sx={{ color: "white" }}>
              Actualización de estudiante
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "white", my: ".3rem", mb: "3rem" }}
            >
              Modifica los campos y guarda tus cambios
            </Typography>
            <StudentForm />
          </CardContent>
          <CardActions></CardActions>
        </Card>
      </motion.div>
      <Toaster />
    </Container>
  );
}
