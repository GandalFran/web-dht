// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as Express from "express";

import { Config } from "../config"
import { RESPONSE_STATUS_OK, CONTENT_APPLICATION_JSON, CONTENT_TEXT_PLAIN } from "../util/http"


export class StatusController{

    public registerController(application: Express.Express): any {
        application.get("/status", this.status.bind(this));
        application.get("/status/config", this.configuration.bind(this));
    }

    public async status(request: Express.Request, response: Express.Response) {
    	response.status(RESPONSE_STATUS_OK);
    	response.contentType(CONTENT_TEXT_PLAIN);
        response.json({
        	"status": "running"
        });
    }

    public async configuration(request: Express.Request, response: Express.Response) {
    	response.status(RESPONSE_STATUS_OK);
    	response.contentType(CONTENT_APPLICATION_JSON);
        response.json({
        	"configuration": JSON.stringify(Config.getInstance())
        });
    }
}
