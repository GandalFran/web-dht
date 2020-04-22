
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
		chunk.cid = Promise.resolve(DHT.getInstance().put(chunk));
		return chunk;
	}

	public static buildWithCid(cid: Buffer): Chunk{
		const chunk: Chunk = new Chunk();
		chunk.cid = cid;
		chunk.value = Promise.resolve(DHT.getInstance().get(chunk));
		return chunk;
	}
}