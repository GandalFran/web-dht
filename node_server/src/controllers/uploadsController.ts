// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as Express from "express";
import * as FileSystem from "fs";
import { IncomingForm } from 'formidable';

import { Log } from "../log";
import { Config } from "../config";
import { Upload, Uploads } from '../models/uploads';
import { FileBitTorrent, Torrent } from "../models/file";
import { STATUS_OK, CONTENT_APPLICATION_JSON, STATUS_INTERNAL_SERVER_ERROR } from '../util/http'


/**
 * Service to manage the DHT uploads
 */
export class UploadsController{

    private model:Uploads;

    constructor(){
        this.model = new Uploads();
    }

    /**
     * Registers the uploads related endpoints.
     * @param application The system's main express application
     */
    public registerController(application: Express.Express){
        application.get('/upload/status', this.uploadStatus.bind(this));
        application.post('/upload/create', this.createUpload.bind(this));
        application.post('/upload/delete', this.deleteUpload.bind(this));
        application.post('/upload/torrent', this.getTorrent.bind(this));
    }

    /**
     * Get all the registered uploads.
     * @param application The system's main express application
     */
    public async uploadStatus(request: Express.Request, response: Express.Response) {
        let uploads: any [] = [];
        this.model.all().forEach (upload => {
            uploads.push({
                id: upload.id,
                name: upload.torrent.file.name,
                percentage: upload.status()
            });
        });
        response.contentType(CONTENT_APPLICATION_JSON);
        response.json(uploads);
    }

    /**
     * Starts a upload to the DHT with the given file in the request.
     * @param request express' request object
     * @param response express' response object
     */
    public async createUpload(request: Express.Request, response: Express.Response) {
        const form = new IncomingForm();

        form.on('file',async (field, uploadedFile) => {
            const id: string = this.model.id();
            
            // move file to temporal folder
            const path: string = Config.getInstance().dht.temporalFiles + '/' + id + '_' + uploadedFile.name;
            FileSystem.renameSync(uploadedFile.path, path);

            // create file and torrent
            const file:FileBitTorrent = FileBitTorrent.buildFromPath(path, uploadedFile.name);
            const torrent: Torrent  = Torrent.buildTorrentFromRegularFile(file);

            this.model.create(id, torrent);

            response.status(STATUS_OK);
            response.contentType(CONTENT_APPLICATION_JSON);
            response.json({"id": id});
               
            // wait after the response has been send
            await this.model.get(id).wait();
            Log.info(`the upload of ${this.model.get(id).torrent.file.path} into ${this.model.get(id).torrent.path} finished.`)
        });

        form.parse(request);
    }

    /**
     * Deletes a uploads with the given id.
     * @param request express' request object
     * @param response express' response object
     */
    public async deleteUpload(request: Express.Request, response: Express.Response) {
        const id: string = JSON.parse(request.body).id || null;
        this.model.delete(id);
        response.status(STATUS_OK);
        response.contentType(CONTENT_APPLICATION_JSON);
        response.json({"id": id});
    }

    /**
     * To download a torrent file, associated with a finished DHT upload, from the client side
     * @param request express' request object
     * @param response express' response object
     */
    public async getTorrent(request: Express.Request, response: Express.Response) {
        const id: string = JSON.parse(request.body).id || null;
        const upload:Upload = this.model.get(id);

        console.log(id)

        if(upload){
            response.status(STATUS_OK);
            response.download(upload.torrent.path, upload.torrent.name, function(error){
                if(error){
                    Log.error(`[UPLOADS CONTROLLER] `, error);
                }
            });
        }else{
            response.status(STATUS_INTERNAL_SERVER_ERROR);
            response.send();
        }

    }
}
