
import { DHT } from "../models/dht";

export class Chunk {

	public cid:Buffer;
	public value:Buffer;

	constructor(){
		this.cid = null;
		this.value = null;
	}

	public static fidnByBuffer(value: Buffer): Chunk{
		const chunk: Chunk = new Chunk();
		chunk.value = value;
		chunk.cid = DHT.getInstance().cid(value);
		return chunk;
	}

	public static async findByCid(cid: Buffer): Promise<Chunk>{
		const chunk: Chunk = new Chunk();
		chunk.cid = cid;
		chunk.value = await DHT.getInstance().get(chunk);
		return chunk;
	}
}