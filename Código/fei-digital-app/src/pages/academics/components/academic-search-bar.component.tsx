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
import { Validator } from "../../../validations";

export default function AcademicsSearchBar() {
  const [messages, setMessages] = useState(0);
  const [searchFilter, setSearchFilter] = useState("email");
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchHelper, setSearchHelper] = useState({
    error: false,
    message: "",
  });

  const handleSearch = (event: React.MouseEvent<HTMLElement>) => {
    handleSearchAcademics();
  };

  const handleFilterSelection = (event: any) => {
    setSearchFilter(event.target.value);
  };

  const handleTypeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    try {
      Validator.checkSearchField(event.target.value);
      searchHelper.error = false;
    } catch (error: any) {
      setSearchHelper({ error: true, message: error.message });
    }
  };

  const validate = (): boolean => {
    try {
      Validator.checkSearchField(searchValue);
      return true;
    } catch (error: any) {
      dispatch(showToastError({ content: [error.message] }));
      return false;
    }
  };

  const handleSearchAcademics = () => {
    if (validate()) {
      try {
        AcademicSocket.searchAcademicsEvent(
          searchFilter === "email" ? searchValue : "",
          searchFilter === "fullName" ? searchValue : ""
        );
      } catch (error) {
        dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
        navigate("/home", { replace: true });
      }
    }
  };

  return (
    <form>
      <Card elevation={6} sx={{ padding: "1rem", backgroundColor: "#171D2C" }}>
        <Grid container columnSpacing={3} rowSpacing={2}>
          <Grid item xs={12} md={6}>
            <CustomTextField
              autoFocus
              error={searchHelper.error}
              sx={{ display: "flex" }}
              id="outlined-basic"
              value={searchValue}
              label="Búsqueda"
              aria-label="Valor de búsqueda"
              aria-required="true"
              variant="outlined"
              onChange={handleTypeSearch}
              helperText={searchHelper.error ? searchHelper.message : ""}
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
                  aria-label="Criterio de búsqueda"
                  aria-required="true"
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
              id="searchButton"
              aria-label="Buscar académico"
              aria-required="true"
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
    </form>
  );
}
