// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import * as OS from 'os';

const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp');
const Mplex = require('libp2p-mplex')
const SECIO = require('libp2p-secio')
const PeerInfo = require('peer-info')
const KadDHT = require('libp2p-kad-dht')


import { Log } from '../log'
import { Config } from '../config'


export class DHT {

	private node: any;
	private peerInfo: any;

	constructor(){
		
	}

	public async init(){
		/*
		Log.info(`starting`);
		try{
			Log.debug(`instancing peerInfo`);
			this.peerInfo = await PeerInfo.create(this.generateId());
			Log.debug(`adding new ip`);
			this.peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0');
			Log.debug(`creating node with libp2p`);

			const opts = {
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
			};

			this.node = await Libp2p.create({this.peerInfo, opts});
			Log.debug(`starting node with libp2p`);
			await this.node.start()
		}catch(e){
			Log.error("[DHT] init ", e);
		}*/
	}

	public generateId(){
		const ifaces = OS.networkInterfaces();
		const iface = ifaces[Config.getInstance().dht.idIface];

		let mac = null;
		if(iface !== undefined){
			mac = iface[0].mac;
			Log.info(`Using the iface ${Config.getInstance().dht.idIface} MAC address ${mac} as id`);
		}else{
			Log.error(`The iface ${Config.getInstance().dht.idIface} was not found, looking for other ifaces`, null);
			
			let availableIfaces: any = [];
			Object.keys(ifaces).forEach(aIface => {
				availableIfaces.push(aIface);
			});

			const selectedIface = availableIfaces[0];
			mac = ifaces[selectedIface][0].mac;
			Log.info(`Using the iface ${selectedIface} MAC address ${mac} as id`);
		}
		return mac;
	}
}