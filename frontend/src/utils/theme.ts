import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(255, 204, 128)", // Custom primary color
      dark: "rgb(239, 108, 0)",
      light: "rgb(250, 250, 250)",
    },
    secondary: {
      main: "rgb(255, 224, 178)", // Custom secondary color
      light: "#FFE0B2",
    },
    background: {
      default: "rgb(55, 71, 79)", // Custom background color
      paper: "rgba(38, 50, 56, 0.95)",
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
