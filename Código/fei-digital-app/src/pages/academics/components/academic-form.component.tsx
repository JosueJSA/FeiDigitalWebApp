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
import { Validator } from "../../../validations";

export function AcademicForm() {
  const [messages, setMessages] = useState(0);
  const [email, setEmail] = useState("");
  const [fullName, setName] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("Docente");
  const [status, setStatus] = useState("Disponible");
  const [code, setCode] = useState("");
  const [academicCode, setAcademicCode] = useState("");
  const academic = useAppSelector(selectAcademic);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [codeSend, setCodeSend] = useState(
    Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000
  );
  const [emailHelper, setEmailHelper] = useState({
    error: false,
    message: "",
  });
  const [nameHelper, setNameHelper] = useState({
    error: false,
    message: "",
  });
  const [passwordHelper, setPasswordHelper] = useState({
    error: false,
    message: "",
  });

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
    if (validate() && validateCode()) {
      if (code === codeSend.toString()) {
        try {
          AcademicSocket.addAcademicEvent(
            {
              email,
              fullName,
              password,
              position,
            },
            academicCode
          );
        } catch (error) {
          containError();
        }
      } else {
        dispatch(
          showToastError({ content: ["Código de verificación incorrecto"] })
        );
      }
    }
  };

  const handleUpdateAcademic = (event: React.MouseEvent<HTMLElement>) => {
    if (validate()) {
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
    }
  };

  const validate = (): boolean => {
    try {
      Validator.checkMail(email);
      Validator.checkName(fullName);
      Validator.checkPassword(password);
      return true;
    } catch (error: any) {
      dispatch(showToastError({ content: [error.message] }));
      return false;
    }
  };

  const validateCode = (): boolean => {
    try {
      if (
        academicCode === undefined ||
        academicCode === null ||
        academicCode.length <= 0
      )
        throw new Error("El código de registro debe ser llenado");
      return true;
    } catch (error: any) {
      dispatch(showToastError({ content: [error.message] }));
      return false;
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
    try {
      Validator.checkMail(event.target.value);
      emailHelper.error = false;
    } catch (error: any) {
      setEmailHelper({ error: true, message: error.message });
    }
  };

  const handleTypeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    try {
      Validator.checkName(event.target.value);
      nameHelper.error = false;
    } catch (error: any) {
      setNameHelper({ error: true, message: error.message });
    }
  };

  const handleTypePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    try {
      Validator.checkPassword(event.target.value);
      passwordHelper.error = false;
    } catch (error: any) {
      setPasswordHelper({ error: true, message: error.message });
    }
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

  const handleTypeAcademicCode = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAcademicCode(event.target.value);
  };

  return (
    <form>
      <Stack sx={{ color: "white" }} spacing={4} direction="column">
        <CustomTextField
          error={emailHelper.error}
          id="email"
          value={email}
          label="Correo electrónico"
          aria-label="Correo electrónico"
          aria-required="true"
          variant="outlined"
          onChange={handleTypeEmail}
          helperText={emailHelper.error ? emailHelper.message : ""}
        />
        <CustomTextField
          error={nameHelper.error}
          id="name"
          value={fullName}
          label="Nombre"
          aria-label="Nombre"
          aria-required="true"
          variant="outlined"
          onChange={handleTypeName}
          helperText={nameHelper.error ? nameHelper.message : ""}
        />
        <CustomTextField
          error={passwordHelper.error}
          id="password"
          value={password}
          label="Contraseña"
          aria-label="Contraseña"
          aria-required="true"
          type="password"
          autoComplete="current-password"
          onChange={handleTypePassword}
          helperText={passwordHelper.error ? passwordHelper.message : ""}
        />
        {localStorage.getItem("access_token") ? (
          ""
        ) : (
          <CustomTextField
            id="adminCode"
            value={academicCode}
            label="Codigo de académico"
            aria-label="Código de académico"
            aria-required="true"
            autoComplete="current-password"
            onChange={handleTypeAcademicCode}
          />
        )}
        <FormControl fullWidth>
          <InputLabel sx={{ color: "white" }} id="demo-simple-select-label">
            Cargo en la FEI
          </InputLabel>
          <Select
            sx={{ color: "white" }}
            labelId="demo-simple-select-label"
            id="feiposition"
            label="Cargo en la FEI"
            aria-label="Cargo en la FEI"
            aria-required="true"
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
            aria-label="Estado"
            aria-required="true"
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
                aria-label="Enviar email"
                aria-required="true"
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
                aria-label="Código de verificación"
                aria-required="true"
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
            aria-label="Actualiar estudiante"
            aria-required="true"
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
            aria-label="Agregar estudiante"
            aria-required="true"
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
  );
}
