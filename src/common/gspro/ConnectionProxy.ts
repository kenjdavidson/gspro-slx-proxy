import EventEmitter from 'events';
import { GsproConnection, GsproConnectionEvent } from './GsproConnection';
import { MonitorConnection, MonitorConnectionEvent } from './MonitorConnection';
import { ensureError } from '../utils/ErrorUtil';
import { ConnectionStatus, ConnectionStatusEvent } from './ConnectionStatus';
import { MonitorToGSConnect } from './MonitorEvent';
import { GSConnectToMonitor } from './GsproEvent';

export enum ProxyEvent {
    Status = 'proxy:status',
    Data = 'proxy:data',
    Error = 'proxy:error'
}

export type ProxyStatusEvent = {
    status: ConnectionStatus;
    system: string;
    message: string;    
}

export type ProxyDataEvent = {
    system: string;
    data: MonitorToGSConnect | GSConnectToMonitor
}

export class ConnectionProxy extends EventEmitter {
    private gspro?: GsproConnection;
    private monitor?: MonitorConnection;

    start(port: number) {
        this.gspro = new GsproConnection(port);
        this.gspro.on(GsproConnectionEvent.Status, this.onGsproStatus);
        this.gspro.on(GsproConnectionEvent.Data, this.onGsproData);
        this.gspro.connect();

        this.monitor = new MonitorConnection(port);
        this.monitor.on(MonitorConnectionEvent.Status, this.onMonitorStatus);
        this.monitor.on(MonitorConnectionEvent.Data, this.onMonitorData);
        this.monitor.listen();
    }

    stop() {
        try {
            this.gspro?.disconnect();
            this.monitor?.disconnect();
        } catch(error) {
            this.handleError(error);
        } finally {
            this.gspro = undefined;
            this.monitor = undefined;
        }
    }

    private onGsproStatus(statusEvent: ConnectionStatusEvent) {
        this.emit(ProxyEvent.Status, {
            system: 'gspro',
            ...statusEvent
        });
    }

    private onGsproData(data: GSConnectToMonitor) {
        this.emit(ProxyEvent.Data, {
            system: 'gspro',
            data
        });

        this.monitor?.write(JSON.stringify(data));
    }

    private onMonitorStatus(statusEvent: ConnectionStatusEvent) {
        this.emit(ProxyEvent.Status, {
            system: 'monitor',
            ...statusEvent
        });
    }

    private onMonitorData(data: MonitorToGSConnect) {
        // Only write on valid data, at this point just check for club or ball speed
        this.emit(ProxyEvent.Data, {
            system: 'monitor',
            data
        });

        if (data.BallData?.Speed == 0) {
            console.error(`Monitor data contains invalid ball speed, skipping message`);
            return;
        }

        this.gspro?.write(JSON.stringify(data));
    }

    private handleError(error: unknown) {
        const err = ensureError(error);

        this.emit(ProxyEvent.Error, err);
        console.error(err);    
    }
}

export default new ConnectionProxy();