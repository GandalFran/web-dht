// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as OS from "os";
import * as Path from "path";
import * as FileSystem from "fs";

import { Log } from "./log";


const CONFIG_FILE = "config.json";
const DEFAULT_CONFIG_FILE = "default-config.json";


export class DHTConfig {

    public port:number;
    public idIface: string;
    public isPublic: boolean;
    public chunkSize: number;
    public numAttemps: number;
    public bootstrapPeers: string;

    constructor() {
        this.port = 0;
        this.idIface = "";
        this.isPublic = false;
        this.chunkSize = 0;
        this.numAttemps = 0;
        this.bootstrapPeers = "";
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
        const defaultConfigPath = Path.resolve(__dirname, "..", "..", DEFAULT_CONFIG_FILE);
 
        let jsonConfig: any = null;
        try {
            if (FileSystem.existsSync(configPath)) {
                jsonConfig = JSON.parse(FileSystem.readFileSync(configPath).toString());
            } else {
                jsonConfig = JSON.parse(FileSystem.readFileSync(defaultConfigPath).toString());
            }
        } catch (e) {
            console.log(`Invalid configuration: ${JSON.stringify(e)}`);
            return;
        }

        config.log = jsonConfig.log;

        config.http = new HTTPConfig();
        if (typeof jsonConfig === "object" && typeof jsonConfig.http === "object") {
            config.http.port = jsonConfig.http.port;
            config.http.addr = jsonConfig.http.addr;
        }

        config.dht = new DHTConfig();
        if (typeof jsonConfig === "object" && typeof jsonConfig.dht === "object") {
            config.dht.port = jsonConfig.dht.port;
            config.dht.idIface = jsonConfig.dht.idIface;
            config.dht.isPublic = jsonConfig.dht.isPublic;
            config.dht.chunkSize = jsonConfig.dht.chunkSize;
            config.dht.numAttemps = jsonConfig.dht.numAttemps;
            config.dht.bootstrapPeers = jsonConfig.dht.bootstrapPeers;
        }

        Config.singletonInstance = config;
    }
}