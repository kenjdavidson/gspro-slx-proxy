import EventEmitter from 'events';
import net, { Socket } from 'net';
import { ConnectionStatus } from '../ConnectionStatus';
import { ensureError } from '../utils/errorUtils';

export enum GsproConnectionEvent {
  Status = 'gspro:status',
  Data = 'gspro:data',
}

/**
 * Provides communication with the GSPConnect service. After connection it will handle messages by:
 * - writing all data directly to the GSPConnect service
 * - reading all data and emitting to the listeners of gspro:data events
 */
export class GsproConnection extends EventEmitter {
  private socket?: Socket;
  private connectionStatus: ConnectionStatus;

  constructor() {
    super();

    this.connectionStatus = ConnectionStatus.Disconnected;
  }

  /**
   * Attempt to connect to the GSPConnect service.  If there is already a connection
   * the request is skipped.
   *
   * @param port in which to connect
   * @param address of host to connect, defaults to 127.0.0.1
   * @returns
   */
  connect(port: number, address: string = '127.0.0.1') {
    if (this.socket) {
      throw new Error('Already connected to GSPro, disconnect first');
    }

    try {
      this.updateStatus(ConnectionStatus.Connecting);

      this.socket = net.connect(port, address);
      this.onConnection();
    } catch (error: unknown) {
      const err = ensureError(error);
      this.handleError(err.message);
    }
  }

  /**
   * Disonnect from the GSPConnect service.
   */
  disconnect() {
    if (this.socket) {
      this.socket?.destroy();
      this.socket?.removeAllListeners();
      this.socket = undefined;

      this.updateStatus(ConnectionStatus.Disconnected);
    }
  }

  write(data: Buffer | string) {
    this.socket?.write(data);
  }

  private onConnection() {
    this.socket?.setTimeout(0);
    this.socket?.on('timeout', () => this.disconnect());
    this.socket?.on('close', () => this.disconnect());
    this.socket?.on('error', (error) => this.onError(error));
    this.socket?.on('data', (data) => this.onData(data));
    this.socket?.on('connect', () => this.updateStatus(ConnectionStatus.Connected));
  }

  private onError(error: unknown) {
    console.log(`GsproConnection#onError`, JSON.stringify(error));
    this.handleError(`Error connecting to GSPro, see logs for details`);
  }

  /**
   * Handles data by parsing into GSConnectToMonitor and sends to any listener on gspro:data events.
   *
   * At this point it's a 1:1 of data to message.  If this turns out to cause problems, it'l get
   * updated to buffer the data until a full JSON message (empty {} stack).
   *
   * @param data received Buffer
   */
  private onData(data: Buffer) {
    console.log(`onData`, data);
    // const gsproEvent = JSON.parse(data.toString()) as GSConnectToMonitor;
    // this.emit(GsproConnectionEvent.Data, gsproEvent);
  }

  private updateStatus(status: ConnectionStatus) {
    this.emit(GsproConnectionEvent.Status, { status });
    this.connectionStatus = status;
  }

  private handleError(error: string) {
    this.connectionStatus = ConnectionStatus.Error;
    this.emit(GsproConnectionEvent.Status, {
      status: ConnectionStatus.Error,
      message: error,
    });
  }

  getConnectionStatus() {
    return this.connectionStatus;
  }
}
