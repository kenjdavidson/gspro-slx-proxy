import { ConnectionStatus } from '../ConnectionStatus';
import { GSConnectToMonitor } from '../gspro/GsproEvent';
import { MonitorToGSConnect } from '../monitor/MonitorEvent';

export enum ProxyEventType {
  Status = 'proxy:status',
  Data = 'proxy:data',
  Error = 'proxy:error',
  ConnectGspro = 'proxy:connect-gspro',
  DisconnectGspro = 'proxy:disconnect-gspro',
  ListenMonitor = 'proxy:listen-monitor',
  DisconnectMonitor = 'proxy:disconnect-monitor',
}

export class ProxyStatusEvent {
  type = ProxyEventType.Status;
  system: string;
  status: ConnectionStatus;

  constructor(system: string, status: ConnectionStatus) {
    this.system = system;
    this.status = status;
  }
}

export class ProxyDataEvent<T> {
  type = ProxyEventType.Data;
  system: string;
  data: T;

  constructor(system: string, data: T) {
    this.system = system;
    this.data = data;
  }
}

export class ProxyErrorEvent {
  type = ProxyEventType.Error;
  system: string;
  message: string;

  constructor(system: string, error: string) {
    this.system = system;
    this.message = error;
  }
}

export type ProxyMessageEvent =
  | ProxyStatusEvent
  | ProxyErrorEvent
  | ProxyDataEvent<GSConnectToMonitor>
  | ProxyDataEvent<MonitorToGSConnect>;
