import { PlayerStats, SummarisedData } from "./types";

export function createPrompt(
  data: SummarisedData,
  playerId: PlayerStats["player_id"]
): string {
  return `This is a summary of my StarCraft 2 replay. Please analyze it and provide feedback on the following points:

  Build Order: Evaluate the effectiveness of my build order. How could I optimize it for better performance?
  Enemy Units: Based on my opponent's unit composition, what would have been the most effective counters?
  Improvement Steps: Suggest specific strategies or adjustments I can implement to improve my overall gameplay.

Summary of the replay:
${createSummaryInfo(data, playerId)}`;
}

export function createSummaryInfo(
  data: SummarisedData,
  playerId: PlayerStats["player_id"]
): string {
  const playersMap: Record<number, string> = data.players.reduce(
    (prev, curr) => ({ ...prev, [curr.player_id]: curr.name }),
    {}
  );
  const commandRows = data.commands
    .map((command) => {
      const timestamp = formatSeconds(command.second);
      const playerName = playersMap[command.player];
      const ability = command.ability_name;
      return `At ${timestamp}, ${playerName} used ${ability}`;
    })
    .join("\n");
  const playerRows = data.players
    .map((player) => {
      const meText = player.player_id === playerId ? "Me: " : "";
      const aiText = player.is_human ? "(A.I.)" : "";
      return `${meText}${player.name}${aiText} as ${player.race} (${player.result})`;
    })
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

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
