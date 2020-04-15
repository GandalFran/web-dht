// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";


import * as Libp2p from 'libp2p';
import * as KadDHT from 'libp2p-kad-dht';


export class DHT {


	private node: any;


	constructor(){
		
	}

	public async init(){
		this.node = await Libp2p.create({
		  modules: {
		    transport: [ TCP ],
		    streamMuxer: [ Mplex ],
		    connEncryption: [ SECIO ],
		    // this module will handle the peer and content routing
		    dht: KadDHT
		  },
		  config: {
		    dht: {
		      enabled: true
		    }
		  }
		})
	}


	public put(){

	}

	public get(){

	}
}