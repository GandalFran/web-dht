// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("./src/log");
var config_1 = require("./src/config");
var dht_1 = require("./src/models/dht");
var app_1 = require("./src/app");
var crashGuard_1 = require("./src/crashGuard");
// start crash guard
crashGuard_1.CrashGuard.start();
// set log level
log_1.Log.setLogLevel(config_1.Config.getInstance().log);
// start the DHT 
dht_1.DHT.getInstance();
// start express application
app_1.DHTApplication.getInstance().start();
