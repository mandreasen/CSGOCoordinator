const fs = require('fs');
const util = require('util');
const https = require('https');

// Update protobufs.
util.log("Updating protobufs...");

var dir = './protobufs';
var baseURL = "https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/master/Protobufs/";
var protobufs = [
	"steammessages.proto",
	"gcsdk_gcmessages.proto",
	"gcsystemmsgs.proto",
	"cstrike15_gcmessages.proto"
];

if (fs.existsSync(dir)) {
	fs.readdir(dir, function(error, filenames) {
		if (error === null) {
			filenames.forEach(function(filename) {
				fs.unlinkSync(dir + '/' + filename);

				util.log("Deleted " + dir + '/' + filename);
			});

			protobufs.forEach(function(filename) {
				var file = fs.createWriteStream(dir + '/' + filename);

				https.get(baseURL + filename, function(response) {
					response.pipe(file);
				});

				util.log("Added " + dir + '/' + filename);
			});

			util.log("Protobufs has been updated!");
		} else {
			util.log("Failed to read directory " + dir + " " + error);
		}
	});
} else {
	util.log("Folder " + dir + " is missing!");
}