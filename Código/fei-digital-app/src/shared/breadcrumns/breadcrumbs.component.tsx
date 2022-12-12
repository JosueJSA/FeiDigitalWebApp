import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link } from "react-router-dom";
import { Container, styled } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectBreadcrumbLinks } from "./breadcrumbsSlice";
import { academicPages, studentPages } from "../navbar/constants";

const StyleBreadcrumb = styled(Breadcrumbs)({
  "& svg.MuiSvgIcon-root": {
    color: "#00B8DD",
  },
});

export function BreadcrumbsNav() {
  const links = useAppSelector(selectBreadcrumbLinks);

  const getLinks = () => {
    const pages: Array<any> = [];
    links.forEach((link, index) => {
      pages.push(
        <Link
          style={{ color: "white", textDecoration: "none" }}
          key={index}
          color="inherit"
          to={link.url}
        >
          {link.name}
        </Link>
      );
    });
    return pages;
  };

  const breadcrumbs = getLinks();

  return (
    <Container sx={{ my: "2.5rem" }} maxWidth="lg">
      <Stack sx={{ color: "white" }} spacing={2}>
        <StyleBreadcrumb
          sx={{ mt: "2rem" }}
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </StyleBreadcrumb>
      </Stack>
    </Container>
  );
}
