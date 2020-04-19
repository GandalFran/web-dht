// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as Express from "express";
import { DHT } from "../models/dht";


export class DHTController{

	private dht: DHT;

	constructor(){
		this.dht = DHT.getInstance();
	}

    public registerController(application: Express.Express): any {
        application.get("/dht/put", this.put.bind(this));
        application.get("/dht/get", this.get.bind(this));
    }

    public async put(request: Express.Request, response: Express.Response) {

    }

    public async get(request: Express.Request, response: Express.Response) {
    	
    }
}
