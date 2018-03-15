require('@mandreasen/nodejs-stats-reporter').setup(require('./package.json'));

const Rank = require('./lib/rank.js');
const Level = require('./lib/level.js');
const Player = require('./lib/player.js');
const Handler = require('./lib/handler.js');
const Sharecode = require('./lib/sharecode.js');
const Match = require('./lib/match.js');
const Protos = require('./lib/protos.js');
const Events = require('events');
const Bignumber = require('bignumber.js');

module.exports = class CSGOCoordinator extends Events {
	/**
	 * CSGOCoordinator.
	 * @param instance	SteamUser		node-steam SteamUser instance
	 * @param instance	GameCoordinator	node-steam SteamGameCoordinator instance running appid 730 (CSGO)
	 * @param boolean	debug			Debug. On (true) or off (false).
	 */
	constructor(SteamUser, GameCoordinator, debug) {
		super();

		// Debug.
		this._debug = debug || false;

		// node-steam SteamUser.
		this._SteamUser = SteamUser;

		// CSGO Game Coordinator.
		this._GC = GameCoordinator;
		this._GCReady = false;

		// Ranks.
		this.rank = new Rank();

		// Levels aKa private ranks.
		this.level = new Level();

		// Player information and commands.
		this.player = new Player(this);

		// Share code.
		this.sharecode = new Sharecode();

		// Match.
		this.match = new Match(this);

		// CSGO Game Coordinator message handler.
		this._GC.on('message', (header, buffer, callback) => {
			if (header.msg == Protos.EGCBaseClientMsg.k_EMsgGCClientWelcome) {
				// Stop ClientHello
				clearInterval(this._GCHelloInterval);

				// Change GC status to ready
				this._GCStatus = true;
			} else {
				// Handle GC message
				new Handler(this, header, buffer, callback);
			}
		});
	}

	/**
	 * Change GC ready status.
	 * @param  boolean ready True or false
	 */
	set _GCStatus(ready) {
		this._GCReady = ready;
		this.emit('ready', ready);

		if (this._debug) {
			if (ready) {
				this.emit('debug', "CSGO Game Coordinator is ready.");
			} else {
				this.emit('debug', "CSGO Game Coordinator is inactive.");
			}
		}
	}

	/**
	 * Start playing CS:GO or CS:GO and other games.
	 * @param  object gamesPlayed CMsgClientGamesPlayed (https://github.com/SteamRE/SteamKit/blob/master/Resources/Protobufs/steamclient/steammessages_clientserver.proto)
	 */
	play(gamesPlayed) {
		if (gamesPlayed) {
			var csgo = false;

			gamesPlayed.games_played.forEach((app) => {
				if (app.game_id == 730) {
					csgo = true;
				}
			});

			if (!csgo) {
				gamesPlayed.games_played.push({game_id: 730});
			}
		} else {
			gamesPlayed = {games_played:[{game_id: 730}]};
		}

		// Start game(s).
		this._SteamUser.gamesPlayed(gamesPlayed);

		// Start ClientHello.
		this.start();
	}

	/**
	 * Start saying ClientHello to the game.
	 */
	start() {
		// Start ClientHello.
		this._GCHelloInterval = setInterval(() => {
			this._GC.send({
				msg: Protos.EGCBaseClientMsg.k_EMsgGCClientHello,
				proto: {}
			}, new Protos.CMsgClientHello({}).toBuffer());
		}, 2500);
	}

	/**
	 * Stop playing game(s).
	 */
	exit() {
		// Clear ClientHello interval if active.
		if (this._GCHelloInterval) {
			clearInterval(this._GCHelloInterval);
		}

		// GC not ready.
		this._GCStatus = false;

		// Stop gaming.
		this._SteamUser.gamesPlayed({games_played:[]});
	}

	SteamID2AccountID(steamId) {
		return parseInt(new Bignumber(steamId).minus('76561197960265728'));
	}

	AccountID2SteamID(accountId) {
		return new Bignumber(accountId).plus('76561197960265728').toString();
	}
}