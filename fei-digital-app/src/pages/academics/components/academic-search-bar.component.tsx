import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import SearchIcon from "@mui/icons-material/Search";
import { CustomTextField } from "../../../styles";
import { AcademicSocket } from "../academic-socket.manager";
import { showToastError } from "../../../shared/toast/toastSlice";
import { useNavigate } from "react-router-dom";

export default function AcademicsSearchBar() {
  const [messages, setMessages] = useState(0);
  const [searchFilter, setSearchFilter] = useState("email");
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSearch = (event: React.MouseEvent<HTMLElement>) => {
    handleSearchAcademics();
  };

  const handleFilterSelection = (event: any) => {
    setSearchFilter(event.target.value);
  };

  const handleTypeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearchAcademics = () => {
    try {
      AcademicSocket.searchAcademicsEvent(
        searchFilter === "email" ? searchValue : "",
        searchFilter === "fullName" ? searchValue : ""
      );
    } catch (error) {
      dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
      navigate("/home", { replace: true });
    }
  };

  return (
    <Card elevation={6} sx={{ padding: "1rem", backgroundColor: "#171D2C" }}>
      <Grid container columnSpacing={3} rowSpacing={2}>
        <Grid item xs={12} md={6}>
          <CustomTextField
            autoFocus
            sx={{ display: "flex" }}
            id="outlined-basic"
            value={searchValue}
            label="Búsqueda"
            variant="outlined"
            onChange={handleTypeSearch}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel
                sx={{ color: "#00B8DD" }}
                id="demo-simple-select-label"
              >
                Criterio
              </InputLabel>
              <Select
                sx={{ color: "white" }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={searchFilter}
                label="Criterio"
                onChange={handleFilterSelection}
              >
                <MenuItem value={"email"}>Correo electrónico</MenuItem>
                <MenuItem value={"fullName"}>Nombre</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            sx={{
              backgroundColor: "#00B8DD",
              color: "black",
              height: "100%",
              width: "100%",
            }}
            onClick={handleSearch}
            variant="contained"
            startIcon={<SearchIcon />}
          >
            Buscar
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}
