// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as FileSystem from "fs";
import * as ParseTorrent from 'parse-torrent';


import { Log } from "../log"
import { Chunk } from "./chunk"
import { Config } from "../config"

/**
 * Bean representing a file to upload to bittorent
 */
export class FileBitTorrent {

	public name:string;
	public path:string;
	public content:Buffer;

	constructor(){
		this.name = '';
		this.path = '';
		this.content = null;
	}

	/**
	 * Builds a FilBittorrent object with the file's path
	 * @param path the real file's path
	 * @param name the given file's name
	 * @return a File instanced from the given path and name with the content loaded into the content attribute.
	 */
	public static buildFromPath(path:string, name:string) : FileBitTorrent{
		const file:FileBitTorrent = new FileBitTorrent();
		file.name = name;
		file.path = path;
		file.read();
		return file;
	}

	/**
	 * Builds a FilBittorrent object with the file's content splitted in chunks
	 * @param path the real file's path
	 * @param name the given file's name
	 * @param chunks the given file's content splitted in chunks
	 * @return a File instanced from the given path and name with the content persisted into the file's path.
	 */
	public static buildFromChunks(path:string, name:string, chunks:Chunk[]): FileBitTorrent {
		const file:FileBitTorrent = new FileBitTorrent();
		file.name = name;
		file.path = path;
		file.join(chunks);
		file.write();
		return file;
	}

	/**
	 * Splits the file content in chunks of Config.getInstance().dht.chunkSize bytes.
	 */
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

	/**
	 * Joins the file content splitted chunks into a single buffer.
	 */
	public join(chunks:Chunk[]){
		const bufferChunks: Buffer[] = [];
		chunks.forEach( chunk => {
			bufferChunks.push(chunk.value);
		});
		this.content = Buffer.concat(bufferChunks);
	}

	/**
	 * Reads the file content and loads it into the content attribute.
	 */
	protected read(){
		this.content = FileSystem.readFileSync(this.path);
	}

	/**
	 * Writes the file content (stored in the content attribute) into the file's path.
	 */
	protected write(){
		FileSystem.writeFileSync(this.path, this.content);
	}
}

/**
 * Bean representing a torrent file resulting from an upload to bittorent
 */
export class Torrent extends FileBitTorrent{

	public file:FileBitTorrent;
	public chunks:Chunk[];

	constructor(){
		super()
		this.file = new FileBitTorrent();
		this.chunks = [];
	}

	/**
	 * Builds a Torrent object with a regular file
	 * @param file the file to build the torrent
	 * @return a Torrent instanced from the given file.
	 */
	public static buildTorrentFromRegularFile(file: FileBitTorrent): Torrent{
		const torrent: Torrent = new Torrent();

		// buld torrent file object
		torrent.file = file;
		torrent.name = file.name + '.torrent';
		torrent.path = file.path + '.torrent';
		torrent.chunks = file.split();

		return torrent;
	}

	/**
	 * Builds a Torrent object with a torrent file
	 * @param path the torrent file path
	 * @param filePath the location to store the file associated to the torrent if is downloaded
	 * @param fileNamePrefix the name prefix used to avoid conflicts on files with the same name downloaded from the DHT.
	 * @return a Torrent instanced from the given parameters, and with the list of chunk's cids loaded.
	 */
	public static buildTorrentFromTorrentFile(path: string, filePath:string, fileNamePrefix:string): Torrent{
		const torrent:Torrent = new Torrent();
		torrent.name = path;
		torrent.path = path;
		torrent.file.path = filePath;
		torrent.file.name = fileNamePrefix;
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
				torrent.file = FileBitTorrent.buildFromChunks(torrent.file.path, torrent.file.name, torrent.chunks)
				resolve();
   			}).catch(function(error){
   				reject(error);
   			});
	   	});
	}

	private buildTorrentContent(): any{
		const torrentInfo:any = {
			name: this.file.name,
			path: this.file.name,
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

		this.file.name = torrentInfo.info.name;
		this.file.path = this.file.path + '/' + this.file.name + torrentInfo.info.name;
		for(var i=0; i<torrentInfo.info.pieces.length; i++){
			const piece = torrentInfo.info.pieces[i];
			this.chunks.push(Chunk.buildWithCid(Buffer.from(piece, 'base64')));
		}
	}
}