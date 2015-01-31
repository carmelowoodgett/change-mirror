fsmonitor = require('fsmonitor');
var fs = require('fs'),
	wrench = require('wrench'),
	util = require('util'),
	sourceDir = require('./config').sourceDir,
	targetDir = require('./config').targetDir;

// TODO: Add an option to sync files when the program starts
fsmonitor.watch(sourceDir, null, function(change) {

	change.addedFolders.forEach(function(f) {
		wrench.mkdirSyncRecursive(targetDir+f,0777);
		console.log("Added folder: "+targetDir+f);
	});
	
	change.removedFolders.forEach(function(f) {
		wrench.rmdirSyncRecursive(targetDir+f, true);
		console.log("Removed folder: "+targetDir+f);
	});

	change.addedFiles.forEach(function(f) {
		createFile(f,targetDir);
		console.log("Removed file: "+targetDir+f);
	});
	
	change.modifiedFiles.forEach(function(f) {
		createFile(f,targetDir);
		console.log("Modified file: "+targetDir+f);
	});

	// Files in folders that were moved show as deleted files
	// They'll show up in this array but I'm just allowing the unlink
	// to catch it
	change.removedFiles.forEach(function(f) {
		fs.unlink(targetDir+f, function(err) {
			console.log("Containing folder likely removed..");	
		});
	});
});

var createFile = function(item, destDir) {
	fs.createReadStream(item).pipe(fs.createWriteStream(destDir+item));
}
