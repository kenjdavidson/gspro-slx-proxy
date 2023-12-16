import netInterceptor from '@gr2m/net-interceptor';
import { Socket } from 'net';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConnectionStatus } from '../ConnectionStatus';
import { GsproConnection, GsproConnectionEvent } from '../GsproConnection';
import EventEmitter from 'events';

const createStatusListener = (lock: EventEmitter) => vi.fn().mockImplementation((event) => {
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

describe('GsproConnection', () => {
  const port = 921;

  beforeEach(() => {
    netInterceptor.start();
  });

  afterEach(() => {
    netInterceptor.stop();
  });

  it('should correctly connect and disconnect locally', async () => {
    const lock = new EventEmitter();

    netInterceptor.on('connect', () => {
      lock.emit('netInterceptor:connect');
    });
    netInterceptor.on('connection', () => {
      lock.emit('netInterceptor:connection');
    });

    const statusListener = createStatusListener(lock);
    const connection = new GsproConnection();
    connection.on(GsproConnectionEvent.Status, statusListener);
    connection.connect(port);

    await new Promise((resolve) => {
      lock.once('disconnected', resolve);
      connection.disconnect();
    });

    expect(statusListener).toHaveBeenCalledTimes(3);
    expect(statusListener).toHaveBeenNthCalledWith(1, {
      status: ConnectionStatus.Connecting,
    });
    expect(statusListener).toHaveBeenNthCalledWith(2, {
      status: ConnectionStatus.Connected,
    });
    expect(statusListener).toHaveBeenNthCalledWith(3, {
      status: ConnectionStatus.Disconnected,
    });
  });

  it('should correctly connect and disconnect remotely', async () => {
    const lock = new EventEmitter();
    let server: Socket;

    netInterceptor.on('connect', () => {
      lock.emit('netInterceptor:connect');
    });
    netInterceptor.on('connection', (socket) => {
      lock.emit('netInterceptor:connection');
      server = socket;
    });

    const statusListener = createStatusListener(lock);
    const connection = new GsproConnection();
    connection.on(GsproConnectionEvent.Status, statusListener);
    connection.connect(port);

    await new Promise((resolve) => {
      lock.once('disconnected', resolve);
      server.destroy();
    });

    expect(statusListener).toHaveBeenCalledTimes(3);
    expect(statusListener).toHaveBeenNthCalledWith(1, {
      status: ConnectionStatus.Connecting,
    });
    expect(statusListener).toHaveBeenNthCalledWith(2, {
      status: ConnectionStatus.Connected,
    });
    expect(statusListener).toHaveBeenNthCalledWith(3, {
      status: ConnectionStatus.Disconnected,
    });
  });

  it('should handle forward data to connection', async () => {
    const lock = new EventEmitter();

    netInterceptor.on('connect', () => {
      lock.emit('netInterceptor:connect');
    });
    netInterceptor.on('connection', (socket) => {
      lock.emit('netInterceptor:connection');
      socket.on('data', dataListener);
    });

    const statusListener = createStatusListener(lock);
    const dataListener = vi.fn().mockImplementation(() => {
        lock.emit('data');
      });

    const connection = new GsproConnection();
    connection.on(GsproConnectionEvent.Status, statusListener);
    connection.on(GsproConnectionEvent.Data, dataListener);
    connection.connect(port);

    await new Promise((resolve) => {
      lock.once('data', resolve);
      connection.write("{ 'test' : 'data' }");
    });

    expect(dataListener).toHaveBeenCalledTimes(1);
    expect(dataListener).toHaveBeenNthCalledWith(1, Buffer.from("{ 'test' : 'data' }"));
  });
});
