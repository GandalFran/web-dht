// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as OS from 'os';

import { Log } from '../log';
import { Config } from '../config';
import { Torrent } from '../models/file';
import { Chunk } from '../models/chunk';

/**
 * Bean that represts an upload.
 */
export class Upload{

	public id: string;
	public torrent: Torrent;
	public promise: Promise<any>;

    /**
     * Calculates the status of the upload with the number of uploaded file's chunks.
     * @return a number, contained in the range of 1 to 100, representing the upload status
     */
	public status(): number{
		let storedChunks: number = 0;
		const numChunks: number = this.torrent.chunks.length;
		this.torrent.chunks.forEach( chunk => {
			if(chunk.cid){
				storedChunks++;
			}
		})
		const percentage: number = storedChunks/numChunks;
		return percentage * 100;
	}

    /**
     * Wait for upload to complete.
     */
	public async wait(){
		var resolved: boolean = false;
		for(var attemp = 0; attemp < Config.getInstance().dht.numAttemps && !resolved; attemp++){
			await Promise.resolve(this.promise).then(function(){
				resolved = true;
			}).catch(function(error){
				Log.error(`[UPLOADS] error on attemp ${attemp}`,error);
			});
		}
	}
}

/**
 * Uploads model, containing all the registered uploads in the application.
 */
export class Uploads {

    private static lastId:number = 0;

	private model: {[id: string]: Upload };

	constructor(){
		this.model = {};
	}

    /**
     * Creates an upload in the model
     */
	public create(id:string, torrent: Torrent){
		const status: Upload = new Upload();
		this.model[id] = status;
		status.id = id;
		status.torrent = torrent;
		status.promise = torrent.store();
	}

    /**
     * To obtain an upload from model.
     * @param id the upload's id
     * @return an Upload asociated with the given id
     */
	public get(id:string): Upload{
		return (id in this.model) ? this.model[id] : null;
	}

    /**
     * To delete an upload from model.
     * @param id the upload's id
     */
	public delete(id:string){
		try{
			const upload:Upload = this.get(id);
			upload.torrent.file.delete();
			upload.torrent.delete();
			delete this.model[id];
		}catch(error){
		}
	}

    /**
     * To obtain all uploads from model.
     * @param id the upload's id
     */
	public all(): Upload []{
		const all: Upload[] = [];
		Object.keys(this.model).forEach(id => {
			all.push(this.model[id]);
		});
		return all;
	}		

    /**
     * To generate an id for a upload.
     * @return a new generated id, unique within this model
     */
    public id(): string{
        const id:number = Uploads.lastId++;
        return JSON.stringify(id);
    }

}