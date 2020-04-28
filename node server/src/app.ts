// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import Cors from "cors";
import * as FS from "fs";
import * as Path from "path";
import * as HTTP from "http";
import Express from "express";
import CookieParser from 'cookie-parser';
import * as BodyParser from 'body-parser';

import { Log } from "./log";
import { Config } from "./config";
import { HTTP_COOKIE_SECRET } from "./util/http";
import { DownloadsController } from "./controllers/downloadsController";
import { UploadsController } from "./controllers/uploadsController";


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
        this.application.use(Cors());
        this.configureParsers();
        this.registerControllers();
    }

    public start() {
        HTTP.createServer(this.application).on("error", (e: any) => {
            Log.error("[HTTP]", e);
        }).listen(Config.getInstance().http.port, Config.getInstance().http.addr, () => {
            Log.info(`[HTTP] application running ${Config.getInstance().http.addr}:${Config.getInstance().http.port}`);
        });
    }

    private configureParsers() {
        this.application.use(BodyParser.raw());
        this.application.use(BodyParser.text());
        this.application.use(CookieParser(HTTP_COOKIE_SECRET));
        this.application.use(BodyParser.json({ limit: "300mb" }));
        this.application.use(BodyParser.urlencoded({ limit: "300mb", extended: true, parameterLimit: 1000000}));
    }

    private registerControllers() {
        const uploadsController = new UploadsController();
        const downloadsController = new DownloadsController();

        uploadsController.registerController(this.application);
        downloadsController.registerController(this.application);
    }
}
