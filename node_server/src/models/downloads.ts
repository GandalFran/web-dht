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
 * Bean that represts a download.
 */
export class Download{

	public id: string;
	public torrent: Torrent;
	public promise: Promise<any>;

    /**
     * Calculates the status of the download with the number of downloaded file's chunks.
     * @return a number, contained in the range of 1 to 100, representing the download status
     */
	public status(): number{
		let resolvedChunks: number = 0;
		const numChunks: number = this.torrent.chunks.length;
		this.torrent.chunks.forEach( chunk => {
			if(chunk.value){
				resolvedChunks++;
			}
		})
		const percentage: number = resolvedChunks/numChunks;
		return percentage * 100;
	}

    /**
     * Wait for download to complete.
     */
	public async wait(){
		var resolved: boolean = false;
		for(var attemp = 0; attemp < Config.getInstance().dht.numAttemps && !resolved; attemp++){
			await Promise.resolve(this.promise).then(function(){
				resolved = true;
			}).catch(function(error){
				Log.error(`[DOWNLOADS] error on attemp ${attemp}`,error);
			});
		}
	}
}

/**
 * Download model, containing all the registered downloads in the application.
 */
export class Downloads {

    private static lastId:number = 0;

	private model: {[id: string]: Download };

	constructor(){
		this.model = {};
	}

    /**
     * Creates an download in the model
     */
	public create(id:string, torrent: Torrent){
		const status: Download = new Download();
		this.model[id] = status;
		status.id = id;
		status.torrent = torrent;
		status.promise = torrent.resolve();
	}

    /**
     * To obtain a download from model.
     * @param id the download's id
     * @return an Download asociated with the given id
     */
	public get(id:string): Download{
		return (id in this.model) ? this.model[id] : null;
	}

    /**
     * To delete a download from model.
     * @param id the download's id
     */
	public delete(id:string){
		try{
			const download:Download = this.get(id);
			download.torrent.file.delete();
			download.torrent.delete();
			delete this.model[id];
		}catch(error){
		}
	}

    /**
     * To obtain all downloads from model.
     * @param id the download's id
     */
	public all(): Download []{
		const all: Download[] = [];
		Object.keys(this.model).forEach(id => {
			all.push(this.model[id]);
		});
		return all;
	}		

    /**
     * To generate an id for a download.
     * @return a new generated id, unique within this model
     */
    public id(): string{
        const id:number = Downloads.lastId++;
        return JSON.stringify(id);
    }

}