import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField } from '@mui/material';
const API_URL = process.env.REACT_APP_API_URL;

// when typescript is added
// interface PlayerStats {
//   player_id: number;
//   name: string;
//   race: string;
//   is_human: boolean;
//   team: number;
//   result: string;
//   color: string;
// }

// interface CommandEvent {
//   ability_name: string;
//   player: number;
//   frame: number;
//   second: number;
// }

// interface SummarisedData {
//   map: string;
//   players: PlayerStats[];
//   duration: number;
//   game_type: string;
//   build: string;
//   expansion: string;
//   speed: string;
//   commands: CommandEvent[];
// }


function App() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponse(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
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
      {!!response && <p>Response received: {JSON.stringify(response)}</p>}
    </div>
  );
}

export default App;
