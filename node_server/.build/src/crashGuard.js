// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("./log");
function registerCrash(e) {
    log_1.Log.error("[NOT CONTROLLED EXCEPTION] CrashGuard caught exception", e);
}
var CrashGuard = /** @class */ (function () {
    function CrashGuard() {
    }
    CrashGuard.start = function () {
        process.on("uncaughtException", registerCrash);
    };
    CrashGuard.stop = function () {
        process.removeListener("uncaughtException", registerCrash);
    };
    return CrashGuard;
}());
exports.CrashGuard = CrashGuard;
