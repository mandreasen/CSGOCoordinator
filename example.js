// For this example to work. You need to have installed node-steam with npm install steam.
const Steam = require('steam');
const SteamClient = new Steam.SteamClient();
const SteamUser = new Steam.SteamUser(SteamClient);
const SteamFriends = new Steam.SteamFriends(SteamClient);
const SteamGameCoordinator = new Steam.SteamGameCoordinator(SteamClient, 730);
const CSGOCoordinator = require('csgocoordinator');
const csgo = new CSGOCoordinator(SteamUser, SteamGameCoordinator);

// Connect to Steam.
SteamClient.connect();

// Connected to Steam.
SteamClient.on('connected', () => {
	console.log("[STEAM] Successfully connected.");

	// Login to Steam account.
	SteamUser.logOn({
		account_name: "",			// Your Steam account username.
		password: "",				// Your Steam account password.
		two_factor_code: ""			// Disable this line if you aren't using Steam guard mobile two factor login code.
	});
});

// Steam account logon response.
SteamClient.on('logOnResponse', (response) => {
	if (response.eresult == Steam.EResult.OK) {
		console.log("[STEAM] Successfully logged in.");

		// Set Steam status as online.
		SteamFriends.setPersonaState(Steam.EPersonaState.Online);

		// Start playing CS:GO and activate Steam Game Coordinator.
		csgo.play();
	} else if (response.eresult == Steam.EResult.TwoFactorCodeMismatch) {
		console.log("[STEAM] Steam guard two factor code mismatch. Try again.");
	} else {
		// https://github.com/SteamRE/SteamKit/blob/master/Resources/SteamLanguage/eresult.steamd
		console.log("[STEAM] Failed to login. Error number:", response.eresult);
	}
});

// Steam Game Coordinator status.
csgo.on('ready', (ready) => {
	// Check, if Steam Game Coordinator is ready to receive commands.
	if (ready) {
		// Steam Game Coordinator is ready and you can now use commands from CSGOCoordinator.
		console.log("[CSGO] Game coordinator is ready.");

		// Request a CS:GO profile. Remember, the player must be online and playing CS:GO. Listen for the playerProfile event for response.
		csgo.player.requestProfile(40723173);

		// Commend a player for being friendly, a good teacher and a good leader.
		csgo.player.commend(40723173, true, true, true);
	} else {
		console.log("[CSGO] Game coordinator aren't ready any more.");
	}
});

// Receive the data requested from csgo.player.requestProfile(40723173).
csgo.on('playerProfile', (profiles) => {
	profiles.account_profiles.forEach((profile) => {
		console.log("----------------------------- CS:GO Profile -------------------------------");
		console.log("AccountID:", profile.account_id);
		console.log("Steam profile: https://steamcommunity.com/profiles/" + csgo.AccountID2SteamID(profile.account_id));

		// You need to be friend with the player, to see matchmaking rank.
		if (profile.ranking !== null) {
			console.log("Current rank:", csgo.rank.getName(profile.ranking.rank_id));
		}

		console.log("Current private rank:", csgo.level.getName(profile.player_level));
		console.log("Friendly:", profile.commendation.cmd_friendly);
		console.log("Good teacher:", profile.commendation.cmd_teaching);
		console.log("Good leader:", profile.commendation.cmd_leader);
		console.log("----------------------------- CS:GO Profile -------------------------------");
	});
});

// If your commend was accepted by the game. You'll get response on this event.
// You can commend with one account once per 12 hours. So you will not get any response on this event if you try to commend with one account more then once per 12 hours.
// If you don't get any response on this event. Then it also means that your commend failed.
csgo.on('commendResponse', (response) => {
	// response contains data. But I don't know exactly, what all the data means. So if you know it, please let me know.
	console.log("Thanks for the commend :)");
});