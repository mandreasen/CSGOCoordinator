const Protos = require('./protos.js');

module.exports = class Match {
	/**
	 * @param {class} csgo Main core.
	 */
	constructor(csgo) {
		// Set Steam Game Coordinator.
		this._csgo = csgo;
	}

	/**
	 * Request match data.
	 * @param  {string}  matchId   CS:GO match id
	 * @param  {string}  outcomeId CS:GO: match outcome id
	 * @param  {integer} token     CS:GO match token
	 */
	requestGameInfo(matchId, outcomeId, token) {
		if (this._csgo._GCReady) {
			this._csgo._GC.send({
				msg: Protos.ECsgoGCMsg.k_EMsgGCCStrike15_v2_MatchListRequestFullGameInfo,
				proto: {}
			}, new Protos.CMsgGCCStrike15_v2_MatchListRequestFullGameInfo({
				matchid: matchId,
				outcomeid: outcomeId,
				token: token
			}).toBuffer());

			return null;
		} else {
			return new Error("GC is not ready!");
		}
	}

	/**
	 * Request your own recent played games
	 * @return {null|error}
	 */
	requestRecentGames() {
		if (this._csgo._GCReady) {
			this._csgo._GC.send({
				msg: Protos.ECsgoGCMsg.k_EMsgGCCStrike15_v2_MatchListRequestRecentUserGames,
				proto: {}
			}, new Protos.CMsgGCCStrike15_v2_MatchListRequestRecentUserGames({
				accountid: this._csgo.SteamID2AccountID(this._csgo._SteamUser._client.steamID)
			}).toBuffer());

			return null;
		} else {
			return new Error("GC is not ready!");
		}
	}

	/**
	 * Request matchmaking stats
	 * @return {null|error}
	 */
	requestMatchmakingStats() {
		if (this._csgo._GCReady) {
			this._csgo._GC.send({
				msg: Protos.ECsgoGCMsg.k_EMsgGCCStrike15_v2_MatchmakingClient2GCHello,
				proto: {}
			}, new Protos.CMsgGCCStrike15_v2_MatchmakingClient2GCHello({}).toBuffer());

			return null;
		} else {
			return new Error("GC is not ready!");
		}
	}
}