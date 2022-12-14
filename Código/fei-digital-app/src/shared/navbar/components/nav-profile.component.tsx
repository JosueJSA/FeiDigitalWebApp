import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setEmptyAcademicState } from "../../../pages/academics/academicSlice";
import { setEmptyAcademicScheduleState } from "../../../pages/scheduling/academics-sessions/academicsScheduleSlice";
import { setEmptyStudentScheduleState } from "../../../pages/scheduling/students-sessions/studentsScheduleSlice";
import { setEmptyStudentState } from "../../../pages/students/studentSlice";
import { LocalSession } from "../../session";
import { cleanSession, selectNavbar } from "../navbarSlice";

export function NavProfile() {
  const username = useAppSelector(selectNavbar).name;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  let settings: Record<string, string> = {};
  if (!LocalSession.isLogged()) {
    settings = { "Iniciar sesión": "/login" };
  } else {
    if (LocalSession.getSession().type === "Estudiante") {
      settings = {
        "Mi cuenta": `/students/student/${LocalSession.getSession().id}`,
        Actualizar: `/students/student-edition/${LocalSession.getSession().id}`,
        "Cerrar sesión": "/login",
      };
    } else {
      settings = {
        "Mi cuenta": `/academics/academic/${LocalSession.getSession().id}`,
        Actualizar: `/academics/academic-edition/${
          LocalSession.getSession().id
        }`,
        "Cerrar sesión": "/login",
      };
    }
  }

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (setting: string) => {
    setAnchorElUser(null);
    if (setting === "Cerrar sesión") {
      LocalSession.clearSession();
      dispatch(cleanSession());
      dispatch(setEmptyStudentState());
      dispatch(setEmptyAcademicState());
      dispatch(setEmptyStudentScheduleState());
      dispatch(setEmptyAcademicScheduleState());
    }
    navigate(settings[setting], { replace: true });
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Stack direction="row" spacing={2}>
        <Typography sx={{ display: { xs: "none", md: "flex" }, my: "1rem" }}>
          {username}
        </Typography>
        <Tooltip title="Ver opciones">
          <IconButton
            id="profileOptionsButton"
            aria-label="Perfil"
            aria-required="true"
            onClick={handleOpenUserMenu}
            sx={{ p: 0 }}
          >
            <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
          </IconButton>
        </Tooltip>
      </Stack>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {Object.keys(settings).map((setting) => (
          <MenuItem
            id={settings[setting]}
            key={setting}
            onClick={() => handleCloseUserMenu(setting)}
          >
            <Typography
              component="h2"
              sx={{ color: "black" }}
              textAlign="center"
            >
              {setting}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
