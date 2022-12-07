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

export function StudentForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Disponible");
  const [code, setCode] = useState("");
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

  const handleSendMail = async () => {
    await sendEmail();
  };

  const handleSetStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  return (
    <div>
      <form>
        <Stack sx={{ color: "white" }} spacing={4} direction="column">
          <CustomTextField
            value={email}
            id="email"
            label="Correo electrónico"
            variant="outlined"
            onChange={handleTypeEmail}
          />
          <CustomTextField
            value={name}
            id="name"
            label="Nombre"
            variant="outlined"
            onChange={handleTypeName}
          />
          <CustomTextField
            value={password}
            id="standard-password-input"
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            onChange={handleTypePassword}
          />
          {!LocalSession.getSession().token ? (
            <Grid container sx={{ pr: "1rem" }}>
              <Grid item xs={9}>
                <CustomTextField
                  sx={{ display: "flex" }}
                  value={code}
                  id="standard-code-input"
                  label="Código de verificación"
                  autoComplete="current-password"
                  onChange={handleTypeCode}
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  onClick={handleSendMail}
                  variant="contained"
                  sx={{
                    ml: "1rem",
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
            </Grid>
          ) : (
            ""
          )}
          <FormControl
            sx={{
              display:
                LocalSession.getSession().type === "Académico"
                  ? "flex"
                  : "none",
            }}
            fullWidth
          >
            <InputLabel sx={{ color: "white" }} id="demo-simple-select-label">
              Estado en el sistema
            </InputLabel>
            <Select
              sx={{ color: "white" }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Estado en el sistema"
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
    </div>
  );
}
