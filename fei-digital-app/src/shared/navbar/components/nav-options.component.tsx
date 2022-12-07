import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LocalSession } from "../../session";
import { academicPages, studentPages } from "../constants";
import { NavRoute } from "../interface";

export function NavOptions() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleCloseNavMenu = (event: any) => {
    setAnchorElNav(null);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const getPages = (): NavRoute[] => {
    if (LocalSession.getSession().type === "Académico") {
      return academicPages;
    }
    return studentPages;
  };

  return (
    <Box sx={{ flexGrow: 1, display: { xs: "flex", lg: "none" } }}>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{
          display: { xs: "block", lg: "none" },
        }}
      >
        {getPages().map((page) => (
          <MenuItem
            id={page.url}
            sx={{ width: "100%", height: "100%" }}
            key={page.url}
            onClick={handleCloseNavMenu}
          >
            <Link style={{ textDecoration: "none" }} to={page.url}>
              <Typography
                component={"h2"}
                sx={{ color: "black" }}
                textAlign="center"
              >
                {page.name}
              </Typography>
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
