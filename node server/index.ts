// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import { Log } from "./src/log"
import { Config } from "./src/config"
import { DHT } from "./src/models/dht";
import { DHTApplication } from "./src/app";
import { CrashGuard } from "./src/crashGuard";

// start crash guard
CrashGuard.start();

// set log level
Log.setLogLevel(Config.getInstance().log);

// start the DHT 
DHT.getInstance();

// start express application
DHTApplication.getInstance().start();

/*
import * as FileSystem from "fs";
import { Chunk } from "./src/models/chunk";
import { File, Torrent } from "./src/models/file";

const fileName = 'texto.txt';

setTimeout(async function(){
	const path:string = './test/' + fileName;
	let torrentFile: Torrent = null;
	
	try{
	    Log.debug(`Generating file ${path}`);
		const file:File = File.buildFromPath(path);
	    Log.debug(`Generating torrent for file ${path}`);
	    torrentFile = Torrent.buildTorrentFromRegularFile(file);
	    await torrentFile.store();
	}catch(error){
		Log.error("[INDEX] buildTorrentFromFile", error);
	}
	
	FileSystem.renameSync(path, './test/OLD' + fileName)

	try{
	   	Log.debug(`Reading torreng from torrent file ${torrentFile.path}`);
	    const torrentFile2: Torrent = Torrent.buildTorrentFromTorrentFile(torrentFile.path);
	    await torrentFile2.resolve();
	}catch(error){
		Log.error("[INDEX] buildTorrentFromFile", error);
	}

}, 5000)
*/