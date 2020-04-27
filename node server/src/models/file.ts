// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as FileSystem from "fs";
import * as ParseTorrent from 'parse-torrent';
import CreateTorrent = require('create-torrent');


import { Log } from "../log"
import { Chunk } from "./chunk"
import { Config } from "../config"

export class FileBitTorrent {

	public name:string;
	public path:string;
	public content:Buffer;

	constructor(){
		this.name = '';
		this.path = '';
		this.content = null;
	}

	public static buildFromPath(path:string) {
		const file:FileBitTorrent = new FileBitTorrent();
		file.name = path;
		file.path = path;
		file.read();
		return file;
	}

	public static buildFromChunks(path:string, chunks:Chunk[]): FileBitTorrent {
		const file:FileBitTorrent = new FileBitTorrent();
		file.name = path;
		file.path = path;
		file.join(chunks);
		file.write();
		return file;
	}

	public split(): Chunk [] {
		const chunks: Chunk[] = [];
		const chunkSize: number = Config.getInstance().dht.chunkSize;

		// if there is no content, read the file
		if(!this.content){
			this.read();
		}

		// generate chunks
	    for (var i = 0; i < this.content.length; i += chunkSize) {
	        let bufferChunk:Buffer = this.content.slice(i, i+chunkSize);
			let chunk: Chunk = Chunk.buildWithValue(bufferChunk);
			chunks.push(chunk);
	   	}

	   	return chunks;
	}

	public join(chunks:Chunk[]){
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


export class Torrent extends FileBitTorrent{

	public file:FileBitTorrent;
	public chunks:Chunk[];

	constructor(){
		super()
		this.file = new FileBitTorrent();
		this.chunks = [];
	}

	public static buildTorrentFromRegularFile(file: FileBitTorrent): Torrent{
		const torrent: Torrent = new Torrent();

		// buld torrent file object
		torrent.file = file;
		torrent.name = file.name + '.torrent';
		torrent.path = file.path + '.torrent';
		torrent.chunks = file.split();

		return torrent;
	}

	public static buildTorrentFromTorrentFile(path: string): Torrent{
		const torrent:Torrent = new Torrent();
		torrent.name = path;
		torrent.path = path;
		torrent.parseTorrentContent();
		return torrent;
	}

	public async store() : Promise<any>{
		const torrent = this;
	   	return new Promise<any>(function(resolve, reject){
	   		const promises: Promise<any>[] = [];
			torrent.chunks.forEach(function(chunk){
				if(!chunk.cid){
					promises.push(chunk.store());
				}
			});
			Promise.all(promises).then(function(){
				torrent.buildTorrentContent();
				torrent.write();
				resolve();
   			}).catch(function(error){
   				reject(error);
   			});
	   	});
	}

	public async resolve() : Promise<any>{
		const torrent = this;
	   	return new Promise<any>(function(resolve, reject){
	   		const promises: Promise<any>[] = [];
			torrent.chunks.forEach(function(chunk){
				if(!chunk.value){
					promises.push(chunk.resolve());
				}
			});
			Promise.all(promises).then(function(){
				torrent.file = FileBitTorrent.buildFromChunks(torrent.file.path, torrent.chunks)
				resolve();
   			}).catch(function(error){
   				reject(error);
   			});
	   	});
	}

	private buildTorrentContent(): any{
		const torrentInfo:any = {
			name: this.file.name,
			path: this.file.path,
			created: new Date(),
			comment: 'created during the final days of humanity after the arrival of covid19',
			files: [{
				path: this.file.path,
				name: this.file.name,
				length: this.file.content.length,
				offset: 0,
			}],
			length: this.file.content.length,
			pieceLength: Config.getInstance().dht.chunkSize,
			lastPieceLength: this.chunks[this.chunks.length-1].value.length,
			pieces: []
		};

		// complete torrent info
		this.chunks.forEach( chunk => {
			torrentInfo.pieces.push(chunk.cid.toString('base64'));
		});

		this.content = Buffer.from(JSON.stringify({info:torrentInfo}));
	}

	private parseTorrentContent(){
		// read if content not loaded
		if(!this.content){
			this.read();
		}
		// parse content
		const torrentInfo:any = JSON.parse(this.content.toString('utf-8'));

		this.file.path = torrentInfo.info.name;
		this.file.name = torrentInfo.info.path;
		for(var i=0; i<torrentInfo.info.pieces.length; i++){
			const piece = torrentInfo.info.pieces[i];
			this.chunks.push(Chunk.buildWithCid(Buffer.from(piece, 'base64')));
		}
	}
}