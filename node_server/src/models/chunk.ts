
import { Log } from "../log";
import { DHT } from "../models/dht";

/**
 * Bean reperesenting a piece of file.
 */
export class Chunk {

	public cid:Buffer;
	public value:Buffer;

	constructor(){
		this.cid = null;
		this.value = null;
	}

    /**
     * Builds a chunk with the chunk's content
     * @param value the chunk's content
     * @return a Chunk object containign the given buffer
     */
	public static buildWithValue(value: Buffer): Chunk{
		const chunk: Chunk = new Chunk();
		chunk.value = value;
		return chunk;
	}

    /**
     * Builds a chunk with the chunk's CID (DHT's assigned id)
     * @param cid the chunk's cid
     * @return a Chunk object containign the given cid
     */
	public static buildWithCid(cid: Buffer): Chunk{
		const chunk: Chunk = new Chunk();
		chunk.cid = cid;
		return chunk;
	}

    /**
     * Stores the chunk into the DHT and completes the cid attribute.
     * @return a promise that will be fullfillmed when the chunk is 
     *		stored into the DHT.
     */
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

    /**
     * Retrieves a chunk from the DHT and completes the value attribute.
     * @return a promise that will be fullfillmed when the chunk is 
     *		retrieved from the DHT.
     */
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