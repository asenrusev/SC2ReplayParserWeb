import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  CssBaseline,
  GlobalStyles,
  Snackbar,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { SummarisedData } from "./utils/types";
import { createPrompt, createSummaryInfo } from "./utils/process";
import { theme } from "./utils/theme";
import { styled } from "@mui/system";

const API_URL = process.env.REACT_APP_API_URL;
const REPLAY_LIMIT_SIZE = 1048576; // 1MB
const REPLAY_EXTENSION = ".SC2Replay";

// Styled component for the background using Material UI's styled
const BackgroundBox = styled(Box)({
  backgroundImage: `
    linear-gradient(135deg, rgb(32, 32, 32), rgb(34, 34, 34)),
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="87" viewBox="0 0 100 87"><polygon points="50,0 100,25 100,62 50,87 0,62 0,25" fill="rgb(32, 32, 32)"/></svg>')
  `,
  backgroundSize: "100px 87px", // Size of the hexagon pattern
  backgroundRepeat: "repeat", // Repeat the hexagons across the background
  backgroundBlendMode: "overlay", // Blend the gradient and pattern together
  minHeight: "100vh", // Full page height
  display: "flex",
  justifyContent: "center",
});

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>("");
  const [summaryInfo, setSummaryInfo] = React.useState<string>();
  const [prompt, setPrompt] = React.useState<string>();
  const [errMsg, setErrMsg] = React.useState<string>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setErrMsg(undefined);
    if (selectedFile) {
      if (selectedFile.size > REPLAY_LIMIT_SIZE) {
        setErrMsg("File size must be less than 1MB.");
        setNotification("Not supported");
        setFile(null);
      } else if (selectedFile.name.endsWith(REPLAY_EXTENSION)) {
        setFile(selectedFile);
      } else {
        setErrMsg("Please select a valid Starcraft 2 replay file.");
        setNotification("Not supported");
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setNotification("Please select a file before uploading.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post<SummarisedData>(
        `${API_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status !== 200) {
        setErrMsg("Request failed");
        console.error("Request failed", res);
        return;
      }
      if (res.data.game_type !== "1v1") {
        setNotification("Not supported");
        setErrMsg(
          `Only 1v1 games are supported. This is ${res.data.game_type} game.`
        );
        return;
      }
      setShowButtons(true);
      setNotification("Upload successful!");
      setPrompt(createPrompt(res.data));
      setSummaryInfo(createSummaryInfo(res.data));
    } catch (err) {
      setNotification("Unexpected error");
      console.error("Backend failed", err);
      setErrMsg("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopySummaryInfo = () => {
    if (summaryInfo) {
      navigator.clipboard.writeText(summaryInfo);
      setNotification(`Summary info copied to clipboard!`);
    }
  };

  const handleCopyPrompt = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      setNotification(`Prompt copied to clipboard!`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Global styles for the body to ensure it covers the entire viewport */}
      <GlobalStyles
        styles={{
          body: {
            // if you want to switch to single color background this is the place
            // backgroundColor: theme.palette.background.default,
            // height: "100vh",
            // margin: 0,
          },
        }}
      />
      <BackgroundBox>
        <Container
          maxWidth="lg"
          style={{
            textAlign: "center",
            marginTop: 100,
          }}
        >
          <Typography variant="h1" gutterBottom color="primary">
            Starcraft 2 Replay Summariser
          </Typography>
          <Box marginTop={5}>
            <Card
              style={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 16,
              }}
            >
              <CardContent>
                <Typography variant="body1" gutterBottom color="textPrimary">
                  Upload your StarCraft 2 replay for a quick game breakdown,
                  generating AI-ready prompts for insights
                </Typography>
                <Typography
                  variant="body2"
                  style={{ fontStyle: "italic" }}
                  color="textPrimary"
                >
                  Note: the replay format isn't perfect—specific unit movements
                  and placements are tricky to pinpoint. We focus on your build
                  order and how your units matched up.
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Typography variant="h6" gutterBottom color="secondary" marginTop={5}>
            Upload your Starcraft 2 replay
          </Typography>
          <Typography variant="subtitle2" color="textPrimary">
            For MacOS, replays are usually located in:
            <i>
              <strong>
                {" "}
                `~/Library/Application Support/Blizzard/StarCraft II/Accounts/
                {"{"}YourAccount{"}"}
                /Replays/Multiplayer`
              </strong>
            </i>
          </Typography>
          <Typography variant="subtitle2" color="textPrimary">
            For Windows, replays are usually located in:{" "}
            <i>
              <strong>
                `C:\Users\{"{"}Your Name
                {"}"}\Documents\StarCraft II\Accounts\{"{"}Your Account{"}"}
                \Replays\Multiplayer`{" "}
              </strong>
            </i>
          </Typography>

          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              style={{ margin: "10px" }}
            >
              Choose Replay File
            </Button>
          </label>
          {!!errMsg && (
            <Typography color="error" variant="body2">
              {errMsg}
            </Typography>
          )}
          {!!file && (
            <Typography variant="subtitle2" color="textPrimary">
              Selected file: "{file?.name}"
            </Typography>
          )}
          <br />

          {!!file && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={loading}
                style={{ margin: "10px" }}
              >
                {loading ? <CircularProgress size={24} /> : "Upload Replay"}
              </Button>
            </>
          )}

          {showButtons && (
            <>
              <br />
              <Button
                variant="outlined"
                style={{ margin: "10px" }}
                onClick={handleCopyPrompt}
              >
                Copy Prompt
              </Button>
              <Button
                variant="outlined"
                style={{ margin: "10px" }}
                onClick={handleCopySummaryInfo}
              >
                Copy Play Summary
              </Button>
            </>
          )}
          <Snackbar
            open={!!notification}
            autoHideDuration={3000}
            onClose={() => setNotification("")}
            message={notification}
          />
        </Container>
      </BackgroundBox>
    </ThemeProvider>
  );
}

export default App;
