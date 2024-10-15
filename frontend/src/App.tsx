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
  // MenuItem,
  // Select,
  // SelectChangeEvent,
  Snackbar,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { SummarisedData } from "./utils/types";
import { createPrompt, createSummaryInfo } from "./utils/process";
import { theme } from "./utils/theme";
const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [file, setFile] = useState<File | null>(null);
  // const [rank, setRank] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>("");
  const [summaryInfo, setSummaryInfo] = React.useState<string>();
  const [prompt, setPrompt] = React.useState<string>();
  const [errMsg, setErrMsg] = React.useState<string>();
  const [response, setResponse] = useState<SummarisedData>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Ensure the file is a Starcraft 2 replay file
      if (selectedFile.size > 1048576) {
        setNotification(
          "File size must be less than 1MB. Please upload a smaller file."
        );
        setFile(null); // Reset the file if it's too large
      } else if (selectedFile.name.endsWith(".SC2Replay")) {
        setFile(selectedFile);
      } else {
        setNotification("Please select a valid Starcraft 2 replay file.");
      }
    }
  };

  //TODO:
  // const handleRankChange = (event: SelectChangeEvent<{ value: unknown }>) => {
  //   setRank(event.target.value as string);
  // };

  const handleUpload = async () => {
    if (!file) {
      setNotification("Please select a file before uploading.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(res.data);
      setShowButtons(true);
      setNotification("Upload successful!");
      setPrompt(createPrompt(res.data));
      setSummaryInfo(createSummaryInfo(res.data));
    } catch (err) {
      console.error("Backend failed", err);
      setErrMsg("Something went wrong");
    }
    setLoading(false);
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
            backgroundColor: theme.palette.background.default,
            height: "100vh",
            margin: 0,
          },
        }}
      />
      <Container
        maxWidth="lg"
        style={{
          textAlign: "center",
          marginTop: "50px",
        }}
      >
        <Typography
          variant="h1"
          gutterBottom
          color="primary"
          style={{ marginTop: 100 }}
        >
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

        {/* <Select
        value={{ value: rank }}
        onChange={handleRankChange}
        displayEmpty
        fullWidth
        style={{ marginBottom: "20px" }}
      >
        <MenuItem value="" disabled>
          Select your rank
        </MenuItem>
        <MenuItem value={"Bronze"}>Bronze</MenuItem>
        <MenuItem value={"Silver"}>Silver</MenuItem>
        <MenuItem value={"Gold"}>Gold</MenuItem>
        <MenuItem value={"Platinum"}>Platinum</MenuItem>
        <MenuItem value={"Diamond"}>Diamond</MenuItem>
        <MenuItem value={"Master"}>Master</MenuItem>
        <MenuItem value={"Grandmaster"}>Grandmaster</MenuItem>
      </Select> */}
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
    </ThemeProvider>
  );
}

export default App;
