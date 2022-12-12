import { NavRoute } from "../interface";

export const academicPages: NavRoute[] = [
  {
    id: "home",
    name: "Inicio",
    url: "/home/",
    params: "",
    isShortAccess: true,
  },
  {
    id: "academics",
    name: "Académicos",
    url: "/academics/",
    params: "",
    isShortAccess: true,
  },
  {
    id: "students",
    name: "Estudiantes",
    url: "/students/",
    params: "",
    isShortAccess: true,
  },
  {
    id: "academicSchedule",
    name: "Horario",
    url: "/academics/schedule/",
    params: "",
    isShortAccess: true,
  },
  {
    id: "academicCourses",
    name: "Cursos",
    url: "/academics/courses/",
    params: "",
    isShortAccess: true,
  },
  {
    id: "following",
    name: "Cursos Seguidos",
    url: "/students/courses/following/",
    params: "",
    isShortAccess: true,
  },
  {
    id: "studentSchedule",
    name: "Clases seguidas",
    url: "/students/schedule/",
    params: "",
    isShortAccess: true,
  },
];
