import React, { useState } from "react";
import {
  AppBar,
  Badge,
  BadgeProps,
  Box,
  Button,
  Container,
  Icon,
  IconButton,
  styled,
  SvgIcon,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import PeopleIcon from "@mui/icons-material/People";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DnsIcon from "@mui/icons-material/Dns";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { NavOptions } from "./components/nav-options.component";
import { NavProfile } from "./components/nav-profile.component";
import { Brand } from "./components/nav-brand.component";
import { NavOption } from "./interface";
import { NavLink } from "./components/nav-link.component";
import { useAppSelector } from "../../app/hooks";
import { selectNavbar } from "./navbarSlice";
import { useNavigate } from "react-router-dom";
import { LocalSession } from "../session";

const studentPages: NavOption[] = [
  { id: "home", name: "Inicio", url: "/", icon: <HomeIcon /> },
  {
    id: "courses",
    name: "Cursos seguidos",
    url: "/students/courses/following/",
    icon: <ClassIcon />,
  },
  {
    id: "schedule",
    name: "Horario",
    url: "/students/schedule/",
    icon: <CalendarMonthIcon />,
  },
  {
    id: "academics",
    name: "Académicos",
    url: "/academics/",
    icon: <SchoolIcon />,
  },
];

const academicsPages: NavOption[] = [
  { id: "home", name: "Inicio", url: "/", icon: <HomeIcon /> },
  {
    id: "coursesFollowing",
    name: "Cursos seguidos",
    url: "/students/courses/following/",
    icon: <BookmarkIcon />,
  },
  {
    id: "schedule",
    name: "Clases subscritas",
    url: "/students/schedule/",
    icon: <CalendarMonthIcon />,
  },
  {
    id: "courses",
    name: "Mis Cursos",
    url: "/academics/courses/",
    icon: <ClassIcon />,
  },
  {
    id: "mySchedule",
    name: "Mis clases",
    url: "/academics/schedule/",
    icon: <DnsIcon />,
  },
  {
    id: "students",
    name: "Estudiantes",
    url: "/students/",
    icon: <PeopleIcon />,
  },
  {
    id: "academics",
    name: "Académicos",
    url: "/academics/",
    icon: <SchoolIcon />,
  },
];

export function Navbar() {
  const session = useAppSelector(selectNavbar);
  const navigate = useNavigate();

  const getPages = (): NavOption[] => {
    if (LocalSession.isLogged()) {
      if (session.type === "Académico") {
        return academicsPages;
      } else if (session.type === "Estudiante") {
        return studentPages;
      }
      return [];
    } else {
      return [];
    }
  };

  const handleSearchCourses = (event: React.MouseEvent<HTMLElement>) => {
    navigate("/students/courses/", { replace: true });
  };

  return (
    <AppBar
      position="fixed"
      component="nav"
      sx={{ backgroundColor: "#111726" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", lg: "flex" }, mr: 1 }} />
          <Brand view="expanded" />
          {getPages().length !== 0 ? <NavOptions /> : ""}
          {getPages().length !== 0 ? (
            <Box sx={{ flexGrow: 1, display: { xs: "none", lg: "flex" } }}>
              {getPages().map((page) => (
                <NavLink key={page.id} page={page} />
              ))}
            </Box>
          ) : (
            ""
          )}
          {getPages().length !== 0 ? (
            <Button
              id="optionsButton"
              aria-label="Buscar cursos"
              aria-required="true"
              onClick={handleSearchCourses}
              sx={{ borderColor: "#00B8DD", color: "#00B8DD", mr: "1rem" }}
              variant="outlined"
              endIcon={<SearchOutlinedIcon />}
            >
              <Typography component="h2" variant="body2">
                Buscar cursos
              </Typography>
            </Button>
          ) : (
            ""
          )}
          <NavProfile />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
