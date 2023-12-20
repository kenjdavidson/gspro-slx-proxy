import { MessagePortMain } from 'electron';
import EventEmitter from 'events';
import net from 'net';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ConnectionStatus } from '../ConnectionStatus';
import { SlxMonitorProxy } from '../SlxMonitorProxy';
import { GsproConnection, GsproConnectionEvent } from '../gspro/GsproConnection';
import { MonitorConnection, MonitorConnectionEvent } from '../monitor/MonitorConnection';
import { MonitorToGSConnect, Units, convertToHeartbeat } from '../monitor/MonitorEvent';

const sampleData = (ballSpeed: number, clubSpeed: number): MonitorToGSConnect => {
  return {
    DeviceID: 'testmonitor',
    Units: Units.Yards,
    ShotNumber: 0,
    APIversion: '',
    BallData: {
      Speed: ballSpeed,
      SpinAxis: 0,
      TotalSpin: 0,
      BackSpin: 0,
      SideSpin: 0,
      HLA: 0,
      VLA: 0,
      CarryDistance: 0,
    },
    ClubData: {
      Speed: clubSpeed,
      AngleOfAttack: 0,
      FaceToTarget: 0,
      Lie: 0,
      Loft: 0,
      SpeedAtImpact: 0,
      VerticalFaceImpact: 0,
      HorizontalFaceImpact: 0,
      ClosureRate: 0,
    },
    ShotDataOptions: {
      ContainsBallData: true,
      ContainsClubData: true,
      LaunchMonitorIsReady: undefined,
      LauchMonitorBallDetected: undefined,
      Heartbeat: undefined,
    },
  };
};

describe('SlxMonitorProxy', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created with connections', () => {
    const gspro = new GsproConnection();
    const monitor = new MonitorConnection();
    const port1: Pick<MessagePortMain, 'on' | 'postMessage'> = {
      on: vi.fn(),
      postMessage: vi.fn(),
    };
    const proxy = new SlxMonitorProxy(gspro, monitor, port1);

    expect(proxy).not.toBeNull();
  });

  describe('connection to GSPro', () => {
    it('should connect to GSPro and add listeners', () => {
      const gspro = new GsproConnection();
      const monitor = new MonitorConnection();
      const port1: Pick<MessagePortMain, 'on' | 'postMessage'> = {
        on: vi.fn(),
        postMessage: vi.fn(),
      };

      const onSpy = vi.fn();
      const connectSpy = vi.fn();

      vi.spyOn(gspro, 'on').mockImplementation(onSpy);
      vi.spyOn(gspro, 'connect').mockImplementation(connectSpy);

      const proxy = new SlxMonitorProxy(gspro, monitor, port1);
      proxy.connectGspro(921);

      expect(onSpy).toHaveBeenCalledTimes(2);
      expect(onSpy).toHaveBeenNthCalledWith(1, GsproConnectionEvent.Status, expect.anything());
      expect(onSpy).toHaveBeenNthCalledWith(2, GsproConnectionEvent.Data, expect.anything());
      expect(connectSpy).toHaveBeenCalledTimes(1);
      expect(connectSpy).toHaveBeenNthCalledWith(1, 921);
    });

    it('should throw error if GSPro already connected', () => {
      const gspro = new GsproConnection();
      const monitor = new MonitorConnection();
      const port1: Pick<MessagePortMain, 'on' | 'postMessage'> = {
        on: vi.fn(),
        postMessage: vi.fn(),
      };

      vi.spyOn(gspro, 'getConnectionStatus').mockImplementation(() => ConnectionStatus.Connected);

      const proxy = new SlxMonitorProxy(gspro, monitor, port1);

      expect(() => proxy.connectGspro(921)).toThrowError('Already connected to GSPro, disconnect first');
    });

    it('should disconnect from GSPro', () => {
      const gspro = new GsproConnection();
      const monitor = new MonitorConnection();
      const port1: Pick<MessagePortMain, 'on' | 'postMessage'> = {
        on: vi.fn(),
        postMessage: vi.fn(),
      };

      const connectSpy = vi.fn();
      const disconnectSpy = vi.fn();

      vi.spyOn(gspro, 'connect').mockImplementation(connectSpy);
      vi.spyOn(gspro, 'disconnect').mockImplementation(disconnectSpy);

      const proxy = new SlxMonitorProxy(gspro, monitor, port1);
      proxy.connectGspro(921);
      proxy.disconnectGspro();

      expect(disconnectSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('connection to Monitor', () => {
    it('should start monitor listener and handle events', () => {
      const gspro = new GsproConnection();
      const monitor = new MonitorConnection();
      const port1: Pick<MessagePortMain, 'on' | 'postMessage'> = {
        on: vi.fn(),
        postMessage: vi.fn(),
      };

      const onSpy = vi.fn();
      const connectSpy = vi.fn();

      vi.spyOn(monitor, 'on').mockImplementation(onSpy);
      vi.spyOn(monitor, 'listen').mockImplementation(connectSpy);

      const proxy = new SlxMonitorProxy(gspro, monitor, port1);
      proxy.listenForMonitor();

      expect(onSpy).toHaveBeenCalledTimes(2);
      expect(onSpy).toHaveBeenNthCalledWith(1, MonitorConnectionEvent.Status, expect.anything());
      expect(onSpy).toHaveBeenNthCalledWith(2, MonitorConnectionEvent.Data, expect.anything());
      expect(connectSpy).toHaveBeenCalledTimes(1);
      expect(connectSpy).toHaveBeenNthCalledWith(1, 921);
    });

    it('should throw error if monitor already connected', () => {
      const gspro = new GsproConnection();
      const monitor = new MonitorConnection();
      const port1: Pick<MessagePortMain, 'on' | 'postMessage'> = {
        on: vi.fn(),
        postMessage: vi.fn(),
      };

      vi.spyOn(monitor, 'getConnectionStatus').mockImplementation(() => ConnectionStatus.Connected);

      const proxy = new SlxMonitorProxy(gspro, monitor, port1);

      expect(() => proxy.listenForMonitor()).toThrowError(
        'Already connected or listening for Monitor, disconnect first',
      );
    });

    it('should disconnect from monitor', () => {
      const gspro = new GsproConnection();
      const monitor = new MonitorConnection();
      const port1: Pick<MessagePortMain, 'on' | 'postMessage'> = {
        on: vi.fn(),
        postMessage: vi.fn(),
      };

      const connectSpy = vi.fn();
      const disconnectSpy = vi.fn();

      vi.spyOn(monitor, 'listen').mockImplementation(connectSpy);
      vi.spyOn(monitor, 'disconnect').mockImplementation(disconnectSpy);

      const proxy = new SlxMonitorProxy(gspro, monitor, port1);
      proxy.listenForMonitor();
      proxy.disconnectMonitor();

      expect(disconnectSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('proxy logic', () => {
    it('should pass valid messages to GSPro', async () => {
      const lock = new EventEmitter();

      const gspro = new GsproConnection();
      const monitor = new MonitorConnection();
      const port1: Pick<MessagePortMain, 'on' | 'postMessage'> = {
        on: vi.fn(),
        postMessage: vi.fn(),
      };

      const onGsproConnect = vi.fn();
      const onGsproWrite = vi.fn().mockImplementation(() => {
        lock.emit('write');
      });
      const onPostMessage = vi.fn();
      vi.spyOn(gspro, 'connect').mockImplementation(onGsproConnect);
      vi.spyOn(gspro, 'write').mockImplementation(onGsproWrite);
      vi.spyOn(port1, 'postMessage').mockImplementation(onPostMessage);

      const proxy = new SlxMonitorProxy(gspro, monitor, port1);
      proxy.connectGspro(922);
      proxy.listenForMonitor();

      const data: MonitorToGSConnect = sampleData(250, 250);
      const monitorSocket = net.connect(921);

      await new Promise((resolve) => {
        lock.once('write', resolve);
        monitorSocket.write(JSON.stringify(data));
      });

      proxy.disconnectGspro();
      proxy.disconnectMonitor();

      expect(onGsproWrite).toHaveBeenCalledTimes(1);
      expect(onGsproWrite).toHaveBeenNthCalledWith(1, JSON.stringify(data));
      expect(onPostMessage).toHaveBeenCalledTimes(3);
    });

    it('should convert to heartbeat when invalid shot data', async () => {
      const lock = new EventEmitter();

      const gspro = new GsproConnection();
      const monitor = new MonitorConnection();
      const port1: Pick<MessagePortMain, 'on' | 'postMessage'> = {
        on: vi.fn(),
        postMessage: vi.fn(),
      };

      const onGsproConnect = vi.fn();
      const onGsproWrite = vi.fn().mockImplementation(() => {
        lock.emit('write');
      });
      vi.spyOn(gspro, 'connect').mockImplementation(onGsproConnect);
      vi.spyOn(gspro, 'write').mockImplementation(onGsproWrite);

      const proxy = new SlxMonitorProxy(gspro, monitor, port1);
      proxy.connectGspro(922);
      proxy.listenForMonitor();

      const data: MonitorToGSConnect = sampleData(0, 0);
      const monitorSocket = net.connect(921);

      await new Promise((resolve) => {
        lock.once('write', resolve);
        monitorSocket.write(JSON.stringify(data));
      });

      proxy.disconnectGspro();
      proxy.disconnectMonitor();

      expect(onGsproWrite).toHaveBeenCalledTimes(1);
      expect(onGsproWrite).toHaveBeenNthCalledWith(1, JSON.stringify(convertToHeartbeat(data)));
    });
  });
});
