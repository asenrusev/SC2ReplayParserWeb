import sc2reader
import json
from custom_types import ReplayData, PlayerStats, UnitEvent, CommandEvent, UpgradeData, SummarisedData

def extract_replay_data(replay_file) -> ReplayData:
    replay = sc2reader.load_replay(replay_file, load_map=True, load_level=4)

    # Extract detailed information for all players
    player_stats = []
    for player in replay.players:
        player_color = f"RGB({player.color.r}, {player.color.g}, {player.color.b})" if player.color else "Unknown"

        stats = {
            "player_id": player.pid,
            "name": player.name,
            "race": player.play_race,
            "is_human": player.is_human,
            "team": player.team_id,
            "result": player.result,
            "color": player_color,
        }
        player_stats.append(stats)

    # Extract full unit, building, and command events
    unit_data = []
    command_data = []
    upgrade_data = []

    for event in replay.tracker_events:
        if isinstance(event, sc2reader.events.tracker.UnitBornEvent) or isinstance(event, sc2reader.events.tracker.UnitInitEvent):
            unit_data.append({
                "unit_id": event.unit_id,
                "unit_type": event.unit_type_name,
                "created_at": event.second,
                "position": [event.x, event.y],
                "owner": event.control_pid
            })
        elif isinstance(event, sc2reader.events.tracker.UnitDiedEvent):
            unit_data.append({
                "unit_id": event.unit_id,
                "unit_type": event.unit.name,
                "died_at": event.second,
                "position": [event.x, event.y],
                "owner": event.killer_pid if event.killer_pid else None
            })

    # Extract commands (like attacks, moves, upgrades, etc.)
    for event in replay.game_events:
        if isinstance(event, sc2reader.events.game.CommandEvent):
            command_data.append({
                "ability_name": event.ability_name,
                "player": event.player.pid,
                "frame": event.frame,
                "second": event.second
            })

    # Track resource spending and infer upgrades from PlayerStatsEvent
    for event in replay.tracker_events:
        if isinstance(event, sc2reader.events.tracker.PlayerStatsEvent):
            upgrade_data.append({
                "player_id": event.pid,
                "minerals_used": event.minerals_used_current,
                "vespene_used": event.vespene_used_current,
                "second": event.second
            })

    # Include other game metadata
    replay_info = {
        "map": replay.map_name,
        "players": player_stats,
        "duration": replay.game_length.seconds,
        "game_type": replay.game_type,
        "build": replay.build,
        "expansion": replay.expansion,
        "speed": replay.speed,
        "units": unit_data,
        "commands": command_data,
        "upgrades": upgrade_data
    }

    return replay_info

def summarise_replay_data(data: ReplayData) -> SummarisedData:
    filtered_commands =  [command for command in data["commands"] if command["ability_name"] != "RightClick"] 
    retval = SummarisedData(
        map=data["map"],
        players=data["players"],
        duration=data["duration"],
        game_type=data["game_type"],
        build=data["build"],
        expansion=data["expansion"],
        speed=data["speed"],
        commands=filtered_commands)
    return retval