// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as Express from "express";
import { DHT } from "../models/dht";

export class FileController{

	private model: DHT;

	constructor(){
		this.model = new DHT();
	}

    public registerController(application: Express.Express): any {
        application.get("/file/status", this.statusFile.bind(this));
        application.get("/file/create", this.createFile.bind(this));
        application.get("/file/delete", this.deleteFile.bind(this));
        application.get("/file/retrieve", this.retrieveFile.bind(this));
    }

    public async statusFile(request: Express.Request, response: Express.Response) {

    }

    public async createFile(request: Express.Request, response: Express.Response) {
        
    }

    public async deleteFile(request: Express.Request, response: Express.Response) {

    }

    public async retrieveFile(request: Express.Request, response: Express.Response) {

    }
}
