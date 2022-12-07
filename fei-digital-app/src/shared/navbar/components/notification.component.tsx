import { Badge, BadgeProps, IconButton, styled } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectNavbar } from "../navbarSlice";
import { LocalSession } from "../../session";
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { showToastError } from "../../toast/toastSlice";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    padding: "0 4px",
  },
}));

let socket: Socket;

export function Notification() {
  const [sessions, setSessions] = useState(0);
  const session = useAppSelector(selectNavbar);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // try {
    //   const socket = AcademicSessionsSocket.getSessionInstanceWithToken();
    //   handleConnectSessions();
    //   if (socket) {
    //     socket.on("get-actived-session-by-academic-response", handleActivated);
    //     socket.on("end-class-session-response", handleEndSessionListener);
    //     socket.on("start-class-session-response", handleStartClassListener);
    //     socket.on("class-session-error-response", (data) => console.log(data));
    //     return () => {
    //       socket.off("get-actived-session-by-academic-response");
    //       socket.off("end-class-session-response");
    //       socket.off("start-class-session-response");
    //       socket.off("class-session-error-response");
    //     };
    //   }
    // } catch (error) {
    //   containError();
    // }
  });

  const containError = () => {
    dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
    navigate("/home", { replace: true });
  };

  const handleActivated = (response: any) => {
    setSessions(1);
  };

  const handleEndSessionListener = (event: any) => {
    setSessions(0);
  };

  const handleStartClassListener = (event: any) => {
    setSessions(1);
  };

  const handleConnectSessions = () => {
    if (session.type === "Académico") {
      //getSessionActivated();
    } else if (session.type === "Estudiante") {
    } else {
    }
  };

  const getSessionActivated = () => {
    // if (LocalSession.isLogged()) {
    //   socket = AcademicSessionsSocketIO.getSessionActivated(
    //     LocalSession.getSession().id
    //   );
    // } else {
    //   navigate("/home/", { replace: true });
    // }
  };

  return (
    <IconButton sx={{ mr: "2rem", color: "white" }} aria-label="cart">
      <StyledBadge badgeContent={sessions} color="error">
        <NotificationsIcon />
      </StyledBadge>
    </IconButton>
  );
}
