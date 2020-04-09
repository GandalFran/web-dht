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
var log_1 = require("./log");
var CONFIG_FILE = "config.json";
var DHTConfig = /** @class */ (function () {
    function DHTConfig() {
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
        var jsonConfig = {};
        try {
            var rawJson = FileSystem.readFileSync(configPath).toString();
            jsonConfig = JSON.parse(rawJson);
        }
        catch (e) {
            log_1.Log.error("Invalid configuration", e);
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
    };
    Config.singletonInstance = null;
    return Config;
}());
exports.Config = Config;
