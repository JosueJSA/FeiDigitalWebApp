import {
  Alert,
  AlertTitle,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addPage } from "../../shared/breadcrumns/breadcrumbsSlice";
import { LocalSession } from "../../shared/session";
import { Toaster } from "../../shared/toast/toaster.component";
import StudentCard from "./components/student-card.component";
import StudentsSearchBar from "./components/students-search-bar.component";
import { selectStudentList } from "./studentSlice";

export function Students() {
  const studentList = useAppSelector(selectStudentList);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!LocalSession.isLogged()) navigate(`/home`, { replace: true });
    dispatch(addPage({ name: "Estudiantes", url: location.pathname }));
  });

  return (
    <Container maxWidth={"md"} sx={{ mb: "10rem" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: [-100, 30, 0] }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0 }}
      >
        <Typography
          sx={{ color: "white", textAlign: "left", mb: "1.5rem" }}
          component="h1"
          variant="h4"
        >
          Estudiantes
        </Typography>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [-100, 30, 0] }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0 }}
      >
        <StudentsSearchBar />
      </motion.div>
      <Divider sx={{ my: "2rem", mb: "2rem", backgroundColor: "#31E1F7" }} />
      <Stack spacing={2}>
        {studentList.length > 0 ? (
          studentList.map((student) => (
            <motion.div
              key={student.id!}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 20 }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0 }}
            >
              <StudentCard key={student.id!} student={student} />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
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
