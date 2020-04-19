// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import { Chunk } from "./chunk"
import * as FileSystem from "fs";

export class file {

	public path:string;
	public content:Buffer;

	constructor(){
		
	}

	public load(){
		this.content = FileSystem.readFileSync(this.path);
	}

	public split(): Chunk []{
		const chunks = new Array();
		// TODO
		return chunks;
	}

	public static join(){
		// TODO
	}
}