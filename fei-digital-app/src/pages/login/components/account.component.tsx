import { Button, FormControlLabel, Stack, Switch } from "@mui/material";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { showToastError } from "../../../shared/toast/toastSlice";
import { CustomTextField } from "../../../styles";
import { AcademicSocket } from "../../academics/academic-socket.manager";
import { loginAsync } from "../../students/studentSlice";

export function Account() {
  const [isPersonalAcademic, setIsPersonalAcademic] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleTypeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleTypePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPersonalAcademic(!isPersonalAcademic);
  };

  const handleSignIn = (event: React.MouseEvent<HTMLElement>) => {
    if (isPersonalAcademic) {
      signInAcademic();
    } else {
      signInStudent();
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
          autoFocus
          id="email"
          value={email}
          label="Correo electrónico"
          variant="outlined"
          onChange={handleTypeEmail}
        />
        <CustomTextField
          id="password"
          value={password}
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          onChange={handleTypePassword}
        />
        <motion.div
          style={{ display: "grid", maxWidth: "100%" }}
          whileHover={{ scale: 1.1 }}
        >
          <Button
            id="loginButton"
            variant="contained"
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
