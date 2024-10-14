from typing import List, Dict, TypedDict, Optional

# Define the structure for the player statistics
class PlayerStats(TypedDict):
    player_id: int
    name: str
    race: str
    is_human: bool
    team: int
    result: str
    color: str

# Define the structure for unit events (born, died, etc.)
class UnitEvent(TypedDict):
    unit_id: int
    unit_type: str
    created_at: int
    position: List[int]
    owner: Optional[int]

# Define the structure for command events (like attack, move, etc.)
class CommandEvent(TypedDict):
    ability_name: str
    player: int
    frame: int
    second: int

# Define the structure for upgrades and resource spending
class UpgradeData(TypedDict):
    player_id: int
    minerals_used: int
    vespene_used: int
    second: int

# Define the overall structure for the replay information
class ReplayData(TypedDict):
    map: str
    players: List[PlayerStats]
    duration: int
    game_type: str
    build: str
    expansion: str
    speed: str
    units: List[UnitEvent]
    commands: List[CommandEvent]
    upgrades: List[UpgradeData]

class SummarisedData(TypedDict):
    map: str
    players: List[PlayerStats]
    duration: int
    game_type: str
    build: str
    expansion: str
    speed: str
    commands: List[CommandEvent]

