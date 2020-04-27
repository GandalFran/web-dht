// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as OS from 'os';
import BittorrentDHT = require('bittorrent-dht');

import { Log } from '../log';
import { Config } from '../config';
import { Torrent } from '../models/file';

export class TorrentStatus{
	public torrent: Torrent;
	public promise: Promise<any>;
}

export class Loads {

	private static uploadsInstance: Loads = null;
	private static downloadsInstance: Loads = null;


	public static getUploadsInstace(): Loads {
		if (! Loads.uploadsInstance) {
			Loads.uploadsInstance = new Loads();
        }
        return Loads.uploadsInstance;
	}

	public static getDownloadsInstance(): Loads {
		if (! Loads.downloadsInstance) {
			Loads.downloadsInstance = new Loads();
        }
        return Loads.downloadsInstance;
	}

	public model: {[id: string]: TorrentStatus } ;

	constructor(){
		this.model = {};
	}

	public createUpload(id:string, torrent: Torrent){
		const status: TorrentStatus = new TorrentStatus();
		this.model[id] = status;
		status.torrent = torrent;
		status.promise = torrent.store();
	}

	public createDownload(id:string, torrent: Torrent){
		const status: TorrentStatus = new TorrentStatus();
		this.model[id] = status;
		status.torrent = torrent;
		status.promise = torrent.resolve();
	}

	public delete(id:string){
		this.model[id] = null;
	}

	public get(id:string): TorrentStatus{
		return this.model[id];
	}

	private waitOne(id:string): Promise<any>{
		const status:TorrentStatus = this.model[id];
		return new Promise<any>(function(resolve, reject){
			Promise.resolve(status.promise).then(function(){
				resolve();
			}).catch(function(err){
				Log.error("[LOADS]",err);
				reject(err);
			});
		});
	}

	public async wait(id:string){
		var resolved: boolean = false;
		for(var attemp = 0; attemp < Config.getInstance().dht.numAttemps && !resolved; attemp++){
			await Promise.resolve(this.get(id).promise).then(function(){
				resolved = true;
			}).catch(function(error){
				Log.error(`[LOADS] error on attemp ${attemp}`,error);
			});
		}
	}

	public statusUploads(id:string): number{
		let storedChunks: number = 0;
		const numChunks: number = this.model[id].torrent.chunks.length;
		this.model[id].torrent.chunks.forEach( chunk => {
			if(chunk.cid){
				storedChunks++;
			}
		})
		const percentage: number = storedChunks/numChunks;
		return percentage;
	}

	public statusDownloads(id:string): number{
		let storedChunks: number = 0;
		const numChunks: number = this.model[id].torrent.chunks.length;
		this.model[id].torrent.chunks.forEach( chunk => {
			if(chunk.value){
				storedChunks++;
			}
		})
		const percentage: number = storedChunks/numChunks;
		return percentage;
	}
}