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

// register handler for exit
process.on('exit', function (){
	try{
		DHT.getInstance().close();
	}catch(err){
		Log.info(`[DHT] the dht destroy doesn't gone properly good`);
	}
});
process.on('SIGINT', function (){
	try{
		DHT.getInstance().close();
	}catch(err){
		Log.info(`[DHT] the dht destroy doesn't gone properly good`);
	}
});

// start express application
DHTApplication.getInstance().start();


import * as FileSystem from "fs";
import { Chunk } from "./src/models/chunk";
import { File, Torrent } from "./src/models/file";

const fileName = 'pdf.pdf';

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
		    console.log(torrentFile.chunks.length);
		}catch(error){
			Log.error("[INDEX] buildTorrentFromFile", error);
		}
		
		FileSystem.renameSync(torrentFile.path, './test/prueba.torrent')

		console.log(JSON.stringify(DHT.getInstance().dht.toJSON().values.length));
		
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

	}, 40000)
}