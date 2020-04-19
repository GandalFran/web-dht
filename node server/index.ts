// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import { Log } from "./src/log"
import { Config } from "./src/config"
import { DHTApplication } from "./src/app";
import { CrashGuard } from "./src/crashGuard";


// start crash guard
CrashGuard.start();

// set log level
Log.setLogLevel(Config.getInstance().log);

//test -> TODO delete
import { DHT } from "./src/models/dht";

const x = new DHT();
x.init();

//end test

// start application
DHTApplication.getInstance().start();