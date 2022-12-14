import { Button, FormControlLabel, Stack, Switch } from "@mui/material";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { showToastError } from "../../../shared/toast/toastSlice";
import { CustomTextField } from "../../../styles";
import { Validator } from "../../../validations";
import { AcademicSocket } from "../../academics/academic-socket.manager";
import { loginAsync } from "../../students/studentSlice";

export function Account() {
  const [isPersonalAcademic, setIsPersonalAcademic] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [emailHelper, setEmailHelper] = useState({
    error: false,
    message: "",
  });
  const [passwordHelper, setPasswordHelper] = useState({
    error: false,
    message: "",
  });

  const validate = (): boolean => {
    try {
      Validator.checkMail(email);
      Validator.checkPassword(password);
      return true;
    } catch (error: any) {
      dispatch(showToastError({ content: [error.message] }));
      return false;
    }
  };

  const handleTypeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    try {
      Validator.checkMail(event.target.value);
      emailHelper.error = false;
    } catch (error: any) {
      setEmailHelper({ error: true, message: error.message });
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

  const handleSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPersonalAcademic(!isPersonalAcademic);
  };

  const handleSignIn = (event: React.MouseEvent<HTMLElement>) => {
    if (validate()) {
      if (isPersonalAcademic) {
        signInAcademic();
      } else {
        signInStudent();
      }
    }
  };

  const signInAcademic = () => {
    try {
      AcademicSocket.signInEvent(email, password);
    } catch (error) {
      dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
      navigate("/home", { replace: true });
    }
  };

  const signInStudent = async () => {
    const response = await dispatch(loginAsync({ email, password }));
    if (response.payload.statusCode !== undefined) {
      dispatch(showToastError({ content: response.payload.message }));
    } else {
      navigate("/home", { replace: true });
    }
  };

  return (
    <form>
      <FormControlLabel
        sx={{ mb: ".7rem", color: "white" }}
        control={<Switch onChange={handleSelection} />}
        label={"Soy docente"}
      />
      <Stack sx={{ color: "white" }} spacing={5} direction="column">
        <CustomTextField
          error={emailHelper.error}
          autoFocus
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
        <motion.div
          style={{ display: "grid", maxWidth: "100%" }}
          whileHover={{ scale: 1.1 }}
        >
          <Button
            id="loginButton"
            variant="contained"
            aria-label="Iniciar sesión"
            aria-required="true"
            onClick={handleSignIn}
            sx={{
              backgroundColor: "#00B8DD",
              color: "black",
              "&:hover": { backgroundColor: "#D800A6", color: "white" },
            }}
          >
            Entrar
          </Button>
        </motion.div>
      </Stack>
    </form>
  );
}
