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
//DHTApplication.getInstance().start();


// test
import { Chunk } from "./src/models/chunk";
import { File, Torrent } from "./src/models/file";

setTimeout(async function(){


	const path:string = './test/descarga.jpg';
    Log.debug(`Storing file ${path}`);
	const file:File = File.buildWithPath(path);
	const chunks: Chunk[] = await file.split();

	const path2:string = './test/descarga2.jpg';
    Log.debug(`Retrieving file ${path2}`);    

    Log.debug(`Creting new chunks ${path2}`);
    const newChunks: Chunk[] = await file.split();
    chunks.forEach(async function(chunk){
		Log.debug(`recreating chunk ${chunk.cid}`);
		let newChunk: Chunk = await Chunk.buildWithCid(chunk.cid);
		newChunks.push(newChunk);
	})

	Log.debug(`Joining chunks ${path2}`);
	const file2:File = File.buildWithChunks(path2, chunks);

}, 5000)
