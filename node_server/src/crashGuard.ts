// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import { Log } from "./log";

function registerCrash(e: Error) {
    Log.error("[NOT CONTROLLED EXCEPTION] CrashGuard caught exception", e);
}

export class CrashGuard {
 
    public static start() {
        process.on("uncaughtException", registerCrash);
    }

    public static stop() {
        process.removeListener("uncaughtException", registerCrash);
    }
}
