import {
  Button,
  Card,
  Checkbox,
  Divider,
  Drawer,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectAcademicsSchedule } from "../academicsScheduleSlice";
import { Stack } from "@mui/system";
import { FeiMapEconexFirst } from "../../common/econex/fei-map-econex-first.component/fei-map-econex-first.component";
import { CustomTextField } from "../../../../styles";
import { Toaster } from "../../../../shared/toast/toaster.component";
import { FeiMapEconexSecond } from "../../common/econex/fei-map-econex-second.component/fei-map-econex-second.component";
import { AcademicSessionsSocket } from "../academic-sessions-socket.manager";
import { useNavigate } from "react-router-dom";
import { showToastError } from "../../../../shared/toast/toastSlice";
import { Validator } from "../../../../validations";

export function ClassSessionForm(props: { key: string; type: string }) {
  const [alignment, setAlignment] = React.useState<string>("econex-first");
  const [date, setDate] = useState<Dayjs | null>(dayjs(Date.now()));
  const [limitDate, setLimitDate] = useState<Dayjs | null>(dayjs(Date.now()));
  const [initialTime, setInitialTime] = useState<Dayjs | null>(
    dayjs(Date.now())
  );
  const [endTime, setEndTime] = React.useState<Dayjs | null>(dayjs(Date.now()));
  const [classroom, setClassroom] = useState("A113");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(0);
  const [checked, setChecked] = useState(false);
  const course = useAppSelector(selectAcademicsSchedule).course;
  const session = useAppSelector(selectAcademicsSchedule).classSession;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fillFields();
  }, [session]);

  const fillFields = () => {
    if (props.type === "update" && messages === 0) {
      if (session && session?.id !== "") {
        setDate(dayjs(session.classDate));
        setLimitDate(dayjs(session.classDateEnd));
        setClassroom(session.classroomCode!);
        setChecked(session.repeated!);
        setInitialTime(dayjs(session.initialTime));
        setEndTime(dayjs(session.endTime));
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleDateSelection = (newValue: Dayjs | null) => {
    setDate(newValue);
  };

  const validate = (): boolean => {
    try {
      Validator.checkSessionDates(date!.toDate(), limitDate!.toDate(), checked);
      Validator.checkTimes(initialTime!.toDate(), endTime!.toDate());
      return true;
    } catch (error: any) {
      dispatch(showToastError({ content: [error.message] }));
      return false;
    }
  };

  const handleLimitDateSelection = (newValue: Dayjs | null) => {
    setLimitDate(newValue);
  };

  const handleInitialTimeSelection = (newValue: Dayjs | null) => {
    setInitialTime(newValue);
  };

  const handleEndTimeSelection = (newValue: Dayjs | null) => {
    setEndTime(newValue);
  };

  const handleAddClassSession = (event: React.MouseEvent<HTMLElement>) => {
    if (validate()) {
      try {
        AcademicSessionsSocket.addClassSessionEvent({
          id: "identifier",
          classDate: date!.toDate().toISOString(),
          initialTime: initialTime!.toDate().toISOString(),
          endTime: endTime!.toDate().toISOString(),
          repeated: checked,
          courseNrc: course!.nrc,
          classroomCode: classroom,
          classDateEnd: limitDate!.toDate().toISOString(),
          classroomName: "",
        });
      } catch (error) {
        dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
        navigate("/home", { replace: true });
      }
    }
  };

  const handleUpdateSession = (event: React.MouseEvent<HTMLElement>) => {
    if (validate()) {
      try {
        AcademicSessionsSocket.updateClassSessionEvent(session!.id!, {
          id: "identifier",
          classDate: date!.toDate().toISOString(),
          initialTime: initialTime!.toDate().toISOString(),
          endTime: endTime!.toDate().toISOString(),
          repeated: checked,
          courseNrc: course!.nrc,
          classroomCode: classroom,
          classDateEnd: limitDate!.toDate().toISOString(),
          classroomName: "",
        });
      } catch (error) {
        dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
        navigate("/home", { replace: true });
      }
    }
  };

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setIsOpen(open);
    };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  const selectClassroom = (code: string) => {
    setClassroom(code);
  };

  return (
    <form>
      <Card
        elevation={6}
        sx={{
          backgroundColor: "#171D2C",
          color: "white",
          padding: "2rem",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <DesktopDatePicker
                label="Fecha de clase"
                inputFormat="MM/DD/YYYY"
                value={date}
                onChange={handleDateSelection}
                renderInput={(params) => (
                  <CustomTextField
                    id="startDate"
                    aria-label="Fecha de clase"
                    aria-required="true"
                    sx={{ display: "flex" }}
                    {...params}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TimePicker
                label="Hora de inicio"
                value={initialTime}
                onChange={handleInitialTimeSelection}
                renderInput={(params) => (
                  <CustomTextField
                    id="initTime"
                    aria-label="Horaa de inicio"
                    aria-required="true"
                    {...params}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TimePicker
                label="Hora de fin"
                value={endTime}
                onChange={handleEndTimeSelection}
                renderInput={(params) => (
                  <CustomTextField
                    id="endTime"
                    aria-label="Hora de fin de clase"
                    aria-required="true"
                    {...params}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                id="location"
                aria-label="Ver ubicación"
                aria-required="true"
                color="info"
                onClick={toggleDrawer(true)}
                sx={{ display: "flex", minWidth: "maxWidth" }}
                variant="outlined"
              >
                Seleccionar ubicación
              </Button>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "left", my: ".5rem" }}>
              <Typography>Aula: {classroom}</Typography>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "left" }}>
              <FormGroup>
                <FormControlLabel
                  aria-label="Repetir clase"
                  aria-required="true"
                  control={
                    <Checkbox checked={checked} onChange={handleChange} />
                  }
                  label="Repetir clase"
                />
                <DesktopDatePicker
                  label="Hasta el"
                  inputFormat="MM/DD/YYYY"
                  value={limitDate}
                  onChange={handleLimitDateSelection}
                  renderInput={(params) => (
                    <CustomTextField
                      id="limitDate"
                      aria-label="Fecha limite de clases"
                      aria-required="true"
                      sx={{ display: checked ? "flex" : "none" }}
                      {...params}
                    />
                  )}
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", my: "1rem" }}>
              {props.type === "update" ? (
                <Button
                  id="saveButton"
                  aria-label="Actualizar clase"
                  aria-required="true"
                  variant="contained"
                  onClick={handleUpdateSession}
                  sx={{
                    backgroundColor: "#31E1F7",
                    display: "flex",
                    color: "black",
                    "&:hover": { backgroundColor: "#D800A6", color: "white" },
                  }}
                >
                  Guardar cambios
                </Button>
              ) : (
                <Button
                  id="addButton"
                  aria-label="Registrar clase"
                  aria-required="true"
                  variant="contained"
                  onClick={handleAddClassSession}
                  sx={{
                    backgroundColor: "#31E1F7",
                    display: "flex",
                    color: "black",
                    "&:hover": { backgroundColor: "#D800A6", color: "white" },
                  }}
                >
                  Agregar clase
                </Button>
              )}
            </Grid>
          </Grid>
          <Drawer anchor={"bottom"} open={isOpen} onClose={toggleDrawer(false)}>
            <Grid sx={{ margin: "1rem" }} container>
              <Stack direction={"row"}>
                <Typography component={"h2"} variant="body1">
                  Selecciona el aula de clase
                </Typography>
                <Button
                  aria-label="Cerrar croquis"
                  aria-required="true"
                  onClick={toggleDrawer(false)}
                  variant="contained"
                >
                  Cerrar
                </Button>
              </Stack>
              <Divider />
              <Grid container>
                <Grid item xs={6} sx={{ display: "flex" }}>
                  <ToggleButtonGroup
                    value={alignment}
                    exclusive
                    onChange={handleAlignment}
                    aria-label="Planta baja"
                    aria-required="true"
                  >
                    <ToggleButton
                      value="econex-first"
                      aria-label="left aligned"
                    >
                      <Typography component="h3" variant="h6">
                        Econex - Primera planta
                      </Typography>
                    </ToggleButton>
                    <ToggleButton
                      value="econex-second"
                      aria-label="Planta alta"
                      aria-required="true"
                    >
                      <Typography component="h3" variant="h6">
                        Econex - Segunda planta
                      </Typography>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid item xs={12}>
                  {alignment === "econex-first" ? (
                    <Paper elevation={24} sx={{ margin: "3rem" }}>
                      <FeiMapEconexFirst
                        key="econex_first"
                        onClose={closeDrawer}
                        selectclassroom={selectClassroom}
                        classroom={classroom}
                      />
                    </Paper>
                  ) : (
                    <Paper elevation={24} sx={{ margin: "3rem" }}>
                      <FeiMapEconexSecond
                        key="econex_second"
                        onClose={closeDrawer}
                        selectclassroom={selectClassroom}
                        classroom={classroom}
                      />
                    </Paper>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Drawer>
        </LocalizationProvider>
        <Toaster />
      </Card>
    </form>
  );
}
