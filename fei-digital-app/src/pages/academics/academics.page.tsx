import {
  Alert,
  AlertTitle,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addPage } from "../../shared/breadcrumns/breadcrumbsSlice";
import { Toaster } from "../../shared/toast/toaster.component";
import { showToastError } from "../../shared/toast/toastSlice";
import { AcademicSocket } from "./academic-socket.manager";
import {
  selectAcademicsList,
  setAcademicsList,
  setEmptyAcademicState,
} from "./academicSlice";
import AcademicCard from "./components/academic-card.component";
import AcademicsSearchBar from "./components/academic-search-bar.component";
import { errorEvent, searchAcademicsEvent } from "./constants";

export function Academics() {
  const [messages, setMessages] = useState(0);
  const academicsList = useAppSelector(selectAcademicsList);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      dispatch(addPage({ name: "Academicos", url: location.pathname }));
      const socket = AcademicSocket.getInstanceWithToken();
      socket.on(searchAcademicsEvent, searchAcademicsListener);
      socket.on(errorEvent, errorListener);
      return () => {
        socket.off(searchAcademicsEvent);
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

  const searchAcademicsListener = (event: any) => {
    dispatch(setAcademicsList(event));
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
    <Container maxWidth={"md"} sx={{ my: "6rem" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: [-100, 30, 0] }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0 }}
      >
        <Typography
          sx={{ color: "white", textAlign: "left", mb: "1.5rem" }}
          component="h2"
          variant="h4"
        >
          Académicos
        </Typography>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [-100, 30, 0] }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0 }}
      >
        <AcademicsSearchBar />
      </motion.div>
      <Divider sx={{ my: "2rem", mb: "2rem", backgroundColor: "#31E1F7" }} />
      <Stack spacing={2}>
        {academicsList.length > 0 ? (
          academicsList.map((academic) => (
            <motion.div
              key={academic.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [100, -30, 0] }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0 }}
            >
              <AcademicCard key={academic.id!} academic={academic} />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            exit={{ opacity: 0 }}
          >
            <Alert severity="info" sx={{ textAlign: "left" }}>
              <AlertTitle>Sin resultados</AlertTitle>
              No hay resultados para mostrar de acuerdo a la búsqueda
            </Alert>
          </motion.div>
        )}
      </Stack>
      <Toaster />
    </Container>
  );
}
