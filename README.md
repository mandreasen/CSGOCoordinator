# CS:GO Coordinator
A node-steam plugin to coordinate with Counter-Strike: Global Offensive.

[![NPM](https://nodei.co/npm/csgocoordinator.png?downloads=true&stars=true)](https://nodei.co/npm/csgocoordinator)

# Requirements
* node-steam
* You must own Counter-Strike: Global Offensive on the account you sign in with.

# Initializing
Parameters:
* `SteamUser` - node-steam SteamUser instance.
* `SteamGameCoordinator` - node-steam SteamGameCoordinator instance with appid 730 (CSGO).
* `debug` - Boolean to receive debug messages (Parameter not required).

```js
const Steam = require('steam');
const SteamClient = new Steam.SteamClient();
const SteamUser = new Steam.SteamUser();
const SteamGameCoordinator = new Steam.SteamGameCoordinator(SteamClient, 730);
const CSGOCoordinator = require('csgocoordinator');
const csgo = new CSGOCoordinator(SteamUser, SteamGameCoordinator);
```

# Properties
### csgo.rank.ranks
Return an object with all ranks in CS:GO.

### csgo.level.ranks
Return an object with all levels aKa private ranks in CS:GO.

# Methods
Most of the methods requires, the SteamClient instance to be logged on.

### csgo.play(gamesPlayed)
* `gamesPlayed` - [`CMsgClientGamesPlayed`](https://github.com/SteamRE/SteamKit/blob/master/Resources/Protobufs/steamclient/steammessages_clientserver.proto) object. (Parameter not required)

Tells Steam you are playing game(s). CS:GO will automatically be included in the object.

### csgo.exit()

Tells Steam to stop playing game(s).

### csgo.start()

**Important!** This will only start the Steam Game Coordinator and requeres that CS:GO already has been started.

*I recommend that you only use this method. If you are prevented from using `csgo.play(gamesPlayed)` by another module.*

### csgo.SteamID2AccountID(steamId)
* `steamId` - Steam account 64 bit ID.

Convert 64 bit SteamID into AccountID.

### csgo.AccountID2SteamID(accountId)
* `accountid` - Steam account ID.

Convert an AccountID into SteamID 64 bit.

### csgo.sharecode.decode(sharecode);
* `sharecode` - CS:GO Share code.

Convert an CS:GO share code to match id, outcome id and token.

```json
{
	"matchId": "3265656638094180753",
	"outcomeId": "3265661444162584623",
	"token": 35917
}
```

### csgo.rank.getName(rankId)
* `rankId` - CS:GO in-game rank ID.

Converts an rank ID to a string. Ex: `csgo.rank.getName(18) = "The Global Elite"`

### csgo.level.getName(rankId)
* `rankId` - CS:GO in-game level ID aKa private rank ID.

Converts an rank ID to a string. Ex: `csgo.rank.getName(18) = "The Global Elite"`

### csgo.player.requestProfile(accountId)
* `accountId` - Steam profile account ID.

Requests player profile from Steam Game Coordinator. The player must be online and playing CS:GO. Listen for the `playerProfile` event for response.


### csgo.player.report(accountId, matchId, aimbot, wallhack, otherhack, griefing, textabuse, voiceabuse)
* `accountId` - Steam profile account ID.
* `matchId` - CS:GO match id. (Not sharecode)
* `aimbot` - boolean (true or false)
* `wallhack` - boolean (true or false)
* `otherhack` - boolean (true or false)
* `griefing` - boolean (true or false)
* `textabuse` - boolean (true or false)
* `voiceabuse` - boolean (true or false)

Report player for aim hacking, wall hacking, other hacking, griefing, abusive text chat or/and abusive voice chat.

*You can report with one account once per 6 hours. For precisely working report bot you need 11 accounts with CS:GO.*

### csgo.player.commend(accountId, friendly, teaching, leader)
* `accountId` - Steam profile account ID.
* `friendly` - boolean (true or false)
* `teaching` - boolean (true or false)
* `leader` - boolean (true or false)

Commend a player for being friendly, a good teacher or/and a good leader.

*You can commend with one account once per 12 hours.*

### csgo.match.requestGameInfo(matchId, outcomeId, token)
* `matchId` - CS:GO match id in string format
* `outcomeId` - CS:GO outcome id in string format
* `token` - CS:GO token in integer format

Requests match info. Listen for the `gameInfo` event for response.

### csgo.match.requestRecentGames()

Request match info of your recent played games. Listen for the `recentGames` event for response.

### csgo.match.requestMatchmakingStats()

Request matchmaking stats. Listen for the `matchmakingStats` event for response.

### csgo.match.requestLiveGameForUser(accountId)

Request live game info for user. Listen for the `liveGameForUser` event for response.

### csgo.match.requestCurrentLiveGames()

Request current live games. Listen for the `currentLiveGames` event for response.

# Events
### ready
* `ready` - boolean true or false

Emitted when the Game Coordinator status change.

### playerProfile
* `profiles` - Object

```json
{
	"request_id": null,
	"account_profiles": [
		{
			"account_id": 40723173,
			"ongoingmatch": null,
			"global_stats": null,
			"penalty_seconds": null,
			"penalty_reason": null,
			"vac_banned": null,
			"ranking": {
				"account_id": 40723173,
				"rank_id": 17,
				"wins": 601,
				"rank_change": null
			},
			"commendation": {
				"cmd_friendly": 120,
				"cmd_teaching": 116,
				"cmd_leader": 116
			},
			"medals": {
				"medal_team": 2,
				"medal_combat": 2,
				"medal_weapon": 3,
				"medal_global": 1,
				"medal_arms": 2,
				"display_items_defidx": [947, 960, 1329, 903, 895, 1318, 1030, 874, 1001],
				"featured_display_item_defidx": 947
			},
			"my_current_event": null,
			"my_current_event_teams": [],
			"my_current_team": null,
			"my_current_event_stages": [],
			"survey_vote": null,
			"activity": null,
			"player_level": 14,
			"player_cur_xp": 327682222,
			"player_xp_bonus_flags": null
		}
	]
}
```

Emitted when Steam Game Coordinator responds to the `csgo.player.requestProfile()` method.

### reportResponse
* `response` - Object

```json
{
	"confirmation_id": {
		"low": -2147483593,
		"high": 760387526,
		"unsigned": true
	},
	"account_id": 40723173,
	"server_ip": null,
	"response_type": 9119,
	"response_result": 1,
	"tokens": null
}
```

Emitted when Steam Game Coordinator responds to the `csgo.player.report()` method.

### commendResponse
* `response` - Object

```json
{
	"confirmation_id": null,
	"account_id": 40723173,
	"server_ip": null,
	"response_type": 9121,
	"response_result": 1,
	"tokens": 2
}
```

Emitted when Steam Game Coordinator responds to the `csgo.player.commend()` method.

### gameInfo, recentGames, liveGameForUser and currentLiveGames
* `response` - Object

```json
{
	"msgrequestid": 9147,
	"accountid": 40723173,
	"servertime": 1521135928,
	"matches": [ {
		"matchid": {
			"low": 401,
			"high": 760344937,
			"unsigned": true
		},
		"matchtime": 1520689874,
		"watchablematchinfo": {
			"server_ip": 184,
			"tv_port": 2064223309,
			"tv_spectators": 0,
			"tv_time": null,
			"tv_watch_password": null,
			"cl_decryptdata_key": null,
			"cl_decryptdata_key_pub": {
				"low": 518511473,
				"high": 1231283309,
				"unsigned": true
			},
			"game_type": null,
			"game_mapgroup": null,
			"game_map": null,
			"server_id": null,
			"match_id": null,
			"reservation_id": null
		},
		"roundstats_legacy": null,
		"roundstatsall": [ {
			"reservationid": {
				"low": 47,
				"high": 760346056,
				"unsigned": true
			},
			"reservation": {
				"account_ids": [ 240915902, 68946780, 2901614, 40723173, 321392295, 205260762, 235780062, 211062627, 264801312, 114932004 ],
				"game_type": 1048584,
				"match_id": null,
				"server_version": null,
				"rankings": [],
				"encryption_key": null,
				"encryption_key_pub": null,
				"party_ids": [],
				"whitelist": [],
				"tv_master_steamid": null,
				"tournament_event": null,
				"tournament_teams": [],
				"tournament_casters_account_ids": [],
				"tv_relay_steamid": null,
				"pre_match_data": null
			},
			"map": "http://replay184.valve.net/730/003265661444162584623_2064223309.dem.bz2",
			"round": null,
			"kills": [ 22, 24, 22, 22, 6, 17, 9, 11, 10, 10 ],
			"assists": [ 7, 2, 2, 1, 6, 2, 3, 2, 2, 0 ],
			"deaths": [ 12, 9, 11, 11, 15, 20, 19, 20, 19, 19 ],
			"scores": [ 58, 57, 52, 51, 19, 50, 27, 25, 24, 22 ],
			"pings": [],
			"round_result": null,
			"match_result": 1,
			"team_scores": [ 16, 6 ],
			"confirm": null,
			"reservation_stage": null,
			"match_duration": 2058,
			"enemy_kills": [ 22, 24, 22, 22, 6, 17, 10, 11, 10, 10 ],
			"enemy_headshots": [ 14, 12, 10, 6, 3, 7, 4, 4, 6, 5 ],
			"enemy_3ks": [],
			"enemy_4ks": [],
			"enemy_5ks": [],
			"mvps": [ 4, 4, 4, 4, 0, 5, 1, 0, 0, 0 ],
			"spectators_count": null,
			"spectators_count_tv": null,
			"spectators_count_lnk": null,
			"enemy_kills_agg": [],
			"drop_info": null
		} ]
	} ],
	"streams": [],
	"tournamentinfo": null
}
```

Emitted when Steam Game Coordinator responds to the `csgo.match.requestGameInfo()` and `csgo.match.requestRecentGames()` method.

### matchmakingStats
* `response` - Object

```json
{
	"account_id": 40723173,
	"ongoingmatch": null,
	"global_stats": {
		"players_online": 315775,
		"servers_online": 232087,
		"players_searching": 10109,
		"servers_available": 174327,
		"ongoing_matches": 16565,
		"search_time_avg": 128651,
		"search_statistics": [ { 
				"game_type": 520,
				"search_time_avg": 153376,
				"players_searching": 4064
			}, {
				"game_type": 32776,
				"search_time_avg": 163287,
				"players_searching": 4937
			}, {
				"game_type": 2097160,
				"search_time_avg": 425897,
				"players_searching": null
			}
		],
		"main_post_url": "",
		"required_appid_version": 13629,
		"pricesheet_version": 1520974256,
		"twitch_streams_version": 2,
		"active_tournament_eventid": 13,
		"active_survey_id": 0
	},
	"penalty_seconds": null,
	"penalty_reason": null,
	"vac_banned": 0,
	"ranking": {
		"account_id": 40723173,
		"rank_id": 6,
		"wins": 56,
		"rank_change": null
	},
	"commendation": {
		"cmd_friendly": 5,
		"cmd_teaching": 4,
		"cmd_leader": 4
	},
	"medals": {
		"medal_team": 0,
		"medal_combat": 0,
		"medal_weapon": 0,
		"medal_global": 0,
		"medal_arms": 0,
		"display_items_defidx": [],
		"featured_display_item_defidx": null
	},
	"my_current_event": null,
	"my_current_event_teams": [],
	"my_current_team": null,
	"my_current_event_stages": [],
	"survey_vote": null,
	"activity": null,
	"player_level": 17,
	"player_cur_xp": 327680044,
	"player_xp_bonus_flags": null
}
```

Emitted when Steam Game Coordinator responds to the `csgo.match.requestMatchmakingStats()` method.
