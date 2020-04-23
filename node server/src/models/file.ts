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
		return f;
	}

	public split(): Chunk [] {
		let chunk:Promise<Chunk> = null;
		let bufferChunk:Buffer = null;
		const chunks:Promise<Chunk>[] = [];
		const chunkSize: number = Config.getInstance().dht.chunkSize;

	    for (var i = 0; i < this.content.length; i += chunkSize) {
	        bufferChunk = this.content.slice(i, i+chunkSize);
			chunk = Chunk.buildWithValue(bufferChunk);
			chunks.push(chunk);
	   	}

	   	let resultChunks: Chunk [] = null;
	   	Promise.all(chunks).then( resolvedChunks => {
	   		resultChunks = resolvedChunks;
	   	}).catch( error => {
	   		Log.error("[FILE]", error);
	   		resultChunks = null;
	   	})
	   	
	   	return resultChunks;
	}

	private join(chunks:Chunk[]){
		Log.debug(`[FILE] chunks ${chunks}`);
		const bufferChunks: Buffer[] = [];
		chunks.forEach( chunk => {
			Log.debug(`[FILE] chunk ${chunk.cid} ${chunk.value}`);
			bufferChunks.push(chunk.value);
		});
		Log.debug(`[FILE] concat ${bufferChunks}`);
		this.content = Buffer.concat(bufferChunks);
		Log.debug(`[FILE] post concat ${bufferChunks}`);
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
		const chunks: Chunk[] = file.split();

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
}