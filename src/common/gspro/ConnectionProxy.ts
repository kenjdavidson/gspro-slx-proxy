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
    data: MonitorToGSConnect | GSConnectToMonitor,
    message?: string;
}

export class ConnectionProxy extends EventEmitter {
    private gspro?: GsproConnection;
    private monitor?: MonitorConnection;

    connectGspro(port: number) {
        if (this.gspro) {
            this.gspro.disconnect();
        }

        this.gspro = new GsproConnection();
        this.gspro.on(GsproConnectionEvent.Status, this.onGsproStatus);
        this.gspro.on(GsproConnectionEvent.Data, this.onGsproData);
        this.gspro.connect(port);
    }

    disconnectGspro() {
        try {
            this.gspro?.disconnect();
            this.gspro = undefined;
        } catch(error) {
            this.handleError('gspro', error);
        }
    }

    listenForMonitor(port: number = 921) {
        this.monitor = new MonitorConnection();
        this.monitor.on(MonitorConnectionEvent.Status, this.onMonitorStatus);
        this.monitor.on(MonitorConnectionEvent.Data, this.onMonitorData);
        this.monitor.listen(port);
    }

    disconnectMonitor() {
        try {
            this.monitor?.disconnect();
            this.monitor = undefined;
        } catch(error) {
            this.handleError('monitor', error);
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

    private handleError(system: string, error: unknown) {
        const err = ensureError(error);

        console.error(err);    
        this.emit(ProxyEvent.Error, {
            system,
            error: err
        });        
    }
}