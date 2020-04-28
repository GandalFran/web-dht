// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as Express from "express";
import * as FileSystem from "fs";
import { IncomingForm } from 'formidable';

import { Log } from "../log";
import { Upload, Uploads } from '../models/uploads';
import { FileBitTorrent, Torrent } from "../models/file";
import { STATUS_OK, CONTENT_APPLICATION_JSON } from '../util/http'


export class UploadsController{

    private model:Uploads;

    constructor(){
        this.model = new Uploads();
    }

    public registerController(application: Express.Express){
        application.get('/upload/status', this.uploadstatus.bind(this));
        application.post('/upload/create', this.createupload.bind(this));
        application.post('/upload/delete', this.deleteupload.bind(this));
        application.get('/upload/torrent', this.gettorrent.bind(this));
    }

    public async uploadstatus(request: Express.Request, response: Express.Response) {
        let uploads: any [] = [];
        this.model.all().forEach (upload => {
            uploads.push({
                id: upload.id,
                name: upload.torrent.file.name,
                percentage: upload.status()
            });
        });
        response.send(uploads);
    }

    public async createupload(request: Express.Request, response: Express.Response) {
        const form = new IncomingForm();

        form.on('file',async (field, uploadedFile) => {
            const id: string = this.model.id();
            
            const path : any = uploadedFile.path;
            const file:FileBitTorrent = FileBitTorrent.buildFromPath(path);
            const torrent: Torrent  = Torrent.buildTorrentFromRegularFile(file);
            
            this.model.create(id, torrent);

            response.status(STATUS_OK);
            response.contentType(CONTENT_APPLICATION_JSON);
            response.json({"id": id});
               
            // wait before the response has been send
            await this.model.get(id).wait();
            Log.info(`the upload of  ${this.model.get(id).torrent.name} finished.`)
        });

        form.parse(request);
    }

    public async deleteupload(request: Express.Request, response: Express.Response) {
        const id: string = request.body.id;
        this.model.delete(id);
        response.status(STATUS_OK);
        response.contentType(CONTENT_APPLICATION_JSON);
        response.json({"id": id});
    }

    public async gettorrent(request: Express.Request, response: Express.Response) {
        const id: string = request.body.id;

        // TODO no se como enviar el fichero
        const upload:Upload = this.model.get(id);


        response.status(STATUS_OK);
        response.contentType(CONTENT_APPLICATION_JSON);
        response.json({"id": id});
    }
}
