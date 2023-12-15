import net, { Server, Socket } from 'net';
import { AbstractConnection } from './AbstractConnection';
import { ConnectionStatus } from './ConnectionStatus';
import { ensureError } from '../utils/ErrorUtil';

export enum MonitorConnectionEvent {
    Status = 'monitor:status',    
    Data = 'monitor:data',
    Heartbeat = 'monitor:heartbeat',
}

/**
 * Starts listening and manages connection from launch monitor.  In most cases this will 
 * listen on the default 0921 port.   Once connected it's managed the data is processed
 * in:
 * - written data is sent directly to the launch monitor
 * - messages from the launch monitor are published to monitor:data listeners
 */
export class MonitorConnection extends AbstractConnection {
  private server?: Server;

  constructor() {
    super();
  }

  listen(port: number = 921) {
    if (this.server) {
      this.server.close();
    }

    this.server = net.createServer();
    this.server.on('connection', (conn) => this.onConnection(conn));
    this.server.on('error', (error) => {
      const err = ensureError(error);
      this.emit(MonitorConnectionEvent.Status, {
        status: ConnectionStatus.Error,
        message: err.message
      });
    })
    this.server.listen(port);
  }

  disconnect() {
    this.socket?.end();
    this.socket?.destroy();
    this.socket = undefined;

    this.server?.close();
    this.server = undefined;
  }

  private onConnection(conn: Socket) {
    this.socket = conn;
    this.socket.on('close', () => this.onClose());
    this.socket.on('data', (data) => this.onData(data));
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
