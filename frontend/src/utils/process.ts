import { SummarisedData } from "./types";

export function createPrompt(data: SummarisedData): string {
  return `This is a summary of my StarCraft 2 replay. Please analyze it and provide feedback on the following points:

  Build Order: Evaluate the effectiveness of my build order. How could I optimize it for better performance?
  Enemy Units: Based on my opponent's unit composition, what would have been the most effective counters?
  Improvement Steps: Suggest specific strategies or adjustments I can implement to improve my overall gameplay.

  Here’s the summary of the replay:
  ${createSummaryInfo(data)}`;
}

export function createSummaryInfo(data: SummarisedData): string {
  const commandRows = data.commands
    .map(
      (command) =>
        `At ${formatSeconds(command.second)} player ${command.player} used ${
          command.ability_name
        }`
    )
    .join("\n");
  const playerRows = data.players
    .map(
      (player) =>
        `Player ${player.player_id} is ${player.name} playing as ${player.race}`
    )
    .join("\n");
  return `Map: ${data.map}\nDuration: ${formatSeconds(
    data.duration
  )}\nPlayers:\n${playerRows}\nEvents:\n${commandRows}`;
}

function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Pad with leading zero if necessary
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}`;
}
