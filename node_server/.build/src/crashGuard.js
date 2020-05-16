// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("./log");
/**
 * Application crashguard (logs uncontrolled exceptions)
 */
var CrashGuard = /** @class */ (function () {
    function CrashGuard() {
    }
    /**
     * Starts the crashguard
     */
    CrashGuard.start = function () {
        process.on("uncaughtException", this.registerCrash);
    };
    /**
     * Stops the crashguard
     */
    CrashGuard.stop = function () {
        process.removeListener("uncaughtException", this.registerCrash);
    };
    /**
     * Registers an application uncontrolled error.
     * @param e not registered error
     */
    CrashGuard.registerCrash = function (e) {
        log_1.Log.error("[NOT CONTROLLED EXCEPTION] CrashGuard caught exception", e);
    };
    return CrashGuard;
}());
exports.CrashGuard = CrashGuard;
