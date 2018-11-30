import config from 'configApi/config';
import WebSocketClient from './WebSocketClient';

let instance = null;

class WebSocketSingleton {
    constructor () {
        if (!instance) {
            instance = this;
        }
        this.webSocketClient = new WebSocketClient({ wsUrl: config[process.env.NODE_ENV].webSocketUrl});
        return instance;
    }
}

export const webSocketClient = new WebSocketSingleton().webSocketClient;
