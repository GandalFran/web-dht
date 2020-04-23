
import { Log } from "../log";
import { DHT } from "../models/dht";

export class Chunk {

	public cid:Buffer;
	public value:Buffer;

	constructor(){
		this.cid = null;
		this.value = null;
	}

	public static async buildWithValue(value: Buffer): Promise<Chunk>{
		return new Promise<Chunk>(function(resolve, reject) {
			const chunk: Chunk = new Chunk();
			chunk.value = value;
			DHT.getInstance().put(chunk).then(function(cid){
				chunk.cid = cid;
				resolve(chunk);
			}).catch(function(err){
				reject(err);
			});
		});
	}
	
	public static async buildWithCid(cid: Buffer): Promise<Chunk>{
		return new Promise<Chunk>(function(resolve, reject) {
			const chunk: Chunk = new Chunk();
			chunk.cid = cid;
			DHT.getInstance().get(chunk).then(function(value){
				chunk.value = value;
				resolve(chunk);
			}).catch(function(err){
				reject(err);
			});
		});
	}
}