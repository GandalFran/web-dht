// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as Express from "express";
import WebTorrent from "webtorrent";
import { DHT } from "../models/dht";
import { IncomingForm } from 'formidable';

export class FileController{

    private model: DHT;
    private torrent: any;

	constructor(){
        this.model = new DHT();
        this.torrent = new WebTorrent();
	}

    public registerController(application: Express.Express): any {
        application.get("/file/status", this.statusFile.bind(this));
        application.post("/file/create", this.createFile.bind(this));
        application.get("/file/delete", this.deleteFile.bind(this));
        application.get("/file/retrieve", this.retrieveFile.bind(this));
    }

    public async statusFile(request: Express.Request, response: Express.Response) {

    }

    public async createFile(request: Express.Request, response: Express.Response) {
        const form = new IncomingForm();

        form.on('file',(field,file) => {
            console.log(file.path);
            this.torrent.seed(file.path,(torrentFile:any) => {
                console.log('Client is seeding ' + torrentFile.magnetURI);
                //TODO need torrent.on for know when .torrent created
            });
        });

        try{
            form.parse(request);
        }catch (e){
            console.log(e);
        }
    }

    public async deleteFile(request: Express.Request, response: Express.Response) {

    }

    public async retrieveFile(request: Express.Request, response: Express.Response) {

    }
}
