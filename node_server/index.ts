// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import { Log } from "./src/log"
import { Config } from "./src/config"
import { DHT } from "./src/models/dht";
import { DHTApplication } from "./src/app";
import { CrashGuard } from "./src/crashGuard";

// start crash guard
CrashGuard.start();

// set log level
Log.setLogLevel(Config.getInstance().log);

// start the DHT 
DHT.getInstance();

// start express application
DHTApplication.getInstance().start();

// register handler for exit and destroy dht
/*
process.on('exit', async function (){
	try{
		await DHT.getInstance().close();
	}catch(err){
		Log.info(`[DHT] the dht destroy doesn't gone properly good`);
	}
});
process.on('SIGINT', async function (){
	try{
		await DHT.getInstance().close();
	}catch(err){
		Log.info(`[DHT] the dht destroy doesn't gone properly good`);
	}
});
*/

/*
import * as FileSystem from "fs";
import { Chunk } from "./src/models/chunk";
import { FileBitTorrent, Torrent } from "./src/models/file";
import { Uploads, Upload } from "./src/models/uploads";
import { Downloads, Download } from "./src/models/downloads";


const fileName = './test/imagen.jpg';

const uploads = new Uploads()
setTimeout(async function(){
	const path:string = fileName;
	let torrentFile: Torrent = null;
	
	try{
		console.error('creating torrent')
		const id = uploads.id()
		const file:FileBitTorrent = FileBitTorrent.buildFromPath(path, 'imagen.jpg');
	    torrentFile = Torrent.buildTorrentFromRegularFile(file);

		console.error('uploading torrent')
		uploads.create(id, torrentFile);
		await uploads.get(id).wait();
		FileSystem.renameSync(file.path, './test/original.imagen.jpg')		
		FileSystem.renameSync(torrentFile.path, './test/prueba.torrent')	
	}catch(error){
		Log.error("[INDEX] buildTorrentFromFile", error);
	}	
}, 5000)


const downloads = new Downloads()
setTimeout(async function(){
	const torrentPath:string = './test/prueba.torrent';
	try{
		const id = downloads.id()
	    const torrentFile2: Torrent = Torrent.buildTorrentFromTorrentFile(torrentPath, './', 'descargada_');
	    downloads.create(id, torrentFile2);
	    await downloads.get(id).wait();
	   	FileSystem.renameSync(torrentFile2.file.path, './test/descargada.imagen.jpg')		
	}catch(error){
		Log.error("[INDEX] buildTorrentFromFile", error);
	}

}, 20000)
*/