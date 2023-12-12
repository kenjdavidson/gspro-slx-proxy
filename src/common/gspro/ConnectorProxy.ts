import EventEmitter from 'events';
import net, { Server, Socket } from 'net';

export enum ConnectionProxyEvents {
    Started = 'proxy:started',
    Stopped = 'proxy:stopped',
    MonitorConnected = 'proxy:monitor-connected',
    MonitorDisconnected = 'proxy:monitor-disconnected',
    GsproConnected = 'proxy:gspro-connected',
    GsproDisconnected = 'proxy:gspro-disconnected',
    Error = 'proxy:error'
}

export class ConnectionProxy extends EventEmitter {
    #server?: Server;
    #monitorSocket?: Socket;
    #gsproSocket?: Socket;    

    start(port: number) {
        this.#connectToGspro(port);
        this.#listenForMonitor();
    }

    #listenForMonitor() {
        this.#server = net.createServer(this.#onMonitorConnection)
    }

    #onMonitorConnection(localSocket: Socket) {
        this.#server?.close();     

        this.#monitorSocket = localSocket;
        this.#monitorSocket.on('connect', () => this.emit(ConnectionProxyEvents.MonitorConnected));
        this.#monitorSocket.on('close', () => this.stop());
        this.#monitorSocket.on('data', (data) => this.#gsproSocket?.write(data));
    }

    #connectToGspro(port: number) {
        if (this.#gsproSocket) {
            this.#handleError(`Already connected to ${this.#gsproSocket.localAddress}`, `Attempting to connect to GSPro`);
        }

        try {
            this.#gsproSocket = new Socket();
            this.#gsproSocket.connect(port); 
            this.#gsproSocket.on('connect', () => this.emit(ConnectionProxyEvents.GsproConnected));
            this.#gsproSocket.on('close', () => this.stop());
            this.#gsproSocket.on('data', (data) => this.#monitorSocket?.write(data))

            this.emit(ConnectionProxyEvents.GsproConnected);
        } catch(error) {
            this.#handleError(error, `Connecting to GSPro`);      
        }
    }

    stop() {
        try {
            this.#monitorSocket && this.#disconnectSocket(this.#monitorSocket);
            this.emit(ConnectionProxyEvents.MonitorDisconnected);
    
            this.#gsproSocket && this.#disconnectSocket(this.#gsproSocket);
            this.emit(ConnectionProxyEvents.GsproDisconnected);
    
            this.emit(ConnectionProxyEvents.Stopped);
        } catch(error) {
            this.#handleError(error, `Stopping proxy`);
        }
    }

    #disconnectSocket(socket: Socket) {
        try {
            socket.destroy(Error('disconnect requested'));
        } catch(error) {
            this.#handleError(error, `Attempting to disconnect connection ${socket.localAddress}`);
        }
    }

    isConnected(): boolean[] {
        return [
            this.#monitorSocket?.readable || false,
            this.#gsproSocket?.writable || false
        ];
    }

    #handleError(error: unknown, attempting: string) {
        function ensure(error: unknown): Error {
            if (error instanceof Error) return error;
            return new Error(`${attempting}: ${JSON.stringify(error)}`)
        }
        const actualErr = ensure(error);

        this.emit(ConnectionProxyEvents.Error, actualErr);
        console.error(actualErr);
        throw actualErr;        
    }
}

export default new ConnectionProxy();