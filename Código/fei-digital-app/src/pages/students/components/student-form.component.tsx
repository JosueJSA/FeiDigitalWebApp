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
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  showToastError,
  showToastSuccess,
} from "../../../shared/toast/toastSlice";
import { CustomTextField } from "../../../styles";
import {
  addStudentAsync,
  selectStudent,
  updateStudentAsync,
} from "../studentSlice";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import emailjs from "@emailjs/browser";
import { setStudntName } from "../../../shared/navbar/navbarSlice";
import { LocalSession } from "../../../shared/session";
import { Validator } from "../../../validations";

export function StudentForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Disponible");
  const [code, setCode] = useState("");
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
  const [codeSend, setCodeSend] = useState(
    Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000
  );

  const dispatch = useAppDispatch();
  const student = useAppSelector(selectStudent);
  const navigate = useNavigate();

  useEffect(() => {
    setEmail(student.email!);
    setName(student.name!);
    setPassword(student.password!);
    setStatus(student.status!);
  }, [student.id]);

  const handleAddStudent = async () => {
    if (validate()) {
      try {
        if (code === codeSend.toString()) {
          const response = await dispatch(
            addStudentAsync({ email, password, name })
          );
          handleResponse(response);
        } else {
          dispatch(
            showToastError({ content: ["Código de verificación incorrecto"] })
          );
        }
      } catch (error) {
        containError();
      }
    }
  };

  const validate = (): boolean => {
    try {
      Validator.checkMail(email);
      Validator.checkName(name);
      Validator.checkPassword(password);
      return true;
    } catch (error: any) {
      dispatch(showToastError({ content: [error.message] }));
      return false;
    }
  };

  const handleResponse = (response: any) => {
    if (response.payload.message === "Unauthorized") {
      dispatch(showToastError({ content: ["Tu sesión ha expirado"] }));
      navigate("/login", { replace: true });
    } else if (
      response.payload.statusCode < 2000 ||
      response.payload.statusCode > 299
    ) {
      dispatch(showToastError({ content: response.payload.message }));
    } else {
      dispatch(showToastSuccess("Estudiante registrado exitosamente!"));
      dispatch(setStudntName(response.payload.name));
      navigate("/home", { replace: true });
    }
  };

  const handleUpdateStudent = async () => {
    if (validate()) {
      try {
        const response = await dispatch(
          updateStudentAsync({
            studentId: student.id!,
            student: { email, name, password, status },
            auth: LocalSession.getSession().token,
          })
        );
        handleResponse(response);
      } catch (error) {
        containError();
      }
    }
  };

  const containError = () => {
    dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
    navigate("/home", { replace: true });
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

  const handleSendMail = async () => {
    await sendEmail();
  };

  const handleSetStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  return (
    <form>
      <Stack sx={{ color: "white" }} spacing={4} direction="column">
        <CustomTextField
          error={emailHelper.error}
          value={email}
          id="email"
          label="Correo electrónico"
          aria-label="Correo electrónico"
          aria-required="true"
          variant="outlined"
          onChange={handleTypeEmail}
          helperText={emailHelper.error ? emailHelper.message : ""}
        />
        <CustomTextField
          error={nameHelper.error}
          value={name}
          id="name"
          label="Nombre"
          aria-label="Nombre"
          aria-required="true"
          variant="outlined"
          onChange={handleTypeName}
          helperText={nameHelper.error ? nameHelper.message : ""}
        />
        <CustomTextField
          error={passwordHelper.error}
          value={password}
          id="password"
          label="Contraseña"
          aria-label="Contraseña"
          aria-required="true"
          type="password"
          autoComplete="current-password"
          onChange={handleTypePassword}
          helperText={passwordHelper.error ? passwordHelper.message : ""}
        />
        {!LocalSession.getSession().token ? (
          <Grid container>
            <Grid item xs={12} lg={3}>
              <Button
                onClick={handleSendMail}
                variant="contained"
                aria-label="Enviar código de verificación"
                aria-required="true"
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
            <Grid item xs={12} lg={9}>
              <CustomTextField
                sx={{ display: "flex", width: "100%" }}
                value={code}
                id="standard-code-input"
                aria-label="Código de verificación"
                aria-required="true"
                placeholder="Escribe el código de verificación"
                autoComplete="current-password"
                onChange={handleTypeCode}
              />
            </Grid>
          </Grid>
        ) : (
          ""
        )}
        <FormControl
          sx={{
            display:
              LocalSession.getSession().type === "Académico" ? "flex" : "none",
          }}
          fullWidth
        >
          <InputLabel sx={{ color: "white" }} id="demo-simple-select-label">
            Estado en el sistema
          </InputLabel>
          <Select
            sx={{ color: "white" }}
            labelId="demo-simple-select-label"
            id="status"
            label="Estado en el sistema"
            aria-label="Estado"
            aria-required="true"
            value={status}
            onChange={handleSetStatus}
          >
            <MenuItem value={"Disponible"}>Disponible</MenuItem>
            <MenuItem value={"Bloqueado"}>Bloqueado</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <div style={{ marginTop: "3rem" }}>
        {LocalSession.getSession().token ? (
          <Button
            id="updateButton"
            aria-label="Actualizar estudiante"
            aria-required="true"
            onClick={handleUpdateStudent}
            variant="contained"
            sx={{
              backgroundColor: "#31E1F7",
              color: "black",
              width: "100%",
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
            onClick={handleAddStudent}
            variant="contained"
            sx={{
              backgroundColor: "#31E1F7",
              color: "black",
              width: "100%",
              "&:hover": { backgroundColor: "#D800A6", color: "white" },
            }}
          >
            Registrarme
          </Button>
        )}
      </div>
    </form>
  );
}
