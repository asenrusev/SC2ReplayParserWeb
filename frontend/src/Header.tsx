import { AppBar, Toolbar, Typography } from "@mui/material";

export const Header: React.FC = () => {
  return (
    <AppBar
      position="static"
      color="primary"
      sx={{ backgroundColor: "primary.light" }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Starcraft 2 Replay Reader
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
