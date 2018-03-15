const Bignumber = require('bignumber.js');
const Long = require('long');

module.exports = class Sharecode {
	constructor() {
		this._DICTIONARY = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijkmnopqrstuvwxyz23456789";
		this._SHARECODE_PATTERN = "^CSGO(-[a-zA-Z0-9]{5}){5}$";
	}
	
	/**
	 * CS:GO Share code decorder.
	 * @param  {string} sharecode E.g CSGO-aLsD7-JdFsV-AmRp5-mAJxG-KxXHK
	 * @return {object}           With matchId, outcomeId and token
	 */
	decode(sharecode) {
		if (sharecode.match(this._SHARECODE_PATTERN)) {
			var code = this._sanitize(sharecode);
			code = Array.from(code).reverse();

			var big = new Bignumber(0);

			for (var i = 0; i < code.length; i++) {
				big = big.multipliedBy(this._DICTIONARY.length).plus(this._DICTIONARY.indexOf(code[i]));
			}

			const bytes = this._parseHexString(big.toString(16));

			return {
				matchId: new Long(this._bytesToInt32(bytes.slice(0, 4).reverse()), this._bytesToInt32(bytes.slice(4, 8).reverse()), true).toString(),
				outcomeId: new Long(this._bytesToInt32(bytes.slice(8, 12).reverse()), this._bytesToInt32(bytes.slice(12, 16).reverse()), true).toString(),
				token: this._bytesToInt32(bytes.slice(16, 18).reverse())
			};
		} else {
			throw new Error("Invalid share code.");
		}
	}

	_sanitize(sharecode) {
		return sharecode.replace(/CSGO|\-/g, '');
	}

	_parseHexString(string) {
		var result = [];

		while (string.length >= 2) {
			result.push(parseInt(string.substring(0, 2), 16));

			string = string.substring(2, string.length);
		}

		return result;
	}

	_bytesToInt32(bytes) {
		var number = 0;

		for (var i = 0; i < bytes.length; i++) {
			number += bytes[i];

			if (i < bytes.length - 1) {
				number = number << 8;
			}
		}

		return number;
	}
}