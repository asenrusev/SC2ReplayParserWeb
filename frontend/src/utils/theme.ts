import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#FFA726", // Custom primary color
    },
    secondary: {
      main: "#FBE9E7", // Custom secondary color
      light: "#FFE0B2",
    },
    background: {
      default: "#424242", // Custom background color
      paper: "rgba(66, 66, 66, 0.85)",
    },
    text: {
      primary: "#FFE0B2", // Custom text color
      secondary: "#424242",
    },
  },
  typography: {
    fontFamily: "Roboto, Helvetica Neue, sans-serif", // Custom font family
  },
});
