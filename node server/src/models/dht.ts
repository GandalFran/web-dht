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
	private arrayPromises : any[];

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
		this.dhtId = Buffer.alloc(20).fill(mac);
		Log.info(`[DHT] assigned id ${this.dhtId}`);
	}

	private async initDht(){
		try{
			const opts = {
				nodeId: this.dhtId,
				host: false,
  				//bootstrap: [],   // bootstrap servers (default: router.bittorrent.com:6881, router.utorrent.com:6881, dht.transmissionbt.com:6881)
			  	concurrency: 16,
			  	timeBucketOutdated: 900000, // check buckets every 15min
				maxAge: Infinity
			}
			// instance and start listening
			this.dht = new BittorrentDHT(opts);
			this.dht.listen(Config.getInstance().dht.port, function () {
				Log.info(`[DHT] listening on port ${Config.getInstance().dht.port}`);
			})
		}catch(e){
			Log.error('[DHT] excepccion occured on start', e);
		}
	}

	public registerPeer(host:string, port:string){
		const peer = {
			host: host,
			port: port
		};
		this.peers.push(peer);
		this.dht.addNode(peer);
		Log.info('Added node ${peer}');
	}

	public async put(chunk: Chunk):Promise<Buffer>{
		Log.debug(`[DHT] put '${chunk.value.toString('utf8')}'\n`);
		const dht = this.dht;
		return new Promise<Buffer>(function(resolve, reject) {
			dht.put(chunk.value, (err:any, cid:any) => {
				if(err){
					Log.error(`[DHT] put '${chunk.value.toString('utf8')}' error `, err);
					reject(err);
				}else{
					Log.debug(`[DHT] put '${chunk.value.toString('utf8')}' success -> cid '${cid.toString('utf8')}'`);
					resolve(cid)
				}
			});
		});
	}

	public async get(chunk: Chunk): Promise<Buffer>{
		Log.debug(`[DHT] get '${chunk.cid.toString('utf8')}'`);
		const dht = this.dht;
		return new Promise<Buffer>(function(resolve, reject) {
			dht.get(chunk.cid, (err:any, value:any) => {
				if(err){
					Log.error(`[DHT] get '${chunk.cid.toString('utf8')}' error `, err);
					reject(err);
				}else{
					Log.debug(`[DHT] get '${chunk.cid.toString('utf8')}' success -> value '${value.v.toString('utf8')}'`);
					resolve(value.v)
				}
			})
		});
	}

}