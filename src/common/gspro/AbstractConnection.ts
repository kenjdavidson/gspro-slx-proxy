import { Socket } from 'net';
import { EventEmitter } from 'node:events';
import { ConnectionStatus } from './ConnectionStatus';
import { GsproConnectionEvent } from './GsproConnection';

export abstract class AbstractConnection extends EventEmitter {
  protected port: number;
  protected address: string;
  protected connectionStatus: ConnectionStatus;
  protected socket?: Socket;

  constructor(port: number, address: string = '127.0.0.1') {
    super();

    this.port = port;
    this.address = address;
    this.connectionStatus = ConnectionStatus.Disconnected;
  }

  write(data: Buffer | string) {
    this.socket?.write(data);
  }

  protected updateStatus(status: ConnectionStatus) {
    this.emit(GsproConnectionEvent.Status, { status });
    this.connectionStatus = status;
  }

  protected handleError(error: string) {
    this.emit(GsproConnectionEvent.Status, {
      status: ConnectionStatus.Error,
      error,
    });
    this.connectionStatus = ConnectionStatus.Error;
  }

  getConnectionStatus() {
    return this.connectionStatus;
  }

  getPort() {
    return this.port;
  }
}
