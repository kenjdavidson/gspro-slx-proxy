import EventEmitter from 'events';
import net from 'net';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MonitorConnection, MonitorConnectionEvent } from '../MonitorConnection';
import { ConnectionStatus } from '../ConnectionStatus';

describe('MonitorConnection', () => {
  let monitor: MonitorConnection;

  beforeEach(() => {
    monitor = new MonitorConnection();
  });

  afterEach(() => {
    monitor?.disconnect();
  });

  it('should handle connections events', async () => {
    const lock = new EventEmitter();

    const statusListener = vi
      .fn()
      .mockImplementation((event) => {
        switch (event.status) {
            case ConnectionStatus.Connecting: 
                lock.emit('connecting');
                break;
            case ConnectionStatus.Connected: 
                lock.emit('connected');
                break;
            case ConnectionStatus.Disconnected: 
                lock.emit('disconnected');
                break;
            default:
                break;
        }
      }); 

    monitor.on(MonitorConnectionEvent.Status, statusListener);
    monitor.listen();
    const client = net.connect(921);

    await new Promise(resolve => {
        lock.once('disconnected', resolve);
        client.end();
    });

    expect(statusListener).toHaveBeenCalledTimes(3);
    expect(statusListener).toHaveBeenNthCalledWith(1, {
        status: ConnectionStatus.Connecting
    });
    expect(statusListener).toHaveBeenNthCalledWith(2, {
        status: ConnectionStatus.Connected
    });
    expect(statusListener).toHaveBeenNthCalledWith(3, {
        status: ConnectionStatus.Disconnected
    });
  }); 

  it('should handle data events', async () => {
    const lock = new EventEmitter();

    const dataListener = vi.fn().mockImplementation(() => {
      lock.emit('data');
    });

    monitor.on(MonitorConnectionEvent.Data, dataListener);

    monitor.listen();
    const client = net.connect(921);

    await new Promise((resolve) => {
      lock.once('data', resolve);
      client.write('{ "command" : "ping" }');
    });

    expect(dataListener).toHaveBeenCalledTimes(1);
  });
}); 
