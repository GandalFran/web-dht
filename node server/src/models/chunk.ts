
import { Log } from "../log";
import { DHT } from "../models/dht";

export class Chunk {

	public cid:Buffer;
	public value:Buffer;

	constructor(){
		this.cid = null;
		this.value = null;
	}

	public static buildWithValue(value: Buffer): Chunk{
		const chunk: Chunk = new Chunk();
		chunk.value = value;
		return chunk;
	}

	public static buildWithCid(cid: Buffer): Chunk{
		const chunk: Chunk = new Chunk();
		chunk.cid = cid;
		return chunk;
	}

	public store(): Promise<any>{	
		const chunk = this;	
		return new Promise<Chunk>(function(resolve, reject) {
			if(!chunk.cid){
				DHT.getInstance().put(chunk).then(function(cid){
					chunk.cid = cid;
					resolve();
				}).catch(function(err){
					reject(err);
				});
			}
		});
	}

	public resolve(): Promise<any>{	
		const chunk = this;	
		return new Promise<Chunk>(function(resolve, reject) {
			if(!chunk.value){
				DHT.getInstance().get(chunk).then(function(value){
					chunk.value = value;
					resolve();
				}).catch(function(err){
					reject(err);
				});
			}
		});
	}
}