// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as Express from "express";
import * as FileSystem from "fs";
import { IncomingForm } from 'formidable';

import { Log } from "../log";
import { Config } from "../config";
import { Download, Downloads } from '../models/downloads';
import { FileBitTorrent, Torrent } from "../models/file";
import { STATUS_OK, CONTENT_APPLICATION_JSON, STATUS_INTERNAL_SERVER_ERROR } from '../util/http'


/**
 * Service to manage the DHT downloads
 */
export class DownloadsController{

    private model:Downloads;

    constructor(){
        this.model = new Downloads();
    }

    /**
     * Registers the downloads related endpoints.
     * @param application The system's main express application
     */
    public registerController(application: Express.Express): any {
        application.get("/download/status", this.downloadstatus.bind(this));
        application.post("/download/create", this.createdownload.bind(this));
        application.post("/download/delete", this.deletedownload.bind(this));
        application.post("/download/file", this.getfile.bind(this));
    }

    /**
     * Get all the registered downloads.
     * @param application The system's main express application
     */
    public async downloadstatus(request: Express.Request, response: Express.Response) {
        let downloads: any [] = [];
        this.model.all().forEach (download => {
            downloads.push({
                id: download.id,
                name: download.torrent.file.name,
                percentage: download.status()
            });
        });
        response.send(downloads);
    }

    /**
     * Starts a download from the DHT with the given torrent file in the request.
     * @param request express' request object
     * @param response express' response object
     */
    public async createdownload(request: Express.Request, response: Express.Response) {
        const form = new IncomingForm();

        form.on('file',async (field, uploadedFile) => {
            const id: string = this.model.id();
 
            // move file to temporal folder
            const path: string = Config.getInstance().dht.temporalFiles + '/' + id + '_' + uploadedFile.name;
            FileSystem.renameSync(uploadedFile.path, path);

            // torrent
            const fileNamePrefix = id + '_';
            const filePath =  Config.getInstance().dht.temporalFiles;
            const torrent: Torrent  = Torrent.buildTorrentFromTorrentFile(path, filePath, fileNamePrefix);
            
            this.model.create(id, torrent);

            response.status(STATUS_OK);
            response.contentType(CONTENT_APPLICATION_JSON);
            response.json({"id": id});

            // wait after the response has been send
            await this.model.get(id).wait();
            Log.info(`the download of ${this.model.get(id).torrent.path} on ${this.model.get(id).torrent.file.name} finished.`)
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

    /**
     * To download a regular file, associated with a finished DHT download, from the client side
     * @param request express' request object
     * @param response express' response object
     */
    public async getfile(request: Express.Request, response: Express.Response) {
        const id: any = request.query.id || null;
        const download:Download = this.model.get(id);

        if(download){
            response.status(STATUS_OK);
            response.sendFile(download.torrent.path, function(error){
                Log.error(`[DOWNLOADS CONTROLLER] `, error);
            });
        }else{
            response.status(STATUS_INTERNAL_SERVER_ERROR);
            response.send();
        }
    }
}
