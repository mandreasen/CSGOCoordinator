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
	"confirmation_id": Long {
		low: -2147483593,
		high: 760387526,
		unsigned: true
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