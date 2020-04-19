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

	private async init(){
		await this.initPeerInfo();
		await this.initDhtNode();
		Log.info(`[DHT] dht started`);
	}

	private async initPeerInfo(){
		this.peerInfo = await PeerInfo.create();
		this.peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0');
		Log.info(`[DHT] assigned peer id ${this.peerInfo.id}`);
	}

	private async initDhtNode(){
		try{
			const peerInfo = this.peerInfo;
			this.node = await Libp2p.create({
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
			await this.node.start()
		}catch(e){
			Log.error('[DHT] excepccion occured on start', e);
		}
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