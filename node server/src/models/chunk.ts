
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
		Promise.resolve(DHT.getInstance().put(chunk)).then(function(result){
			chunk.cid = result;
		}).catch(function(error){
			Log.error("[CHUNK]",error);
		});
		return chunk;
	}
	
	public static buildWithCid(cid: Buffer): Chunk{
		const chunk: Chunk = new Chunk();
		chunk.cid = cid;
		Promise.resolve(DHT.getInstance().get(chunk)).then(function(result){
			chunk.value = result;
		}).catch(function(error){
			Log.error("[CHUNK]",error);
		});
		return chunk;
	}
}