import {
  Button,
  Dialog,
  DialogContent,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

export function UserTypeDialog() {
  const userTypes: Record<string, string> = {
    Estudiante: "/students/sign-up",
    "Personal académico": "/academics/sign-up",
  };
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();

  const handleSelectProfile = (userType: string) => {
    navigate(userTypes[userType], { replace: true });
  };

  return (
    <div>
      <Button
        onClick={() => setOpened(true)}
        size="small"
        aria-label="Crear cuenta"
        aria-required="true"
        sx={{ color: "white" }}
      >
        No tengo cuenta
      </Button>
      <Dialog
        open={opened}
        onClose={() => setOpened(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{ backgroundColor: "#16213E", color: "white", minWidth: 300 }}
        >
          <Typography variant="h6">Selecciona el perfil a registrar</Typography>
          <Divider sx={{ backgroundColor: "#31E1F7", my: ".5rem" }} />
          <Fragment>
            <List>
              {Object.keys(userTypes).map((type) => (
                <ListItem
                  onClick={() => handleSelectProfile(type)}
                  key={type}
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemText primary={type} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Fragment>
        </DialogContent>
      </Dialog>
    </div>
  );
}
