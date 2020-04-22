
import { DHT } from "../models/dht";

export class Chunk {

	public cid:Buffer;
	public value:Buffer;

	constructor(){
		this.cid = null;
		this.value = null;
	}

	public static async buildWithValue(value: Buffer): Promise<Chunk>{
		const chunk: Chunk = new Chunk();
		chunk.value = value;
		chunk.cid = await DHT.getInstance().put(chunk);
		return chunk;
	}

	public static async buildWithCid(cid: Buffer): Promise<Chunk>{
		const chunk: Chunk = new Chunk();
		chunk.cid = cid;
		chunk.value = await DHT.getInstance().get(chunk);
		return chunk;
	}
}