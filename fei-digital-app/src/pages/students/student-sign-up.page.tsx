import {
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { setPage } from "../../shared/breadcrumns/breadcrumbsSlice";
import { Toaster } from "../../shared/toast/toaster.component";
import { StudentForm } from "./components/student-form.component";

export function StudentSignUp() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPage({ name: "Registro", url: location.pathname }));
  });

  return (
    <Container maxWidth="sm" sx={{ textAlign: "left", mb: "10rem" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: 20 }}
        exit={{ opacity: 0 }}
      >
        <Card
          elevation={8}
          sx={{ backgroundColor: "#171D2C", padding: "1rem" }}
        >
          <CardContent>
            <Typography component="h1" variant="h4" sx={{ color: "white" }}>
              Registro de estudiante
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "white", my: ".3rem", mb: "3rem" }}
            >
              Por favor, llena los campos correspondientes a tu cuenta como
              estudiante
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
