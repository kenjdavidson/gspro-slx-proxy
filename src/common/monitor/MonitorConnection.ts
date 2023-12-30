import EventEmitter from 'events';
import net, { Server, Socket } from 'net';
import { ConnectionStatus } from '../ConnectionStatus';
import { ensureError } from '../utils/errorUtils';

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
export class MonitorConnection extends EventEmitter {
  private server?: Server;
  private socket?: Socket;
  private connectionStatus: ConnectionStatus;

  constructor() {
    super();

    this.connectionStatus = ConnectionStatus.Disconnected;
  }

  listen(port: number = 921) {
    if (this.server) {
      this.server.close();
    }

    console.log(`MonitorConnection#listen Listening for monitor connections on port ${port}`);
    this.server = net.createServer();
    this.server.on('connection', (conn) => this.onConnection(conn));
    this.server.on('error', (error) => {
      const err = ensureError(error);
      this.emit(MonitorConnectionEvent.Status, {
        status: ConnectionStatus.Error,
        message: err.message,
      });
      this.onClose();
    });

    try {
      this.updateStatus(ConnectionStatus.Connecting);
      this.server.listen(port);
    } catch (error) {
      this.handleError(error);
    }
  }

  disconnect() {
    this.onClose();
  }

  write(data: Buffer | string) {
    try {
      if (this.socket?.writable) {
        this.socket?.write(data);
      } else {
        throw new Error(`Unable to write to Monitor`);
      }
    } catch (err) {
      this.handleError(err);
    }
  }

  private onConnection(conn: Socket) {
    if (this.socket && this.connectionStatus === ConnectionStatus.Connected) {
      conn.destroy(new Error('Monitor is already connected'));
    }

    this.updateStatus(ConnectionStatus.Connected);

    this.socket = conn;
    this.socket.on('close', () => this.onClose());
    this.socket.on('data', (data) => this.onData(data));
  }

  private onClose() {
    console.log(`MonitorConnection#onClose disconnecting and closing connections`);
    try {
      this.socket?.destroy();
      this.server?.close();

      this.updateStatus(ConnectionStatus.Disconnected);

      this.socket = undefined;
      this.server = undefined;
    } catch (error: unknown) {
      const err = ensureError(error);
      this.handleError(err.message);
    }
  }

  private onData(data: Buffer) {
    this.emit(MonitorConnectionEvent.Data, JSON.parse(data.toString()));
  }

  private updateStatus(status: ConnectionStatus) {
    this.emit(MonitorConnectionEvent.Status, { status });
    this.connectionStatus = status;
  }

  private handleError(error: unknown) {
    const err = ensureError(error);
    console.log(`MonitorConnection::error ${err}`);
    this.emit(MonitorConnectionEvent.Status, {
      status: ConnectionStatus.Error,
      error: err.message,
    });
    this.connectionStatus = ConnectionStatus.Error;
  }

  getConnectionStatus() {
    return this.connectionStatus;
  }
}
