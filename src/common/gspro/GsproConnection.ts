import { Socket } from 'net';
import { ConnectionStatus } from './ConnectionStatus';
import { ensureError } from '../utils/ErrorUtil';
import { GSConnectToMonitor } from './GsproEvent';
import { AbstractConnection } from './AbstractConnection';

export enum GsproConnectionEvent {
  Status = 'gspro:status',
  Data = 'gspro:data',
}

export class GsproConnection extends AbstractConnection {
  constructor(port: number, address?: string) {
    super(port, address);
  }

  connect() {
    if (this.socket) {
      console.log(`Gspro is already connected`);
      return;
    }

    try {
      this.updateStatus(ConnectionStatus.Connecting);
      this.socket = new Socket();
      this.socket.connect(this.port, this.address);
      this.socket.on('connect', () => this.#onConnection());      
      this.socket.on('timeout', () => this.disconnect());
      this.socket.on('error', (e) => this.#onError(e))  
    } catch (error: unknown) {
      const err = ensureError(error);
      this.handleError(err.message);
    }
  }

  disconnect() {
    try {
      this.socket?.end();
      this.socket?.destroy();
    } catch(error: unknown) {
      const err = ensureError(error);
      this.handleError(err.message);
    } finally {
      this.socket = undefined;
    }
  }

  #onConnection() {
    this.updateStatus(ConnectionStatus.Connected);
    this.socket?.setTimeout(0);
    this.socket?.on('close', () => this.disconnect());
    this.socket?.on('data', (data) => this.#onData(data));
  }

  #onError(error: unknown) {
    const err = ensureError(error);
    this.handleError(err.message);
  }

  #onData(data: Buffer) {
    // At this point just assuming that a data message contains a full JSON object.  If this causes issues 
    // I'll add a stack based JSON tracker to determine when a message comes in.
    const gsproEvent = JSON.parse(data.toString()) as GSConnectToMonitor;
    this.emit(GsproConnectionEvent.Data, gsproEvent);
  }
}
