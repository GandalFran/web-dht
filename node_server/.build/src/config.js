// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Path = __importStar(require("path"));
var FileSystem = __importStar(require("fs"));
var CONFIG_FILE = "config.json";
var DEFAULT_CONFIG_FILE = "default-config.json";
var DHTConfig = /** @class */ (function () {
    function DHTConfig() {
        this.port = 0;
        this.idIface = "";
        this.isPublic = false;
        this.chunkSize = 0;
        this.numAttemps = 0;
        this.temporalFiles = "";
        this.bootstrapPeers = "";
    }
    return DHTConfig;
}());
exports.DHTConfig = DHTConfig;
var HTTPConfig = /** @class */ (function () {
    function HTTPConfig() {
        this.port = 0;
        this.addr = "";
    }
    return HTTPConfig;
}());
exports.HTTPConfig = HTTPConfig;
var Config = /** @class */ (function () {
    function Config() {
        this.log = null;
        this.dht = null;
        this.http = null;
    }
    Config.getInstance = function () {
        if (!Config.singletonInstance) {
            Config.init();
        }
        return Config.singletonInstance;
    };
    Config.init = function () {
        var config = new Config();
        var configPath = Path.resolve(__dirname, "..", "..", CONFIG_FILE);
        var defaultConfigPath = Path.resolve(__dirname, "..", "..", DEFAULT_CONFIG_FILE);
        var jsonConfig = null;
        try {
            if (FileSystem.existsSync(configPath)) {
                jsonConfig = JSON.parse(FileSystem.readFileSync(configPath).toString());
            }
            else {
                jsonConfig = JSON.parse(FileSystem.readFileSync(defaultConfigPath).toString());
            }
        }
        catch (e) {
            console.log("Invalid configuration: " + JSON.stringify(e));
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
            config.dht.temporalFiles = jsonConfig.dht.temporalFiles;
            config.dht.bootstrapPeers = jsonConfig.dht.bootstrapPeers;
        }
        Config.singletonInstance = config;
    };
    Config.singletonInstance = null;
    return Config;
}());
exports.Config = Config;
