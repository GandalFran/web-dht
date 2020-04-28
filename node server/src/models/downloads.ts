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

export class Download{

	public id: string;
	public torrent: Torrent;
	public promise: Promise<any>;

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

export class Downloads {

    private static lastId:number = 0;

	private model: {[id: string]: Download };

	constructor(){
		this.model = {};
	}

	public create(id:string, torrent: Torrent){
		const status: Download = new Download();
		this.model[id] = status;
		status.id = id;
		status.torrent = torrent;
		status.promise = torrent.resolve();
	}

	public get(id:string): Download{
		return (id in this.model) ? this.model[id] : null;
	}

	public delete(id:string){
		if(id in this.model)
			this.model[id] = null;
	}

	public all(): Download []{
		const all: Download[] = [];
		Object.keys(this.model).forEach(id => {
			all.push(this.model[id]);
		});
		return all;
	}		

    public id(): string{
        const id:number = Downloads.lastId++;
        return JSON.stringify(id);
    }

}