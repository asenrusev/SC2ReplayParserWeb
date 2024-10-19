import { Box, Container, Typography } from "@mui/material";

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "rgba(0,0,0,0.1)",
        color: "white",
        py: 1,
        mt: "auto",
        textAlign: "center",
      }}
    >
      <Container>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} All rights reserved to the Swarm
        </Typography>
      </Container>
    </Box>
  );
};
