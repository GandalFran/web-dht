export class webSocketMessage {
    type: string;
    id: string;
    nodes: string[];

    constructor(type: string, id: string, nodes: string[]){
        this.type = type;
        this.id = id;
        this.nodes = nodes;
    }
}