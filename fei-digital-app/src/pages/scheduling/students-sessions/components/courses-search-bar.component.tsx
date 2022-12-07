import React, { ChangeEvent, useState } from "react";
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
import { CustomTextField } from "../../../../styles";
import { StudentSessionsSocket } from "../student-sessions-socket.manager";
import { useAppDispatch } from "../../../../app/hooks";
import { showToastError } from "../../../../shared/toast/toastSlice";
import { useNavigate } from "react-router-dom";

export function CoursesSearchBar() {
  const [searchFilter, setSearchFilter] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleFilterSelection = (event: SelectChangeEvent) => {
    setSearchFilter(event.target.value);
  };

  const handleTypeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearchCourses = () => {
    try {
      StudentSessionsSocket.searchCoursesEvent({
        nrc: searchFilter === "nrc" ? searchValue : "",
        name: searchFilter === "name" ? searchValue : "",
      });
    } catch (error) {
      dispatch(showToastError({ content: ["Código de error: 0x000xp0010"] }));
      navigate("/home", { replace: true });
    }
  };

  return (
    <Card elevation={6} sx={{ padding: "1rem", backgroundColor: "#171D2C" }}>
      <Grid container columnSpacing={3} rowSpacing={3}>
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
                <MenuItem value={"nrc"}>NRC</MenuItem>
                <MenuItem value={"name"}>Nombre de curso</MenuItem>
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
            onClick={handleSearchCourses}
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
