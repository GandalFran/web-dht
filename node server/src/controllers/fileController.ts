// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as Express from "express";
import * as FileSystem from "fs";
import { IncomingForm } from 'formidable';

import { Log } from "../log";
import { FileBitTorrent, Torrent } from "../models/file";
import { Loads } from '../models/loads';


export class FileController{

	constructor(){
	}

    public registerController(application: Express.Express): any {
        application.get("/files/status", this.status.bind(this));
        application.post("/torrent/create", this.create.bind(this));
        application.post("/file/delete", this.delete.bind(this));
        application.get("/torrent/retrieve", this.retrieve.bind(this));
    }

    public async status(request: Express.Request, response: Express.Response) {
        const downloadsInstance: Loads = Loads.getDownloadsInstance();
        let responseDownloads: any [] = [];
        downloadsInstance.getModel().forEach(element => {
            const percentage: Number = downloadsInstance.statusDownloads(element.id);
            const response: any = {
                id: element.id, 
                name: element.status.torrent.name, 
                percentage: percentage
            };
            responseDownloads.push(response);
        });

        response.send(responseDownloads);
    }

    public async create(request: Express.Request, response: Express.Response) {
        const form = new IncomingForm();

        form.on('file',async (field,uploadedFile) => {
            console.log("Archivo convertido");
            const path : any = uploadedFile.path;
            let torrent: Torrent = null;
		
            try{
                Log.debug(`Generating file ${path}`);
                const file:FileBitTorrent = FileBitTorrent.buildFromPath(path);
                Log.debug(`Generating torrent for file ${path}`);
                torrent = Torrent.buildTorrentFromRegularFile(file);
                const uploadsInstance = Loads.getUploadsInstace();
                let flag : Boolean = true;
                let id: string = null;

                while(flag){
                    id = this.createRandomid(5);
                    if(uploadsInstance.get(id) == null){
                        flag = false;
                    }
                }
                Loads.getUploadsInstace().createUpload(id, torrent);;
            }catch(error){
                Log.error("[INDEX] buildTorrentFromFile", error);
            }
            
            FileSystem.renameSync(torrent.path, './test/'+uploadedFile.name+'.torrent');

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
        const downloadsInstance: Loads = Loads.getDownloadsInstance();
        downloadsInstance.delete(request.body.value);
        response.send(true);
    }

    public async retrieve(request: Express.Request, response: Express.Response) {
        const form = new IncomingForm();

        form.on('file',async (field,uploadedFile) => {
            console.log("Archivo convertido");
            const path : any = uploadedFile.path;
		
            try{
                Log.debug(`Reading torreng from torrent file ${path}`);
                const torrent: Torrent = Torrent.buildTorrentFromTorrentFile(path);
                const downloadsInstance = Loads.getDownloadsInstance();
                let flag : Boolean = true;
                let id: string = null;

                while(flag){
                    id = this.createRandomid(5);
                    if(downloadsInstance.get(id) == null){
                        flag = false;
                    }
                }
                downloadsInstance.createDownload(id, torrent);
                
            }catch(error){
                Log.error("[INDEX] buildTorrentFromFile", error);
            }

            response.send("ok");
        });

        try{
            console.log("Llega mensaje");
            form.parse(request);
        }catch (e){
            Log.error("[TORRENT] an error occurred on torrent parse", e);
        }
    }

    //https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    private createRandomid(length: Number) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }
     
}
