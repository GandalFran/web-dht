// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import Libp2p = require('libp2p');
import TCP = require('libp2p-tcp');
import Mplex = require('libp2p-mplex');
import SECIO = require('libp2p-secio');
import PeerInfo = require('peer-info');
import KadDHT = require('libp2p-kad-dht');


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

	private node: any;
	private peerInfo: any;
	private peers: any [];

	constructor(){
		this.node = null;	
		this.peerInfo = null;
		this.peers = new Array();
	}

	private init(){
		this.arrayPromises.push(this.initPeerInfo());
		this.arrayPromises.push(this.initDhtNode());

		Promise.all(this.arrayPromises)
			.then(() => {
				//Here all have been done right
				console.log("Todo OK :D");
			})
			.catch(() => {
				//Here some have functions have errors
				console.log("Algo ha ido mal D:");
			});
		//await this.initPeerInfo();
		//await this.initDhtNode();
		Log.info(`[DHT] dht started`);
	}

	private initPeerInfo(){
		return new Promise((resolve,reject) => {
			//Make neccesary start things and if it goes right resolve() else reject()
			this.peerInfo = PeerInfo.create();

			if(this.peerInfo == undefined){
				reject();
			}else{
				this.peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0');
				Log.info(`[DHT] assigned peer id ${this.peerInfo.id}`);
				resolve();
			}
		});
		
	}

	private initDhtNode(){
		return new Promise((resolve,reject) => {
			try{
				const peerInfo = this.peerInfo;
				this.node = Libp2p.create({
					peerInfo,
					modules: {
					  transport: [TCP],
					  streamMuxer: [Mplex],
					  connEncryption: [SECIO],
					  dht: KadDHT
					},
					config: {
					  dht: {
						enabled: true
					  }
					}
				  })
				this.node.start()
				resolve();
			}catch(e){
				Log.error('[DHT] excepccion occured on start', e);
				reject();
			}
		});
	}

	public registerPeer(peer:any){
		Log.info(`[DHT] registering peer with id ${peer.id}`);
		let isRegistered = false;
		this.peers.forEach((item, index) => {
			if(item.id === peer.id)
				isRegistered = true;
		});

		if(! isRegistered){
			this.node.dial(peer.peerInfo);
			this.peers.push(peer.peerInfo);
		}
	}

	public put(chunk: Chunk){
		Log.info(`[DHT] put CID ${chunk.cid}`);
		this.node.dht.put(chunk.cid, chunk.value);
	}

	public async get(chunk: Chunk): Promise<Buffer>{
		Log.info(`[DHT] get CID ${chunk.cid}`);
		const value = await this.node.dht.get(chunk.cid);
		return value;
	}

	public cid(value: Buffer): Buffer{
		return this.node.dht.get.bufferToKey(value);
	}
}