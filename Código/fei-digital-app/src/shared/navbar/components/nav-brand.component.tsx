import { Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

/**
 * @param view: "expanded" | "contained"
 */
export function Brand(props: { view: string }) {
  return (
    <Link style={{ textDecoration: "none" }} to={"/"}>
      <Typography
        component="h1"
        variant="h6"
        noWrap
        sx={{
          mr: 2,
          display:
            props.view === "expanded"
              ? { xs: "none", lg: "flex" }
              : { xs: "flex", lg: "none" },
          fontFamily: "monospace",
          fontWeight: 700,
          letterSpacing: ".3rem",
          color: "white",
          textDecoration: "none",
        }}
      >
        FEI DIGITAL
      </Typography>
    </Link>
  );
}
