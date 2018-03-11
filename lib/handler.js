const Protos = require('./protos.js');

module.exports = class Handler {
	/**
	 * Steam Game Coordinator message handler.
	 * @param  class    csgo     Main core
	 * @param  object   header   GC header
	 * @param  buffer   buffer   GC buffer
	 * @param  function callback GC callback
	 */
	constructor(csgo, header, buffer, callback) {
		this._csgo = csgo;

		if (header.msg == Protos.ECsgoGCMsg.k_EMsgGCCStrike15_v2_PlayersProfile) {
			this.playerProfile(buffer);
		} else if (header.msg == Protos.ECsgoGCMsg.k_EMsgGCCStrike15_v2_ClientReportResponse) {
			this.reportCommend(buffer);
		} else if (this._csgo._debug) {
			this._csgo.emit('debug', "GC message " + header.msg);
		}
	}

	/**
	 * Player profile handler.
	 * @param  buffer   buffer   GC buffer
	 */
	playerProfile(buffer) {
		var playerProfileResponse = Protos.CMsgGCCStrike15_v2_PlayersProfile.decode(buffer);
	
		// Emit player response.
		this._csgo.emit('playerProfile', playerProfileResponse);
	}

	/**
	 * Player profile handler.
	 * @param  buffer   buffer   GC buffer
	 */
	reportCommend(buffer) {
		var reportResponse = Protos.CMsgGCCStrike15_v2_ClientReportResponse.decode(buffer);

		if (reportResponse.confirmation_id === null) {
			this._csgo.emit('commendResponse', reportResponse);
		} else {
			this._csgo.emit('reportResponse', reportResponse);
		}
	}
}