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

NO BORRAR, ES UN TEST
// test
import { Chunk } from "./src/models/chunk";
import { File, Torrent } from "./src/models/file";

setTimeout(async function(){
	const path:string = './test/small.mp4';
    Log.debug(`Storing file ${path}`);
	const file:File = File.buildWithPath(path);
	const chunks: Chunk[] = await file.split();

	const path2:string = './test/small2.mp4';
    Log.debug(`Retrieving file ${path2}`);    

    Log.debug(`Creting new chunks ${path2}`);
    const cids:Buffer[] = [];
    chunks.forEach(function(chunk){
    	cids.push(chunk.cid)
	})

	const newChunks:Chunk[] = await Torrent.retrieveFromDht(cids);

	Log.debug(`Joining chunks ${path2}`);
	const file2:File = File.buildWithChunks(path2, newChunks);

}, 5000)
*/
