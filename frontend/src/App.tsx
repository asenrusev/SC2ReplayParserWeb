import React, { useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import { CommandEvent, SummarisedData } from "./utils/types";
const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<SummarisedData>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    if (!file) {
      console.error("missing file");
      return;
    }
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>File Upload</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          type="file"
          onChange={handleFileChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit">
          Upload
        </Button>
      </form>
      {!!response && (
        <div>
          <h3>Map: {response.map}</h3>
          <h3>Players</h3>
          {response.players.map((player) => (
            <div>
              <h4>{player.name}</h4>
              <h4>{player.race}</h4>
            </div>
          ))}
          <h3>Duration: {response.duration}</h3>
          <h3>Game Type: {response.game_type}</h3>
          <h3>Build: {response.build}</h3>
          <h3>Commands</h3>
          {response.commands.map((command) => (
            <div>
              At {formatSeconds(command.second)} layer {command.player} did{" "}
              {command.ability_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

function formatSeconds(seconds: CommandEvent["second"]) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Pad with leading zero if necessary
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}`;
}
