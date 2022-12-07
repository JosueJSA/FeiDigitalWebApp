import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { setPage } from "../breadcrumns/breadcrumbsSlice";
import { Toaster } from "../toast/toaster.component";

export function Home() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(setPage({ name: "Inicio", url: location.pathname }));
  });

  return (
    <Container maxWidth={"lg"} sx={{ my: "5rem" }}>
      <Grid container>
        <Grid item sm={6} xs={12}>
          <Stack sx={{ padding: "1.5rem" }} direction={"column"} spacing={2}>
            <motion.div
              key={"mis_clases"}
              whileHover={{ scale: [null, 1.2, 1.1] }}
              transition={{ duration: 0.3 }}
            >
              <Card
                elevation={24}
                sx={{
                  textAlign: "justify",
                  backgroundColor: "#171D2C",
                  color: "white",
                }}
              >
                <CardActionArea>
                  <CardMedia
                    sx={{ display: "none" }}
                    component="img"
                    height="140"
                    image="/static/images/cards/contemplative-reptile.jpg"
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      MIS CLASES
                    </Typography>
                    <Typography variant="body2">
                      Puedes ver cuándo y dónde se llevará a cabo una clase en
                      la cual participas
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </motion.div>
            <motion.div
              key={"mi_horario"}
              whileHover={{ scale: [null, 1.2, 1.1] }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  textAlign: "justify",
                  backgroundColor: "#171D2C",
                  color: "white",
                }}
              >
                <CardActionArea>
                  <CardMedia
                    sx={{ display: "none" }}
                    component="img"
                    height="140"
                    image="/static/images/cards/contemplative-reptile.jpg"
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      MI HORARIO
                    </Typography>
                    <Typography variant="body2">
                      Consulta y personaliza las clases de tus cursos para que
                      tus estudiantes conozcan cuándo habrá clases y dónde
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </motion.div>
            <motion.div
              key={"academicos"}
              whileHover={{ scale: [null, 1.2, 1.1] }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  textAlign: "justify",
                  backgroundColor: "#171D2C",
                  color: "white",
                }}
              >
                <CardActionArea>
                  <CardMedia
                    sx={{ display: "none" }}
                    component="img"
                    height="140"
                    image="/static/images/cards/contemplative-reptile.jpg"
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      ACADÉMICOS
                    </Typography>
                    <Typography variant="body2">
                      Puedes buscar al personal académico para ubicarlo y
                      completar tus trámites o consultar dudas
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </motion.div>
            <motion.div
              key={"students"}
              whileHover={{ scale: [null, 1.2, 1.1] }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  textAlign: "justify",
                  backgroundColor: "#171D2C",
                  color: "white",
                }}
              >
                <CardActionArea>
                  <CardMedia
                    sx={{ display: "none" }}
                    component="img"
                    height="140"
                    image="/static/images/cards/contemplative-reptile.jpg"
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      ESTUDIANTES
                    </Typography>
                    <Typography variant="body2">
                      Puedes consultar la lista de estudiantes para consultar su
                      información y actualizar sus datos
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </motion.div>
          </Stack>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Stack sx={{ padding: "1.5rem" }} direction={"column"} spacing={3}>
            <motion.div
              key={"course_searching"}
              whileHover={{ scale: [null, 1.2, 1.1] }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  textAlign: "justify",
                  backgroundColor: "#171D2C",
                  color: "white",
                }}
              >
                <CardActionArea>
                  <CardMedia
                    sx={{ display: "none" }}
                    component="img"
                    height="140"
                    image=""
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      BUSCAR CURSOS
                    </Typography>
                    <Typography variant="body2">
                      Encuentra los cursos para poder subscribirte a ellos y ver
                      las sus clases sin tener que buscarlas
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </motion.div>
            <motion.div
              key={"watch"}
              whileHover={{ scale: [null, 1.2, 1.1] }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  textAlign: "justify",
                  backgroundColor: "#171D2C",
                  color: "white",
                }}
              >
                <CardActionArea>
                  <CardMedia
                    sx={{ display: "none" }}
                    component="img"
                    height="140"
                    image=""
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      VER FEI
                    </Typography>
                    <Typography variant="body2">
                      Consulta tu facultad para buscar un salón y ver si esta en
                      clases o no
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </motion.div>
          </Stack>
        </Grid>
      </Grid>
      <Toaster />
    </Container>
  );
}
