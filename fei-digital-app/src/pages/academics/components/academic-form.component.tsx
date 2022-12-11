import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { CustomTextField } from "../../../styles";
import { AcademicSocket } from "../academic-socket.manager";
import { selectAcademic } from "../academicSlice";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";
import {
  showToastError,
  showToastSuccess,
} from "../../../shared/toast/toastSlice";
import { useNavigate } from "react-router-dom";

export function AcademicForm() {
  const [messages, setMessages] = useState(0);
  const [email, setEmail] = useState("");
  const [fullName, setName] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("Docente");
  const [status, setStatus] = useState("Disponible");
  const [code, setCode] = useState("");
  const [codeSend, setCodeSend] = useState(
    Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000
  );
  const academic = useAppSelector(selectAcademic);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (messages === 0) setAcademicData();
  }, [academic.id]);

  const setAcademicData = () => {
    setEmail(academic.email!);
    setName(academic.fullName!);
    setPassword(academic.password!);
    setPosition(academic.position!);
    setStatus(academic.status!);
  };

  const containError = () => {
    dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
    navigate("/home", { replace: true });
  };

  const handleAddAcademic = (event: React.MouseEvent<HTMLElement>) => {
    if (code === codeSend.toString()) {
      try {
        AcademicSocket.addAcademicEvent({
          email,
          fullName,
          password,
          position,
        });
      } catch (error) {
        containError();
      }
    } else {
      dispatch(
        showToastError({ content: ["Código de verificación incorrecto"] })
      );
    }
  };

  const handleUpdateAcademic = (event: React.MouseEvent<HTMLElement>) => {
    try {
      AcademicSocket.updateAcademicEvent(academic.id!, {
        email,
        fullName,
        password,
        position,
        status,
      });
      setMessages(messages);
    } catch (error) {
      containError();
    }
  };

  const sendEmail = async () => {
    const message = await emailjs.send(
      "service_q1f8n7k",
      "template_qre9qlr",
      { code: codeSend, email: email },
      "T8uVeJ0z8QKtpDW0y"
    );
    if (message.status !== 200)
      dispatch(showToastError({ content: ["El correo no puede ser enviado"] }));
    else dispatch(showToastSuccess("Código de verificación enviado al correo"));
  };

  const handleSendMail = async () => {
    await sendEmail();
  };

  const handleTypeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCodeSend(Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000);
    setEmail(event.target.value);
  };

  const handleTypeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleTypePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleTypeCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  const handlePositionSelection = (event: SelectChangeEvent) => {
    setPosition(event.target.value);
  };

  const handleStatusSelection = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  return (
    <div>
      <form>
        <Stack sx={{ color: "white" }} spacing={4} direction="column">
          <CustomTextField
            id="email"
            value={email}
            label="Correo electrónico"
            variant="outlined"
            onChange={handleTypeEmail}
          />
          <CustomTextField
            id="name"
            value={fullName}
            label="Nombre"
            variant="outlined"
            onChange={handleTypeName}
          />
          <CustomTextField
            id="password"
            value={password}
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            onChange={handleTypePassword}
          />
          <FormControl fullWidth>
            <InputLabel sx={{ color: "white" }} id="demo-simple-select-label">
              Cargo en la FEI
            </InputLabel>
            <Select
              sx={{ color: "white" }}
              labelId="demo-simple-select-label"
              id="feiposition"
              label="Cargo en la FEI"
              value={position}
              onChange={handlePositionSelection}
            >
              <MenuItem value={"Secretariado"}>Secretariado</MenuItem>
              <MenuItem value={"Docente"}>Docente</MenuItem>
              <MenuItem value={"Dirección"}>Dirección</MenuItem>
              <MenuItem value={"Coordinación"}>Coordinación</MenuItem>
              <MenuItem value={"Vinculación"}>Vinculación</MenuItem>
              <MenuItem value={"Subdirección"}>Subdirección</MenuItem>
              <MenuItem value={"Tutorado"}>Tutorado</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            sx={{ display: localStorage.getItem("id") ? "flex" : "none" }}
            fullWidth
          >
            <InputLabel sx={{ color: "#00B8DD" }} id="status-label">
              Estado en la aplicación
            </InputLabel>
            <Select
              sx={{ color: "white" }}
              labelId="status-label"
              id="status-select"
              label="Estado en la aplicación"
              value={status}
              onChange={handleStatusSelection}
            >
              <MenuItem value={"Disponible"}>Disponible</MenuItem>
              <MenuItem value={"Ocupado"}>Ocupado</MenuItem>
              <MenuItem value={"Inhábil"}>Inhábil</MenuItem>
            </Select>
          </FormControl>
          {!localStorage.getItem("access_token") ? (
            <Grid container>
              <Grid item md={4} xs={12}>
                <Button
                  id="sendButton"
                  onClick={handleSendMail}
                  variant="contained"
                  sx={{
                    backgroundColor: "#31E1F7",
                    color: "black",
                    width: "100%",
                    height: "100%",
                    "&:hover": { backgroundColor: "#D800A6", color: "white" },
                  }}
                  startIcon={<ForwardToInboxIcon />}
                >
                  Enviar
                </Button>
              </Grid>
              <Grid item md={8} xs={12}>
                <CustomTextField
                  sx={{ display: "flex" }}
                  value={code}
                  placeholder="Escribe el código de verificación"
                  autoComplete="current-password"
                  onChange={handleTypeCode}
                />
              </Grid>
            </Grid>
          ) : (
            ""
          )}
          {localStorage.getItem("access_token") ? (
            <Button
              id="saveButton"
              variant="contained"
              onClick={handleUpdateAcademic}
              sx={{
                backgroundColor: "#31E1F7",
                color: "black",
                "&:hover": { backgroundColor: "#D800A6", color: "white" },
              }}
            >
              Guardar cambios
            </Button>
          ) : (
            <Button
              id="addButton"
              variant="contained"
              onClick={handleAddAcademic}
              sx={{
                backgroundColor: "#31E1F7",
                color: "black",
                "&:hover": { backgroundColor: "#D800A6", color: "white" },
              }}
            >
              Registrarme
            </Button>
          )}
        </Stack>
      </form>
    </div>
  );
}
