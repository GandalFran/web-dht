import * as WebSocket from 'ws';
import * as Constants from '../util/constantsServer';
import { webSocketMessage } from '../models/webSocketMessage';

const wss = new WebSocket(Constants.URL_TRACKER);

let newMessage = new webSocketMessage(Constants.DO_REQUEST_TYPE,null,null);
wss.send(newMessage);

wss.on('message', function incoming(messageData) {
    console.log(messageData);
});
