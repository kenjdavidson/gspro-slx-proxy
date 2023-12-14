import net, { Server } from 'net';
import { AbstractConnection } from './AbstractConnection';
import { ConnectionStatus } from './ConnectionStatus';
import { ensureError } from '../utils/ErrorUtil';

export enum MonitorConnectionEvent {
    Status = 'monitor:status',    
    Data = 'monitor:data',
    Heartbeat = 'monitor:heartbeat',
}

export class MonitorConnection extends AbstractConnection {
  private server?: Server;

  constructor(port: number = 921) {
    super(port);
  }

  listen() {
    this.server = net.createServer((conn) => {
      this.socket = conn;
      this.socket.on('connect', () => this.onConnection());
      this.socket.on('close', () => this.onClose());
      this.socket.on('data', (data) => this.onData(data));
    });
  }

  disconnect() {

  }

  private onConnection() {
    this.server?.close(() => this.onClose())
    this.updateStatus(ConnectionStatus.Connected);
  }

  private onClose() {
    try {
        this.socket?.destroy();        
    } catch(error: unknown) {
        const err = ensureError(error);
        this.handleError(err.message);
    } finally {
        this.socket = undefined;
        this.server = undefined;
    }
  }

  private onData(data: Buffer) {    
    // Heartbeat or Shot data
    this.emit(MonitorConnectionEvent.Data, JSON.parse(data.toString()));
  }
}
