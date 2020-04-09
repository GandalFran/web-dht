// Reserved for license
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 1] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["WARNING"] = 3] = "WARNING";
    LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
    LogLevel[LogLevel["NONE"] = 5] = "NONE";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var Log = /** @class */ (function () {
    function Log() {
    }
    Log.log = function (msg) {
        console.log("[" + Log.getDate() + "] " + msg);
    };
    Log.getDate = function () {
        return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    };
    Log.setLogLevel = function (level) {
        switch (level) {
            case "NONE":
                Log.log("[INFO] loglevel set to " + level);
                Log.logLevel = LogLevel.NONE;
                break;
            case "DEBUG":
                Log.log("[INFO] loglevel set to " + level);
                Log.logLevel = LogLevel.DEBUG;
                break;
            case "INFO":
                Log.log("[INFO] loglevel set to " + level);
                Log.logLevel = LogLevel.INFO;
                break;
            case "WARNING":
                Log.log("[INFO] loglevel set to " + level);
                Log.logLevel = LogLevel.WARNING;
                break;
            case "ERROR":
                Log.log("[INFO] loglevel set to " + level);
                Log.logLevel = LogLevel.ERROR;
                break;
            default:
                Log.logLevel = LogLevel.NONE;
                Log.log("[ERROR] Given log level " + level + " not found, using NONE instead");
        }
    };
    Log.debug = function (msg) {
        if (Log.logLevel <= LogLevel.DEBUG) {
            Log.log("[DEBUG] " + msg);
        }
    };
    Log.info = function (msg) {
        if (Log.logLevel <= LogLevel.INFO) {
            Log.log("[INFO] " + msg);
        }
    };
    Log.warning = function (msg) {
        if (Log.logLevel <= LogLevel.WARNING) {
            Log.log("[WARNING] " + msg);
        }
    };
    Log.error = function (msg, e) {
        if (Log.logLevel <= LogLevel.ERROR) {
            if (!e) {
                Log.log("[ERROR] " + msg + "\nException " + e.name + ": " + e.message + " \n " + e.stack);
            }
            else {
                Log.log("[ERROR] " + msg);
            }
        }
    };
    Log.exception = function (err) {
        if (Log.logLevel <= LogLevel.ERROR) {
            Log.log("[ERROR] " + err.message + " \n " + err.stack);
        }
    };
    return Log;
}());
exports.Log = Log;
