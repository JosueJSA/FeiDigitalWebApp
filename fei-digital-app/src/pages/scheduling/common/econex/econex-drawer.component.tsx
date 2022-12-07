import {
  Button,
  Container,
  Divider,
  Drawer,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { FeiMapEconexFirst } from "./fei-map-econex-first.component/fei-map-econex-first.component";
import { FeiMapEconexSecond } from "./fei-map-econex-second.component/fei-map-econex-second.component";

const lowLevel = [
  "A113",
  "A112",
  "A111",
  "A219",
  "A108",
  "A107",
  "A106",
  "A105",
  "A104",
  "A103",
  "A102",
  "A101",
];

const hightLevel = [
  "A213",
  "A212",
  "A207",
  "A206",
  "A205",
  "A204",
  "A203",
  "A202",
  "A201",
  "A216",
  "A217",
  "A215",
  "A01",
  "A03",
  "S4",
  "S5",
  "S6",
  "cc4",
  "cc3",
  "cc2",
  "cc1",
];

export function EconexDrawer(props: {
  key: string;
  classroomCode: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const toggleDrawer = (open: boolean) => (event: React.MouseEvent) => {
    props.onClose();
  };

  const handleClose = () => {
    props.onClose();
  };

  const selectClassroom = (code: string) => {};

  return (
    <Drawer anchor={"bottom"} open={props.isOpen} onClose={toggleDrawer(false)}>
      <Grid sx={{ margin: "1rem" }} container>
        <Stack
          sx={{ width: "100%" }}
          direction={"row"}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography sx={{ ml: "3rem" }} variant="h5">
            Ubicación de aula de clase
          </Typography>
          <Button
            sx={{ mr: "3rem" }}
            onClick={toggleDrawer(false)}
            variant="contained"
          >
            Cerrar
          </Button>
        </Stack>
        <Divider />
        <Grid item xs={12}>
          {lowLevel.find((code) => code === props.classroomCode) !==
          undefined ? (
            <Paper elevation={24} sx={{ margin: "3rem" }}>
              <Typography>Planta baja</Typography>
              <FeiMapEconexFirst
                key="econex_first"
                onClose={handleClose}
                selectclassroom={selectClassroom}
                classroom={props.classroomCode}
              />
            </Paper>
          ) : (
            <Paper elevation={24} sx={{ margin: "3rem" }}>
              <Typography>Planta alta</Typography>
              <FeiMapEconexSecond
                key="econex_second"
                onClose={handleClose}
                selectclassroom={selectClassroom}
                classroom={props.classroomCode}
              />
            </Paper>
          )}
        </Grid>
      </Grid>
    </Drawer>
  );
}
