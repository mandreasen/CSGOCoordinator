const Protos = require('./protos.js');

module.exports = class Handler {
	/**
	 * Steam Game Coordinator message handler.
	 * @param  {class}    csgo     Main core
	 * @param  {object}   header   GC header
	 * @param  {buffer}   buffer   GC buffer
	 * @param  {function} callback GC callback
	 */
	constructor(csgo, header, buffer, callback) {
		this._csgo = csgo;

		if (header.msg == Protos.ECsgoGCMsg.k_EMsgGCCStrike15_v2_PlayersProfile) {
			this.playerProfile(buffer);
		} else if (header.msg == Protos.ECsgoGCMsg.k_EMsgGCCStrike15_v2_ClientReportResponse) {
			this.reportCommend(buffer);
		} else if (header.msg == Protos.ECsgoGCMsg.k_EMsgGCCStrike15_v2_MatchList) {
			this.matchList(buffer);
		} else if (header.msg == Protos.ECsgoGCMsg.k_EMsgGCCStrike15_v2_MatchmakingGC2ClientHello) {
			this.matchmakingStats(buffer);
		} else if (this._csgo._debug) {
			this._csgo.emit('debug', "GC message " + header.msg);
		}
	}

	/**
	 * Player profile handler.
	 * @param  {buffer} buffer GC buffer data
	 */
	playerProfile(buffer) {
		var playerProfileResponse = Protos.CMsgGCCStrike15_v2_PlayersProfile.decode(buffer);
	
		// Emit player response.
		this._csgo.emit('playerProfile', playerProfileResponse);
	}
	
	/**
	 * Player profile handler.
	 * @param  {buffer} buffer GC buffer data
	 */
	reportCommend(buffer) {
		var reportResponse = Protos.CMsgGCCStrike15_v2_ClientReportResponse.decode(buffer);

		if (reportResponse.confirmation_id === null) {
			this._csgo.emit('commendResponse', reportResponse);
		} else {
			this._csgo.emit('reportResponse', reportResponse);
		}
	}

	/**
	 * Match list handler.
	 * @param  {buffer} buffer GC buffer data
	 */
	matchList(buffer) {
		var matchResponse = Protos.CMsgGCCStrike15_v2_MatchList.decode(buffer);

		if (matchResponse.msgrequestid == Protos.ECsgoGCMsg.k_EMsgGCCStrike15_v2_MatchListRequestFullGameInfo) {
			this._csgo.emit('gameInfo', matchResponse);
		} else if (matchResponse.msgrequestid == Protos.ECsgoGCMsg.k_EMsgGCCStrike15_v2_MatchListRequestRecentUserGames) {
			this._csgo.emit('recentGames', matchResponse);
		} else if (matchResponse.msgrequestid == Protos.ECsgoGCMsg.k_EMsgGCCStrike15_v2_MatchListRequestLiveGameForUser) {
			this._csgo.emit('liveGameForUser', matchResponse);
		} else if (matchResponse.msgrequestid == Protos.ECsgoGCMsg.k_EMsgGCCStrike15_v2_MatchListRequestCurrentLiveGames) {
			this._csgo.emit('currentLiveGames', matchResponse);
		} else {
			this._csgo.emit('matchList', matchResponse);
		}
	}

	/**
	 * Matchmaking stats handler.
	 * @param  {buffer} buffer GC buffer data
	 */
	matchmakingStats(buffer) {
		var matchmakingResponse = Protos.CMsgGCCStrike15_v2_MatchmakingGC2ClientHello.decode(buffer);

		// Emit matchmaking stats
		this._csgo.emit('matchmakingStats', matchmakingResponse);
	}
}