import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  GlobalStyles,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { PlayerStats, SummarisedData } from "./utils/types";
import { createPrompt, createSummaryInfo } from "./utils/process";
import { theme } from "./utils/theme";
import { styled, useMediaQuery } from "@mui/system";
import { Header } from "./Header";
import { Footer } from "./Foorter";

const API_URL = process.env.REACT_APP_API_URL;
const REPLAY_LIMIT_SIZE = 1048576; // 1MB
const REPLAY_EXTENSION = ".SC2Replay";

// Styled component for the background using Material UI's styled
const BackgroundBox = styled(Box)({
  "--u": "25px",
  "--c1": "#888888",
  "--c2": "#6b6b6b",
  "--c3": "#888888",
  "--c4": "#6b6b6b",
  "--c5": "#888888",
  "--gp": "50%/calc(var(--u) * 10) calc(var(--u) * 17.5)",
  "--bp": "calc(var(--u) * -5) calc(var(--u) * -8.75)",
  height: "100vh",
  "--bg": `
      conic-gradient(from 120deg at 74.5% 91.75%, var(--c2) 0 120deg, #fff0 0 360deg) var(--gp),
      conic-gradient(from 120deg at 25.5% 91.75%, var(--c1) 0 120deg, #fff0 0 360deg) var(--gp),
      conic-gradient(from 60deg at 74.5% 75%, var(--c3) 0 120deg, #fff0 0 360deg) var(--gp),
      conic-gradient(from 180deg at 25.5% 75%, var(--c2) 0 120deg, #fff0 0 360deg) var(--gp),
      conic-gradient(from 120deg at 50% 67%, var(--c5) 0 120deg, #fff0 0 360deg) var(--gp),
      conic-gradient(from 90deg at 50% 50%, var(--c1) 0 30deg, var(--c4) 0 90deg, var(--c3) 0 150deg, var(--c2) 0 180deg, #fff0 0 360deg) var(--gp)
    `,
  background: `
      var(--bg), var(--bg), var(--c1)
    `,
  backgroundPosition: `
      var(--bp), var(--bp), var(--bp), var(--bp), var(--bp), var(--bp),
      0 0, 0 0, 0 0, 0 0, 0 0, 0 0
    `,
  // backgroundRepeat: "repeat",
  // backgroundBlendMode: "overlay",
  // minHeight: "100vh",
  // display: "flex",
  // justifyContent: "center",
});

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>("");
  const [summaryInfo, setSummaryInfo] = React.useState<string>();
  const [prompt, setPrompt] = React.useState<string>();
  const [errMsg, setErrMsg] = React.useState<string>();
  const [loadingTooMuch, setLoadingTooMuch] = React.useState<boolean>(false);
  const [response, setResponse] = React.useState<SummarisedData>();
  const [selectedPlayer, setSelectedPlayer] =
    React.useState<PlayerStats["player_id"]>();
  const isMobile = useMediaQuery("(max-width:768px)");
  const fileUploadInputRef = React.useRef<HTMLInputElement>(null);

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
    let loaded = false;
    try {
      const formData = new FormData();
      formData.append("file", file);
      setTimeout(() => {
        if (!loaded) {
          setLoadingTooMuch(true);
        }
      }, 5000);
      const res = await axios.post<SummarisedData>(
        `${API_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      loaded = true;
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
      setResponse(res.data);
      setNotification("Upload successful!");
      setErrMsg(undefined);
    } catch (err) {
      setNotification("Unexpected error");
      console.error("Backend failed", err);
      setErrMsg("Something went wrong");
    } finally {
      setLoading(false);
      setLoadingTooMuch(false);
    }
  };

  const handlePlayerChange = (event: SelectChangeEvent<number>) => {
    try {
      if (!response) {
        return;
      }
      if (event.target.value) {
        const playerId = parseInt(
          event.target.value as string
        ) as PlayerStats["player_id"];
        setSelectedPlayer(playerId);
        setPrompt(createPrompt(response, playerId));
        setSummaryInfo(createSummaryInfo(response, playerId));
      } else {
        setNotification("No player has been selected");
      }
    } catch (err) {
      console.error("handlePlayerChange", { targetValue: event.target.value });
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

  const handleReset = () => {
    setSelectedPlayer(undefined);
    setErrMsg(undefined);
    setResponse(undefined);
    setPrompt(undefined);
    setSummaryInfo(undefined);
    setFile(null);
    if (fileUploadInputRef.current?.value) {
      fileUploadInputRef.current.value = "";
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
            backgroundColor: theme.palette.background.default,
            height: "100vh",
            margin: 0,
          },
        }}
      />
      {/* Header */}
      {!isMobile && <Header />}

      <BackgroundBox>
        {isMobile ? (
          // Show warning message if on mobile
          <Container
            maxWidth="sm"
            style={{
              textAlign: "center",
              padding: "50px",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Typography variant="h5" color="primary">
              This website works only on desktop.
            </Typography>
          </Container>
        ) : (
          <>
            <Container
              maxWidth="lg"
              style={{
                textAlign: "center",
                backgroundColor: theme.palette.background.paper,
                height: "100vh",
                padding: 50,
                paddingTop: 80,
              }}
            >
              {/* <Typography variant="h1" gutterBottom color="primary" marginTop={15}>
            Starcraft 2 Replay Reader
          </Typography> */}
              <Box>
                <Typography variant="h4" gutterBottom color="textPrimary">
                  Upload your StarCraft 2 replay for a quick game breakdown and
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
              </Box>
              <Box
                sx={{
                  padding: 5,
                  borderRadius: 16,
                  borderColor: "primary.light",
                  borderWidth: 1,
                  borderStyle: "solid",
                  marginTop: 5,
                }}
              >
                <Typography variant="h6" gutterBottom color="primary">
                  Select a replay
                </Typography>
                <Typography variant="subtitle2" color="textDisabled">
                  For MacOS, replays are usually located in:
                  <i>
                    <strong>
                      {" "}
                      `~/Library/Application Support/Blizzard/StarCraft
                      II/Accounts/
                      {"{"}YourAccount{"}"}
                      /Replays/Multiplayer`
                    </strong>
                  </i>
                </Typography>
                <Typography variant="subtitle2" color="textDisabled">
                  For Windows, replays are usually located in:{" "}
                  <i>
                    <strong>
                      `C:\Users\{"{"}Your Name
                      {"}"}\Documents\StarCraft II\Accounts\{"{"}Your Account
                      {"}"}
                      \Replays\Multiplayer`{" "}
                    </strong>
                  </i>
                </Typography>
                <input
                  ref={fileUploadInputRef}
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button
                    variant={file ? "outlined" : "contained"}
                    component="span"
                    style={{ marginTop: "10px" }}
                  >
                    Choose Replay File
                  </Button>
                </label>
                {errMsg ? (
                  <Typography color="error" variant="body2">
                    {errMsg}
                  </Typography>
                ) : file ? (
                  <Typography variant="subtitle2" color="textDisabled">
                    Selected file: "{file?.name}"
                  </Typography>
                ) : (
                  <Typography variant="subtitle2" color="textDisabled">
                    No file has been selected
                  </Typography>
                )}
                <br />
                <Box>
                  {loading ? (
                    <>
                      <CircularProgress size={24} />
                      {loadingTooMuch && (
                        <>
                          <Typography variant="subtitle2" color="textPrimary">
                            Wait, we'll chronoboost the servers
                          </Typography>
                        </>
                      )}
                    </>
                  ) : (
                    <Button
                      variant={response ? "outlined" : "contained"}
                      onClick={handleUpload}
                      disabled={loading || !file}
                    >
                      Upload Replay
                    </Button>
                  )}
                </Box>
                <Box
                  sx={{
                    marginTop: 4,
                  }}
                >
                  <InputLabel
                    id="player-select-label"
                    sx={{ color: response ? "primary.main" : "darkgrey" }}
                  >
                    Who are you?
                  </InputLabel>
                  <Select
                    labelId="player-select-label"
                    value={selectedPlayer ?? -1}
                    onChange={handlePlayerChange}
                    label="Select who are you"
                    disabled={!response}
                    color="primary"
                    sx={{
                      color: "primary.main",
                      minWidth: 200,
                      maxHeight: 50,
                      marginTop: 1,
                      borderColor: "fff",
                    }}
                  >
                    {response ? (
                      response.players.map((player) => (
                        <MenuItem value={player.player_id} color="primary.main">
                          {player.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value={-1} selected={true} disabled={true}>
                        Upload Replay
                      </MenuItem>
                    )}
                  </Select>
                </Box>
                <br />
                <Button
                  variant={summaryInfo ? "contained" : "outlined"}
                  onClick={handleCopySummaryInfo}
                  disabled={!summaryInfo}
                >
                  Copy Summary
                </Button>
                <Button
                  variant={
                    selectedPlayer === undefined ? "outlined" : "contained"
                  }
                  onClick={handleCopyPrompt}
                  disabled={selectedPlayer === undefined}
                  sx={{ marginLeft: 3 }}
                >
                  Copy Prompt
                </Button>
                <br />
                <Button
                  variant={
                    selectedPlayer === undefined ? "outlined" : "contained"
                  }
                  onClick={handleReset}
                  disabled={selectedPlayer === undefined}
                  sx={{ marginTop: 3 }}
                >
                  Reset
                </Button>
              </Box>

              <Snackbar
                open={!!notification}
                autoHideDuration={3000}
                onClose={() => setNotification("")}
                message={notification}
              />
            </Container>
            <Footer />
          </>
        )}
      </BackgroundBox>
    </ThemeProvider>
  );
}

export default App;
