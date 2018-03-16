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
			if (this._csgo._debug) {
				this._csgo.emit('debug', "Requesting game info.");
			}

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
			if (this._csgo._debug) {
				this._csgo.emit('debug', "GC not ready. Failed to request game info.");
			}

			return new Error("GC is not ready!");
		}
	}

	/**
	 * Request your own recent played games
	 * @return {null|error}
	 */
	requestRecentGames() {
		if (this._csgo._GCReady) {
			if (this._csgo._debug) {
				this._csgo.emit('debug', "Requesting recent games.");
			}

			this._csgo._GC.send({
				msg: Protos.ECsgoGCMsg.k_EMsgGCCStrike15_v2_MatchListRequestRecentUserGames,
				proto: {}
			}, new Protos.CMsgGCCStrike15_v2_MatchListRequestRecentUserGames({
				accountid: this._csgo.SteamID2AccountID(this._csgo._SteamUser._client.steamID)
			}).toBuffer());

			return null;
		} else {
			if (this._csgo._debug) {
				this._csgo.emit('debug', "GC not ready. Failed to request recent games.");
			}

			return new Error("GC is not ready!");
		}
	}

	/**
	 * Request matchmaking stats
	 * @return {null|error}
	 */
	requestMatchmakingStats() {
		if (this._csgo._GCReady) {
			if (this._csgo._debug) {
				this._csgo.emit('debug', "Requesting matchmaking stats.");
			}

			this._csgo._GC.send({
				msg: Protos.ECsgoGCMsg.k_EMsgGCCStrike15_v2_MatchmakingClient2GCHello,
				proto: {}
			}, new Protos.CMsgGCCStrike15_v2_MatchmakingClient2GCHello({}).toBuffer());

			return null;
		} else {
			if (this._csgo._debug) {
				this._csgo.emit('debug', "GC not ready. Failed to request matchmaking stats.");
			}

			return new Error("GC is not ready!");
		}
	}

	/**
	 * Request live game from user
	 * @param  {unit32} accountId Steam user account id
	 * @return {null|error}
	 */
	requestLiveGameForUser(accountId) {
		if (this._csgo._GCReady) {
			if (this._csgo._debug) {
				this._csgo.emit('debug', "Requesting live game from user " + accountId);
			}

			this._csgo._GC.send({
				msg: Protos.ECsgoGCMsg.k_EMsgGCCStrike15_v2_MatchListRequestLiveGameForUser,
				proto: {}
			}, new Protos.CMsgGCCStrike15_v2_MatchListRequestLiveGameForUser({
				accountid: accountId
			}).toBuffer());

			return null;
		} else {
			if (this._csgo._debug) {
				this._csgo.emit('debug', "GC not ready. Failed to request live game from user " + accountId);
			}

			return new Error("GC is not ready!");
		}
	}

	/**
	 * Request current live games
	 * @return {null|error}
	 */
	requestCurrentLiveGames() {
		if (this._csgo._GCReady) {
			if (this._csgo._debug) {
				this._csgo.emit('debug', "Requesting current live games.");
			}

			this._csgo._GC.send({
				msg: Protos.ECsgoGCMsg.k_EMsgGCCStrike15_v2_MatchListRequestCurrentLiveGames,
				proto: {}
			}, new Protos.CMsgGCCStrike15_v2_MatchListRequestCurrentLiveGames().toBuffer());

			return null;
		} else {
			if (this._csgo._debug) {
				this._csgo.emit('debug', "GC not ready. Failed to request current live games.");
			}

			return new Error("GC is not ready!");
		}
	}
}