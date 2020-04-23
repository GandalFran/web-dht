// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as FileSystem from "fs";
import ParseTorrent = require('parse-torrent')

import { Log } from "../log"
import { Chunk } from "./chunk"
import { Config } from "../config"

export class File {

	public path:string;
	public content:Buffer;

	constructor(){
		this.path = '';
		this.content = null;
	}

	public static buildWithPath(path:string) {
		const f:File = new File();
		f.path = path;
		f.read();
		return f;
	}

	public static buildWithChunks(path:string, chunks:Chunk[]){
		const f:File = new File();
		f.path = path;
		f.join(chunks);
		f.write();
		return f;
	}

	public async split(): Promise<Chunk []> {
		const chunks: Promise<Chunk>[] = [];
		const chunkSize: number = Config.getInstance().dht.chunkSize;

	    for (var i = 0; i < this.content.length; i += chunkSize) {
	        let bufferChunk:Buffer = this.content.slice(i, i+chunkSize);
			let chunk:Promise<Chunk> = Chunk.buildWithValue(bufferChunk);
			chunks.push(chunk);
	   	}

	   	return new Promise<Chunk []>(function(resolve, reject){
			Promise.all(chunks).then(function(values){
				resolve(values);
   			}).catch(function(error){
   				reject(error);
   			});
	   	});
	}

	private async join(chunks:Chunk[]){
		const bufferChunks: Buffer[] = [];
		chunks.forEach( chunk => {
			bufferChunks.push(chunk.value);
		});
		this.content = Buffer.concat(bufferChunks);
	}

	protected read(){
		this.content = FileSystem.readFileSync(this.path);
	}

	protected write(){
		FileSystem.writeFileSync(this.path, this.content);
	}
}


export class Torrent extends File{

	constructor(){
		super()
	}

	public static buildTorrentFromFile(file: File): Torrent{
		/*const chunks: Chunk[] = file.split();*/

		//TODO: export chunks to .totrent file
		return null;
	}

	public static buildFileFromTorrent(torrent: Torrent): File [] {
		/*torrent.read();
		const parsedTorrent = ParseTorrent(torrent.content);
		const torrentFiles = parsedTorrent.files;

		let file:File = null;
		const files: File [] = [];
		parsedTorrent.files.forEach( torrentFileInfo => {
			let chunk:Chunk = null;
			const chunks:Chunk = [];
			torrentInfo.pieces.forEach(cid => {
				chunk = Chunk.buildWithCid(cid);
				chunks.push(chunk);
			});	

			file = File.buildWithChunks(torrentInfo.name, chunks);
			files.push(file);
		});

		return files;*/
		return null;
	}

	// TODO esto sera privado en un futuro
	public static async retrieveFromDht(cids:Buffer[]): Promise<Chunk []>{

		const chunks: Promise<Chunk>[] = [];
		cids.forEach(async function(cid){
			let chunk: Promise<Chunk> = Chunk.buildWithCid(cid);
			chunks.push(chunk);
		});

	   	return new Promise<Chunk []>(function(resolve, reject){
			Promise.all(chunks).then(function(values){
				resolve(values);
   			}).catch(function(error){
   				reject(error);
   			});
	   	});

	}
}