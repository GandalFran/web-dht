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

// register handler for exit and destroy dht
process.on('exit', async function (){
	try{
		await DHT.getInstance().close();
	}catch(err){
		Log.info(`[DHT] the dht destroy doesn't gone properly good`);
	}
});
process.on('SIGINT', async function (){
	try{
		await DHT.getInstance().close();
	}catch(err){
		Log.info(`[DHT] the dht destroy doesn't gone properly good`);
	}
});