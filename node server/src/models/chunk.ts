
import { DHT } from "../models/dht";

export class Chunk {

	public cid:Buffer;
	public value:Buffer;

	constructor(){
		this.cid = null;
		this.value = null;
	}


	// TODO: HECTOR AQUI ESTA EL PROBLEMA
	public static buildWithValue(value: Buffer): Chunk{
		const chunk: Chunk = new Chunk();
		chunk.value = value;
		chunk.cid = Promise.resolve(DHT.getInstance().put(chunk));
		return chunk;
	}
	
	// TODO: HECTOR AQUI ESTA EL PROBLEMA
	public static buildWithCid(cid: Buffer): Chunk{
		const chunk: Chunk = new Chunk();
		chunk.cid = cid;
		chunk.value = Promise.resolve(DHT.getInstance().get(chunk));
		return chunk;
	}
}