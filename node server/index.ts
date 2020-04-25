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

//do something when app is closing
process.on('exit', DHT.getInstance().close.bind(null));
process.on('SIGINT', DHT.getInstance().close.bind(null));

// start express application
DHTApplication.getInstance().start();

/*

import * as FileSystem from "fs";
import { Chunk } from "./src/models/chunk";
import { File, Torrent } from "./src/models/file";

const fileName = 'gif.gif';

if(Config.getInstance().dht.idIface === 'wifi0'){

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
		
		FileSystem.renameSync(torrentFile.path, './test/prueba.torrent')

	}, 20000)

}else{
	setTimeout(async function(){
		const torrentPath:string = './test/prueba.torrent';
		try{
		   	Log.debug(`Reading torreng from torrent file ${torrentPath}`);
		    const torrentFile2: Torrent = Torrent.buildTorrentFromTorrentFile(torrentPath);
		    await torrentFile2.resolve();
		}catch(error){
			Log.error("[INDEX] buildTorrentFromFile", error);
		}

	}, 20000)
}
*/