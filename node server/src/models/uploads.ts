// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as OS from 'os';
import BittorrentDHT = require('bittorrent-dht');

import { Log } from '../log';
import { Config } from '../config';
import { Torrent } from '../models/file';
import { Chunk } from '../models/chunk';

export class Upload{
	public id: string;
	public torrent: Torrent;
	public promise: Promise<any>;

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

export class Uploads {

    private static lastId:number = 0;

	private model: {[id: string]: Upload };

	constructor(){
		this.model = {};
	}

	public create(id:string, torrent: Torrent){
		const status: Upload = new Upload();
		this.model[id] = status;
		status.id = id;
		status.torrent = torrent;
		status.promise = torrent.store();
	}

	public get(id:string): Upload{
		return (id in this.model) ? this.model[id] : null;
	}

	public delete(id:string){
		if(id in this.model)
			this.model[id] = null;
	}

	public all(): Upload []{
		const all: Upload[] = [];
		Object.keys(this.model).forEach(id => {
			all.push(this.model[id]);
		});
		return all;
	}		

    public id(): string{
        const id:number = Uploads.lastId++;
        return JSON.stringify(id);
    }

}