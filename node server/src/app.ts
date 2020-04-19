// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as FS from "fs";
import * as Path from "path";
import * as HTTP from "http";
import Express from "express";

import { Log } from "./log";
import { Config } from "./config";
import { DHTController } from "./controllers/dhtController";
import { StatusController } from "./controllers/statusController";
import { BootstrapStartController } from "./controllers/bootstrapStartController";


export class DHTApplication {

    private static singletonInstance : DHTApplication = null;

    public static getInstance(): DHTApplication {
        if (! DHTApplication.singletonInstance) {
            DHTApplication.singletonInstance = new DHTApplication();
        }
        return DHTApplication.singletonInstance;
    }

    private application: Express.Express;

    constructor() {
        this.application = Express();
        this.registerControllers();
    }

    public start() {
        HTTP.createServer(this.application).on("error", (e: any) => {
            Log.error("[HTTP]", e);
        }).listen(Config.getInstance().http.port, Config.getInstance().http.addr, () => {
            Log.info(`[HTTP] application running ${Config.getInstance().http.addr}:${Config.getInstance().http.port}`);
        });
    }

    private registerControllers() {
        const dhtController = new DHTController();
        const statusController = new StatusController();
        const bootstarpStartController = new BootstrapStartController();

        dhtController.registerController(this.application);
        statusController.registerController(this.application);
        bootstarpStartController.registerController(this.application);
    }

    
}
