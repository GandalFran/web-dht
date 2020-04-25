// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as OS from 'os';
import BittorrentDHT = require('bittorrent-dht');


import { Log } from '../log';
import { Config } from '../config';
import { Chunk } from '../models/chunk';


export class DHT {

	private static singletonInstance: DHT = null;

	public static getInstance(): DHT {
		if (! DHT.singletonInstance) {
			DHT.singletonInstance = new DHT();
            DHT.singletonInstance.init();
        }
        return DHT.singletonInstance;
	}

	private dht: any;
	private dhtId: any;
	private peers: any [];

	constructor(){
		this.dht = null;	
		this.dhtId = null;
		this.peers = new Array();
	}

	private async init(){
		await this.generateId();
		await this.initDht();
	}

	public generateId(){
		const ifaces = OS.networkInterfaces();
		const iface = ifaces[Config.getInstance().dht.idIface];

		// obtain mac
		let mac = null;
		if(iface !== undefined){
			mac = iface[0].mac;
			Log.debug(`[DHT] Using the iface ${Config.getInstance().dht.idIface} MAC address ${mac} as id`);
		}else{
			Log.error(`[DHT] The iface ${Config.getInstance().dht.idIface} was not found, looking for other ifaces`, null);

			let availableIfaces: any = [];
			Object.keys(ifaces).forEach(aIface => {
				availableIfaces.push(aIface);
			});
			const selectedIface = availableIfaces[0];
			mac = availableIfaces[selectedIface][0].mac;

			Log.debug(`[DHT] Using the iface ${selectedIface} MAC address ${mac} as id`);
		}

		// generate id with mac
		const id = mac + Math.floor(Math.random() * 10000);
		this.dhtId = Buffer.alloc(20).fill(mac);
		Log.info(`[DHT] assigned id ${this.dhtId}`);
	}

	private async initDht(){
		try{
			const opts = {
				nodeId: this.dhtId,
				host: false,
  				bootstrap: [Config.getInstance().dht.bootstrapPeer],
			  	concurrency: 16,
			  	timeBucketOutdated: 900000,
				maxAge: Infinity
			}

			// instance and start listening
			this.dht = new BittorrentDHT(opts);

			// register events
			this.dht.on('ready', function(){
				Log.debug(`[DHT] ready`);
			});
			this.dht.on('peer', function(peer:any, infoHash:any, from:any){
				Log.debug(`[DHT] found potential peer ${JSON.stringify(peer)}`);
			});
			this.dht.on('node', function(node:any){
				Log.debug(`[DHT] find new node ${node.id.toString('utf8')} on ${node.host}:${node.port}`);
			});
			this.dht.on('announce', function(peer:any, infoHash:any){
				Log.debug(`[DHT] announced ${JSON.stringify(peer)}`);
			});
			this.dht.on('warning', function(error:any){
				Log.warning(`[DHT]`, error);
			});
			this.dht.on('error', function(error:any){
				Log.error(`[DHT]`, error);
			});

			// start
			const dht = this.dht;
			const id = this.dhtId;
			this.dht.listen(Config.getInstance().dht.port, function () {
				Log.info(`[DHT] listening on port ${Config.getInstance().dht.port}`);
				setInterval(function(){dht.announce(id)}, 5000);
			})
		}catch(e){
			Log.error('[DHT] excepccion occured on start', e);
		}
	}

	public async close(){
		clearInterval();
		await this.dht.destroy();
	}

	public async put(chunk: Chunk):Promise<Buffer>{
		const dht = this.dht;
		return new Promise<Buffer>(function(resolve, reject) {
			dht.put(chunk.value, (err:any, cid:any) => {
				if(err){
					Log.error(`[DHT] put error`, err);
					reject(err);
				}else{
					Log.debug(`[DHT] put '${cid.toString('base64')}' success`);
					resolve(cid);
				}
			});
		});
	}

	public async get(chunk: Chunk): Promise<Buffer>{
		const dht = this.dht;
		return new Promise<Buffer>(function(resolve, reject) {
			dht.lookup(chunk.cid, (error:any) => {
				if(error){
					Log.error(`[DHT] get lookup error`, error);
					reject(error);
				}else{
					dht.get(chunk.cid, (err:any, value:any) => {
						if(err){
							Log.error(`[DHT] get '${chunk.cid.toString('base64')}' error `, err);
							reject(err);
						}else if(value === null){
							Log.error(`[DHT] get not found value for '${chunk.cid.toString('base64')}' `, null);
							reject(null);
						}else{
							Log.debug(`[DHT] get '${chunk.cid.toString('base64')}' success`);
							resolve(value.v)
						}
					});
				}
			});
		});
	}

}