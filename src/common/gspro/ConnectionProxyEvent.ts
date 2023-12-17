import { ConnectionStatus } from "./ConnectionStatus";
import { GSConnectToMonitor } from "./GsproEvent";
import { MonitorToGSConnect } from "./MonitorEvent";

export enum ProxyEvent {
    Status = 'proxy:status',
    Data = 'proxy:data',
    Error = 'proxy:error',
    ConnectGspro = 'proxy:connect-gspro',
    DisconnectGspro = 'proxy:disconnect-gspro',
    ListenMonitor = 'proxy:listen-monitor',
    DisconnectMonitor = 'proxy:disconnect-monitor'
}

export type ProxyStatusEvent = {
    type: 'status';
    status: ConnectionStatus;
    system: string;
    message: string;    
}

export type ProxyDataEvent = {
    type: 'data';
    system: string;
    data: MonitorToGSConnect | GSConnectToMonitor,
    message?: string;
}

export type ProxyErrorEvent = {
    type: 'error';
    system: string;
    error: Error;
}