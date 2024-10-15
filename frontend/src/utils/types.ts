export interface PlayerStats {
  player_id: number;
  name: string;
  race: string;
  is_human: boolean;
  team: number;
  result: string;
  color: string;
}

export interface CommandEvent {
  ability_name: string;
  player: number;
  frame: number;
  second: number;
}

export interface SummarisedData {
  map: string;
  players: PlayerStats[];
  duration: number;
  game_type: string;
  build: string;
  expansion: string;
  speed: string;
  commands: CommandEvent[];
}
