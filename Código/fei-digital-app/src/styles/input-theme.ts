import { styled, TextField } from "@mui/material";

export const CustomTextField = styled(TextField)({
  "& label.MuiFormLabel-root": {
    color: "rgb(49, 225, 247, .3)",
  },
  "& label.Mui-focused": {
    color: "#00B8DD",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white",
  },
  "& input.MuiInputBase-input": { color: "white" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgb(49, 225, 247, .3)",
    },
    "&:hover fieldset": {
      borderColor: "rgb(49, 225, 247)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#00B8DD",
    },
  },
});
