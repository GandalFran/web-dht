// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as Express from "express";

import { Config } from "../config";
import { STATUS_OK, CONTENT_APPLICATION_JSON } from "../util/http";

class bootstrapMessage {
    type: string;
    id: string;
    nodes: string[];

    constructor(type: string, id: string, nodes: string[]){
        this.type = type;
        this.id = id;
        this.nodes = nodes;
    }
}

export class BootstrapStartController{

    public registerController(application: Express.Express): any {
        application.get("/bootstrap", this.message.bind(this));
    }

    public async message(request: Express.Request, response: Express.Response) {

        // peer
        const peer = Config.getInstance().dht.bootstrapPeer;


        // take params from body
        const param1 = request.body.param1 || null;


        // response
        response.status(STATUS_OK);
        response.contentType(CONTENT_APPLICATION_JSON);
        response.json({'recived param1': param1})
    }

}
