// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as Express from "express";
import WebTorrent from "webtorrent";
import { IncomingForm } from 'formidable';

import { Log } from "../log";
import { File, Torrent } from "../models/file";


export class FileController{

    private torrent: any;

	constructor(){
        this.torrent = new WebTorrent();
	}

    public registerController(application: Express.Express): any {
        application.get("/torrent/status", this.status.bind(this));
        application.post("/torrent/create", this.create.bind(this));
        application.get("/torrent/delete", this.delete.bind(this));
        application.get("/torrent/retrieve", this.retrieve.bind(this));
    }

    public async status(request: Express.Request, response: Express.Response) {

    }

    public async create(request: Express.Request, response: Express.Response) {
        const form = new IncomingForm();

        form.on('file',(field,file) => {
            console.log(file.path);
            this.torrent.seed(file.path,(torrentFile:any) => {
                Log.debug(`[TORRENT] Client is seeding ${torrentFile.magnetURI}`);
                //TODO need torrent.on for know when .torrent created
            });
        });

        try{
            form.parse(request);
        }catch (e){
            Log.error("[TORRENT] an error occurred on torrent parse", e);
        }
    }

    public async delete(request: Express.Request, response: Express.Response) {

    }

    public async retrieve(request: Express.Request, response: Express.Response) {

    }
}
