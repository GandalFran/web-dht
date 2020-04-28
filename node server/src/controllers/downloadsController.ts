// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as Express from "express";
import * as FileSystem from "fs";
import { IncomingForm } from 'formidable';

import { Log } from "../log";
import { Download, Downloads } from '../models/downloads';
import { FileBitTorrent, Torrent } from "../models/file";
import { STATUS_OK, CONTENT_APPLICATION_JSON } from '../util/http'


export class DownloadsController{

    private model:Downloads;

    constructor(){
        this.model = new Downloads();
    }

    public registerController(application: Express.Express): any {
        application.get("/download/status", this.downloadstatus.bind(this));
        application.post("/download/create", this.createdownload.bind(this));
        application.post("/download/delete", this.deletedownload.bind(this));
        application.get("/download/file", this.getfile.bind(this));
    }

    public async downloadstatus(request: Express.Request, response: Express.Response) {
        let uploads: any [] = [];
        this.model.all().forEach (download => {
            uploads.push({
                id: download.id,
                name: download.torrent.name,
                percentage: download.status()
            });
        });
        response.send(uploads);
    }

    public async createdownload(request: Express.Request, response: Express.Response) {
        const form = new IncomingForm();

        form.on('file',async (field, uploadedFile) => {
            const id: string = this.model.id();
            
            const path : any = uploadedFile.path;
            const torrent: Torrent  = Torrent.buildTorrentFromTorrentFile(path);
            
            console.log(JSON.stringify(torrent))

            this.model.create(id, torrent);

            response.status(STATUS_OK);
            response.contentType(CONTENT_APPLICATION_JSON);
            response.json({"id": id});

            // wait before the response has been send
            await this.model.get(id).wait();
            Log.info(`the download of  ${this.model.get(id).torrent.file.name} finished.`)
            //FileSystem.renameSync(torrent.path, './test/'+uploadedFile.name+'.torrent');
        });

        form.parse(request);
    }

    public async deletedownload(request: Express.Request, response: Express.Response) {
        const id: string = request.body.id;
        this.model.delete(id);
        response.status(STATUS_OK);
        response.contentType(CONTENT_APPLICATION_JSON);
        response.json({"id": id});
    }

    public async getfile(request: Express.Request, response: Express.Response) {
        const id: string = request.body.id;

        // TODO no se como enviar el fichero

        response.status(STATUS_OK);
        response.contentType(CONTENT_APPLICATION_JSON);
        response.json({"id": id});
    }
}
