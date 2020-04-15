

export class Chunk {

	public hash:string;
	public contentPath:string;
	private cachedConent:string;

	constructor(content:string){
		this.contentPath = content;
		this.cachedConent = content;
		this.hash = this.calculateHash();
	}

	public content(): string{
		if(!this.cachedConent){
			this.load();
		}
		return this.cachedConent;
	}

	private load(): void{
		this.cachedConent = "content loaded from contentPath";
	}

	private calculateHash():string{
		return "a hash";
	}
}