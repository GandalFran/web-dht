import * as WebSocket from 'ws';
import * as Constants from '../util/constantsServer';
import { webSocketMessage } from '../models/webSocketMessage';

const wss = new WebSocket.Server({
    port: Constants.WEB_SOCKET_PORT,
});

wss.on('connection',function(ws: WebSocket){
    ws.on('message', function incoming(messageData: webSocketMessage) {

        if(messageData.type == Constants.REQUEST_TYPE){
            let newMessage = new webSocketMessage(Constants.RESPONSE_TYPE,"5",["7","8"]);
            console.log("Recibo peticion");
            //Se almacenaría el nuevo
            ws.send(newMessage);
        }else if(messageData.type == Constants.RESPONSE_TYPE){
            //Almacenar la info de la respuesta
            console.log(messageData);
        }else{
            console.log("Recibo mensaje para realizar petición");
            let newMessage = new webSocketMessage(Constants.REQUEST_TYPE,"3",null);
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                  client.send(newMessage);
                }
            });

            ws.send("ok");
        }
        
    });
});


