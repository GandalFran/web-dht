// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import { Log } from "./log";



/**
 * Application crashguard (logs uncontrolled exceptions)
 */
export class CrashGuard {
 
    /**
     * Starts the crashguard
     */
    public static start() {
        process.on("uncaughtException", this.registerCrash);
    }

    /**
     * Stops the crashguard
     */
    public static stop() {
        process.removeListener("uncaughtException", this.registerCrash);
    }

    /**
     * Registers an application uncontrolled error.
     * @param e not registered error
     */
    public static registerCrash(e: Error) {
    	Log.error("[NOT CONTROLLED EXCEPTION] CrashGuard caught exception", e);
	}
}
