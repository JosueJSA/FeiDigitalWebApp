import { Button, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavOption } from "../interface";

export function NavLink(props: { key: string; page: NavOption }) {
  const navigate = useNavigate();

  const handleOnClick = (event: React.MouseEvent<HTMLElement>) => {
    navigate(props.page.url, { replace: true });
  };

  return (
    <Tooltip
      key={props.page.id}
      sx={{ color: "white" }}
      title={props.page.name}
      arrow
    >
      <Button
        id={props.page.id}
        onClick={handleOnClick}
        aria-label={props.page.name}
        aria-required="true"
        sx={{ color: "white" }}
        key={props.page.id}
      >
        <Typography>{props.page.icon}</Typography>
      </Button>
    </Tooltip>
  );
}
