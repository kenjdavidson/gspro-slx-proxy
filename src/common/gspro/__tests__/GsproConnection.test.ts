import Mitm from 'mitm';
import { Socket } from 'net';
import { EventEmitter } from 'stream';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConnectionStatus } from '../ConnectionStatus';
import { GsproConnection, GsproConnectionEvent } from '../GsproConnection';

describe('GsproConnection', () => {
  const port = 921;

  let mitm: Mitm;

  beforeEach(() => {
    mitm = new Mitm();
  });

  afterEach(() => {
    mitm.disable();
  });

  it('should handle status changes and notify', async () => {
    const lock = new EventEmitter();

    mitm.on('connection', (socket: Socket) => {
      lock.emit('connected');
      socket.destroy();
    });

    const mockListener = vi
      .fn()
      .mockImplementation(() => {})
      .mockImplementation(() => {})
      .mockImplementation(() => {
        lock.emit('disconnected');
      });
    const connection = new GsproConnection();
    connection.on(GsproConnectionEvent.Status, mockListener);
    connection.connect(port);

    await new Promise((resolve) => lock.once('disconnected', resolve));

    expect(mockListener).toHaveBeenCalledTimes(4);
    expect(mockListener).toHaveBeenNthCalledWith(1, {
      status: ConnectionStatus.Connecting,
    });
    expect(mockListener).toHaveBeenNthCalledWith(2, {
      status: ConnectionStatus.Connected,
    });
    expect(mockListener).toHaveBeenNthCalledWith(3, {
      error: 'connect ECONNREFUSED 127.0.0.1:921',
      status: 0,
    });
    expect(mockListener).toHaveBeenNthCalledWith(4, {
      status: ConnectionStatus.Disconnected,
    });
  });
});
