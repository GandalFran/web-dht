// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import { Chunk } from "./chunk"
import * as FileSystem from "fs";

export class File {

	public path:string;
	public content:Buffer;

	constructor(path:string){
		this.path = path;
		this.content = null;
	}

	public load(){
		this.content = FileSystem.readFileSync(this.path);
	}

	public split(): Chunk []{
		if(this.content === null)
			this.load();

		const chunks = new Array();
		// TODO
		return chunks;
	}

	public join(path:string){
		// TODO
	}
}