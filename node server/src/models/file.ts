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
		let chunk:Chunk = null;
		let bufferChunk:Buffer = null;
		const chunks:Chunk[] = [];
		const chunkSize: number = Config.getInstance().dht.chunkSize;

	    for (var i = 0; i < this.content.length; i += chunkSize) {
	        bufferChunk = this.content.slice(i, i+chunkSize);
			chunk = Chunk.buildWithValue(bufferChunk);
			chunks.push(chunk);
	   	}

		return chunks;
	}

	private join(chunks:Chunk[]){
		let bufferChunk:Buffer = null;
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
		const chunks: Chunk[] = file.split();

		//TODO: export chunks to .totrent file
		return null;
	}

	public static buildFileFromTorrent(torrent: Torrent): File {

		torrent.read();
		const torrentInfo = ParseTorrent(torrent.content);

		Log.debug(`[TORRENT] parsed file ${torrent.path} with information ${torrentInfo}`);

		return null;
	}
}