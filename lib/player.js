const Protos = require('./protos.js');

module.exports = class Player {
	/**
	 * @param class	csgo Main core.
	 */
	constructor(csgo) {
		// Set Steam Game Coordinator.
		this._csgo = csgo;
	}

	/**
	 * Request player profile.
	 * @param  {uint32} accountId Steam profile account id.
	 * @return {error|null}
	 */
	requestProfile(accountId) {
		if (this._csgo._GCReady) {
			this._csgo._GC.send({
				msg: Protos.ECsgoGCMsg.k_EMsgGCCStrike15_v2_ClientRequestPlayersProfile,
				proto: {},
			}, new Protos.CMsgGCCStrike15_v2_ClientRequestPlayersProfile({
				account_id: accountId,
				request_level: 32
			}).toBuffer());

			if (this._csgo._debug) {
				this._csgo.emit('debug', "Requesting player profile " + accountId);
			}

			return null;
		} else {
			if (this._csgo._debug) {
				this._csgo.emit('debug', "GC not ready. Failed to request player profile " + accountId);
			}

			return new Error("GC is not ready!");
		}
	}
	
	/**
	 * Commend a player
	 * @param  {unit32}  accountId Steam account id
	 * @param  {boolean} friendly  Commend as friendly
	 * @param  {boolean} teaching  Commend as a good teacher
	 * @param  {boolean} leader    Commend as a good leader
	 * @return {error|null}
	 *
	 * You can commend with one account once per 12 hours.
	 */
	commend(accountId, friendly, teaching, leader) {
		if (this._csgo._GCReady) {
			var cmds = {};

			// Set commend flags
			if (friendly) { cmds.cmd_friendly = 1; }
			if (teaching) { cmds.cmd_teaching = 2; }
			if (leader) { cmds.cmd_leader = 4; }

			// Check if there is any commends to give.
			if (Object.keys(cmds).length > 0) {
				this._csgo._GC.send({
					msg: Protos.ECsgoGCMsg.k_EMsgGCCStrike15_v2_ClientCommendPlayer,
					proto: {}
				}, new Protos.CMsgGCCStrike15_v2_ClientCommendPlayer({
					account_id: accountId,
					match_id: 8,
					commendation: new Protos.PlayerCommendationInfo(cmds),
					tokens: 10
				}).toBuffer());

				if (this._csgo._debug) {
					this._csgo.emit('debug', "Commend committed to " + accountId);
				}

				return null;
			} else {
				if (this._csgo._debug) {
					this._csgo.emit('debug', "Incorrect commendation input.");
				}

				return new Error("Incorrect commendations input.");
			}
		} else {
			if (this._csgo._debug) {
				this._csgo.emit('debug', "GC not ready. Failed to commend profile " + accountId);
			}

			return new Error("GC is not ready!");
		}
	}
	
	/**
	 * Report a player
	 * @param  {unit32}  accountId  Steam profile account id
	 * @param  {string}  matchId    CS:GO match id. (Not share code)
	 * @param  {boolean} aimbot     Report for aim hacking
	 * @param  {boolean} wallhack   Report for wall hack
	 * @param  {boolean} speedhack  Report for other hacking
	 * @param  {boolean} teamharm   Report for griefing
	 * @param  {boolean} textabuse  Report for abusive text chat
	 * @param  {boolean} voiceabuse Report for abusive voice chat
	 * @return {null|error}
	 *
	 * You can report with one account once per 6 hours.
	 */
	report(accountId, matchId, aimbot, wallhack, speedhack, teamharm, textabuse, voiceabuse) {
		if (this._csgo._GCReady) {
			var rpts = {};

			// Set report flags
			if (aimbot) { rpts.rpt_aimbot = 2; }
			if (wallhack) { rpts.rpt_wallhack = 3; }
			if (speedhack) { rpts.rpt_speedhack = 4; }
			if (teamharm) { rpts.rpt_teamharm = 5; }
			if (textabuse) { rpts.rpt_textabuse = 6; }
			if (voiceabuse) { rpts.rpt_voiceabuse = 7; }

			// Check if there is any thing to report.
			if (Object.keys(rpts).length > 0) {
				// Add account id and match id to object.
				rpts.account_id = accountId;
				rpts.match_id = matchId;

				this._csgo._GC.send({
					msg: Protos.ECsgoGCMsg.k_EMsgGCCStrike15_v2_ClientReportPlayer,
					proto: {}
				}, new Protos.CMsgGCCStrike15_v2_ClientReportPlayer(rpts).toBuffer());

				if (this._csgo._debug) {
					this._csgo.emit('debug', "Report committed to " + accountId);
				}

				return null;
			} else {
				if (this._csgo._debug) {
					this._csgo.emit('debug', "Incorrect report input.");
				}

				return new Error("Incorrect report input.");
			}
		} else {
			if (this._csgo._debug) {
				this._csgo.emit('debug', "GC not ready. Failed to request report profile " + accountId);
			}

			return new Error("GC is not ready!");
		}
	}
}