import net, { Server, Socket } from "net";
import { ConnectionStatus } from "../ConnectionStatus";
import { GsproConnection, GsproConnectionEvent } from "../GsproConnection";
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EventEmitter } from "stream";

describe('GsproConnection definition', () => {
    it('should accept port in constructor', () => {
        const connection = new GsproConnection(921);
        
        expect(connection.getPort()).toBe(921);
    });

    it('should be created with Disconnected status', () => {
        const connection = new GsproConnection(921);

        expect(connection.getConnectionStatus()).toBe(ConnectionStatus.Disconnected);
    });
});

describe('GsproConnection connection', () => {
    const port = 921;
    const lock = new EventEmitter();

    let mockServer: Server;
    let mockSocket: Socket;

    beforeEach(() => {
        mockServer = net.createServer((socket => {
            mockSocket = socket;
            mockSocket.on('close', () => lock.emit('closed'));

            lock.emit('connected');
        }));

        mockServer.on('close', () => mockSocket?.destroy());
        mockServer.listen(port); 
    });

    afterEach(() => {
        mockServer.close();     
    });

    it('should handle connection correctly', async () => {
        const mockListener = vi.fn();
        const connection = new GsproConnection(port);
        
        connection.on(GsproConnectionEvent.Status, mockListener);
        connection.connect();

        await new Promise((resolve) => lock.once('connected', resolve));

        expect(mockListener).toHaveBeenCalledTimes(2);
        expect(mockListener).toHaveBeenNthCalledWith(1, {
            status: ConnectionStatus.Connecting
        });
        expect(mockListener).toHaveBeenNthCalledWith(2, {
            status: ConnectionStatus.Connected
        });
    });
});
