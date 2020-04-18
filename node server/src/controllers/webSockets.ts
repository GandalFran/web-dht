import WebSocket from 'ws';
import * as Constants from '../util/constantsServer';
import { webSocketMessage } from '../models/webSocketMessage';

//TODO adaptar a la esctructura peerInfo y no string
let peers: string[];

const wss = new WebSocket.Server({
    port: Constants.WEB_SOCKET_PORT,
});

const wssTracker = new WebSocket(Constants.URL_TRACKER);

wss.on('connection',function(ws: WebSocket){
    ws.on('message', function incoming(messageData: webSocketMessage) {

        if(messageData.type == Constants.REQUEST_TYPE){
            let newMessage = new webSocketMessage(Constants.RESPONSE_TYPE,"5",peers);
            console.log("Recibo peticion");
            //Se almacenaría el nuevo
            if(!peers.includes(messageData.id)){
                peers.push(messageData.id);
            }
            ws.send(newMessage);
        }else if(messageData.type == Constants.RESPONSE_TYPE){
            //Almacenar la info de la respuesta
            console.log("Recibo de "+messageData.id+"cuyo contenido es "+messageData.nodes);
            messageData.nodes.forEach(function(peer){
                if(!peers.includes(peer)){ //TODO habría que adaptar esto cuando suceda peerinfo con un map o algo asi antes del includes
                    peers.push(peer);
                }
            });
        }else{
            console.log("Recibo mensaje para realizar petición");
            let newMessage = new webSocketMessage(Constants.REQUEST_TYPE,"3",null);
            wssTracker.send(newMessage);

            ws.send("ok");
        }
    });
});


