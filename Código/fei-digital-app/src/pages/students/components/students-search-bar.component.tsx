import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { getStudentsAsync, setStudentList } from "../studentSlice";
import { showToastError } from "../../../shared/toast/toastSlice";
import { CustomTextField } from "../../../styles";
import { Student } from "../interfaces/student.interface";
import { useNavigate } from "react-router-dom";
import { LocalSession } from "../../../shared/session";
import { Validator } from "../../../validations";

export default function StudentsSearchBar() {
  const [searchFilter, setSearchFilter] = useState("email");
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchHelper, setSearchHelper] = useState({
    error: false,
    message: "",
  });

  useEffect(() => {
    let array: Student[] = [];
    dispatch(setStudentList(array));
  }, []);

  const handleSearch = (event: React.MouseEvent<HTMLElement>) => {
    handleSearchStudents();
  };

  const handleFilterSelection = (event: SelectChangeEvent) => {
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

  const handleSearchStudents = async () => {
    if (validate()) {
      try {
        const response = await dispatch(
          getStudentsAsync({
            auth: LocalSession.getSession().token,
            email: searchFilter === "email" ? searchValue : "",
            name: searchFilter === "name" ? searchValue : "",
          })
        );
        if (response.payload.message === "Unauthorized") {
          dispatch(showToastError({ content: ["Tu sesión ha expirado"] }));
          navigate("/login", { replace: true });
        } else if (
          response.payload.statusCode < 2000 ||
          response.payload.statusCode > 299
        ) {
          dispatch(showToastError({ content: response.payload.message }));
        }
      } catch (error) {
        containError();
      }
    }
  };

  const containError = () => {
    dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
    navigate("/home", { replace: true });
  };

  return (
    <form>
      <Card elevation={6} sx={{ padding: "1rem", backgroundColor: "#171D2C" }}>
        <Grid container columnSpacing={3} rowSpacing={3}>
          <Grid item xs={12} md={6}>
            <CustomTextField
              error={searchHelper.error}
              autoFocus
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
                  <MenuItem value={"name"}>Nombre</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item md={2} xs={12}>
            <Button
              id="searchButton"
              aria-label="Buscar estudiante"
              aria-required="true"
              sx={{
                height: "100%",
                width: "100%",
                backgroundColor: "#00B8DD",
                color: "black",
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
