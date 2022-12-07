import { NavRoute } from "../interface";

export const studentPages: NavRoute[] = [
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
    id: "studentSchedule",
    name: "Horario",
    url: "/students/schedule/",
    params: "",
    isShortAccess: true,
  },
  {
    id: "studentCourses",
    name: "Cursos para búsqueda",
    url: "/students/courses/",
    params: "",
    isShortAccess: true,
  },
  {
    id: "following",
    name: "Cursos",
    url: "/students/courses/following/",
    params: "",
    isShortAccess: true,
  },
];
