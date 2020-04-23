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

	const path:string = './test/pruebaTorrent.txt';

	const file:File = File.buildWithPath(path);
    Log.debug(`Created File ${file.path}: ${file.content}`);

	const chunks: Chunk[] = await file.split();
	chunks.forEach( chunk => {
		Log.debug(`Chunk ${chunk.cid}`);
		chunk.value = null;
	})
	Log.debug(`Deleted chunks values`);


	const path2:string = './test/222pruebaTorrent.txt';
	Log.debug(`Creating file ${path2} -> ${chunks}`);
	const file2:File = File.buildWithChunks(path2, chunks);
	Log.debug(`Created file ${path2}`);

}, 5000)
