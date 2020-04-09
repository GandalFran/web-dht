// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as OS from "os";
import * as Path from "path";
import * as FileSystem from "fs";

import { Log } from "./log";


const CONFIG_FILE = "config.json";

export class DHTConfig {
    constructor() {
    }
}

export class HTTPConfig {
    public port: number;
    public addr: string;

    constructor() {
        this.port = 0;
        this.addr = "";
    }
}

export class Config{

    private static singletonInstance: Config = null;

	public static getInstance(): Config {
		if (! Config.singletonInstance) {
            Config.init();
        }
        return Config.singletonInstance;
	}

    public log: string;
    public dht: DHTConfig;
    public http: HTTPConfig;

    private constructor(){
        this.log = null;
        this.dht = null;
        this.http = null;
    }

	public static init(): void {
        const config: Config = new Config();
        const configPath = Path.resolve(__dirname, "..", "..", CONFIG_FILE);

        let jsonConfig: any = {};
        try {
            let rawJson = FileSystem.readFileSync(configPath).toString();
            jsonConfig = JSON.parse(rawJson);
        } catch (e) {
            Log.error("Invalid configuration", e);
        }

        config.log = jsonConfig.log;

        config.http = new HTTPConfig();
        if (typeof jsonConfig === "object" && typeof jsonConfig.http === "object") {
            config.http.port = jsonConfig.http.port;
            config.http.addr = jsonConfig.http.addr;
        }

        config.dht = new DHTConfig();
        if (typeof jsonConfig === "object" && typeof jsonConfig.database === "object") {
        }

        Config.singletonInstance = config;
    }
}