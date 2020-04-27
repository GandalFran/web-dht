// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as Express from "express";
import * as FileSystem from "fs";
import { IncomingForm } from 'formidable';

import { Log } from "../log";
import { FileBitTorrent, Torrent } from "../models/file";


export class FileController{

    private torrent: any;

	constructor(){
        this.torrent = null;
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

        form.on('file',async (field,uploadedFile) => {
            console.log("Archivo convertido");
            const path : any = uploadedFile.path;
		
            try{
                Log.debug(`Generating file ${path}`);
                const file:FileBitTorrent = FileBitTorrent.buildFromPath(path);
                Log.debug(`Generating torrent for file ${path}`);
                this.torrent = Torrent.buildTorrentFromRegularFile(file);
                await this.torrent.store();
                console.log(this.torrent.chunks.length);
            }catch(error){
                Log.error("[INDEX] buildTorrentFromFile", error);
            }
            
            FileSystem.renameSync(this.torrent.path, './test/'+uploadedFile.name+'.torrent');

            response.send("ok");
        });

        try{
            console.log("Llega mensaje");
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
