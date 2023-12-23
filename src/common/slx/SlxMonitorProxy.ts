import { MessagePortMain } from 'electron';
import { ConnectionStatus, ConnectionStatusEvent } from '../ConnectionStatus';
import { GsproConnection, GsproConnectionEvent } from '../gspro/GsproConnection';
import { GSConnectToMonitor } from '../gspro/GsproEvent';
import { MonitorConnection, MonitorConnectionEvent } from '../monitor/MonitorConnection';
import { MonitorToGSConnect, convertToHeartbeat } from '../monitor/MonitorEvent';
import { ensureError } from '../utils/errorUtils';
import { ProxyDataEvent, ProxyErrorEvent, ProxyEventType, ProxyStatusEvent } from './slxMonitorProxyEvents';

export class SlxMonitorProxy {
  private gspro: GsproConnection;
  private monitor: MonitorConnection;
  private port: Pick<MessagePortMain, 'on' | 'postMessage'>;

  constructor(
    _gspro: GsproConnection,
    _monitor: MonitorConnection,
    _port: Pick<MessagePortMain, 'on' | 'postMessage'>
  ) {
    this.gspro = _gspro;
    this.gspro.on(GsproConnectionEvent.Status, (event) => this.onGsproStatus(event));
    this.gspro.on(GsproConnectionEvent.Data, (event) => this.onGsproData(event));

    this.monitor = _monitor;
    this.monitor.on(MonitorConnectionEvent.Status, (event) => this.onMonitorStatus(event));
    this.monitor.on(MonitorConnectionEvent.Data, (data) => this.onMonitorData(data));

    this.port = _port;
    this.port.postMessage({
      type: 'SlxMonitorProxy:initialized',
    });

    this.port.on('message', (event) => {
      console.log(`slxproxy:port:event `, event);
      switch (event.data) {
        case ProxyEventType.ConnectGspro:
          return this.connectGspro(event.data.port || 9050);
        case ProxyEventType.DisconnectGspro:
          return this.disconnectGspro();
        case ProxyEventType.ListenMonitor:
          return this.listenForMonitor(event.data.port);
        case ProxyEventType.DisconnectMonitor:
          return this.disconnectMonitor();
      }
    });
  }

  connectGspro(port: number) {
    if (this.gspro.getConnectionStatus() !== ConnectionStatus.Disconnected) {
      console.log(`Gspro is currently ${this.monitor.getConnectionStatus()}`);
      console.log(`Disconnecting Gspro before attempting to re-connect`);
      this.handleError('gspro', 'Already connected to GSPro, disconnect first');
    }

    try {
      console.log(`SlxMonitorProxy::connectToGspro on port ${port}`);
      this.gspro.connect(port);
    } catch (error) {
      this.handleError('gspro', error);
    }
  }

  disconnectGspro() {
    try {
      console.log(`Disconnecting Gspro`);
      this.gspro.disconnect();
    } catch (error) {
      this.handleError('gspro', error);
    }
  }

  listenForMonitor(port: number = 921) {
    if (this.monitor.getConnectionStatus() != ConnectionStatus.Disconnected) {
      console.log(`Monitor is currently ${ConnectionStatus[this.monitor.getConnectionStatus()]}`);
      console.log(`Disconnecting monitor before attempting re-connect/listen`);
      this.disconnectMonitor();
    }

    console.log(`SlxMonitorProxy::listeningForMOnitor on port ${port}`);
    this.monitor.listen(port);
  }

  disconnectMonitor() {
    try {
      console.log(`Disconnecting monitor`);
      this.monitor.disconnect();
    } catch (error) {
      this.handleError('monitor', error);
    }
  }

  shutdown() {
    this.disconnectGspro();
    this.disconnectMonitor();
  }

  private onGsproStatus(statusEvent: ConnectionStatusEvent) {
    if (statusEvent.status === ConnectionStatus.Error) {
      this.port.postMessage(new ProxyErrorEvent('gspro', statusEvent.message || `GSPro: An unknown error occurred`));
    } else {
      this.port.postMessage(new ProxyStatusEvent('gspro', statusEvent.status));
    }
  }

  private onGsproData(data: GSConnectToMonitor) {
    this.port.postMessage(new ProxyDataEvent<GSConnectToMonitor>('gspro', data));
    this.monitor.write(JSON.stringify(data));
  }

  private onMonitorStatus(statusEvent: ConnectionStatusEvent) {
    console.log(`onMonitorStatus`, statusEvent);
    if (statusEvent.status === ConnectionStatus.Error) {
      this.port.postMessage(
        new ProxyErrorEvent('monitor', statusEvent.message || `Monitor: An unkonwn error occurred`)
      );
    } else {
      this.port.postMessage(new ProxyStatusEvent('monitor', statusEvent.status));
    }
  }

  private onMonitorData(data: MonitorToGSConnect) {
    // Only write on valid data, at this point just check for club or ball speed
    this.port.postMessage(new ProxyDataEvent<MonitorToGSConnect>('monitor', data));

    if (data.BallData?.Speed == 0 || data.ClubData?.Speed == 0) {
      const heartbeat = convertToHeartbeat(data);
      this.gspro.write(JSON.stringify(heartbeat));
    } else {
      this.gspro.write(JSON.stringify(data));
    }
  }

  private handleError(system: string, error: unknown) {
    const err = ensureError(error);
    this.port.postMessage(new ProxyErrorEvent(system, err.message));
  }
}
