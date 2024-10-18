import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(63, 81, 181)", // Custom primary color
      dark: "rgb(26, 35, 126)",
    },
    secondary: {
      main: "rgb(197, 202, 233)", // Custom secondary color
      light: "#FFE0B2",
    },
    background: {
      default: "rgb(55, 71, 79)", // Custom background color
      paper: "rgb(38, 50, 56)",
    },
    text: {
      primary: "#fff", // Custom text color
      secondary: "#424242",
      disabled: "rgb(158, 158, 158)",
    },
  },
  typography: {
    fontFamily: "Roboto, Helvetica Neue, sans-serif", // Custom font family
  },
});
