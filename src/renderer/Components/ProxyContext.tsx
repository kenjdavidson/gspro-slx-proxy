import { ConnectionStatus } from '@common/ConnectionStatus';
import { MonitorToGSConnect } from '@common/monitor/MonitorEvent';
import {
  ProxyDataEvent,
  ProxyErrorEvent,
  ProxyEventType,
  ProxyMessageEvent,
  ProxyStatusEvent,
} from '@common/slx/slxMonitorProxyEvents';
import { useId } from '@fluentui/react-components';
import { Toast, ToastTitle, Toaster, useToastController } from '@fluentui/react-toast';
import { capitalize } from '@stdlib/string';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';

interface GsproContext {
  connect: (port: number) => void;
  disconnect: () => void;
  isConnected: boolean;
  status: ConnectionStatus;
}

interface MonitorContext {
  listen: (port: number) => void;
  disconnect: () => void;
  isConnected: boolean;
  status: ConnectionStatus;
}

interface ProxyContextProps {
  gspro: GsproContext;
  monitor: MonitorContext;
  monitorData: MonitorToGSConnect[];
}

const DEFAULT_CONTEXT = {
  gspro: {
    status: ConnectionStatus.Disconnected,
    isConnected: false,
    connect: () => {},
    disconnect: () => {},
  },
  monitor: {
    status: ConnectionStatus.Disconnected,
    isConnected: false,
    listen: () => {},
    disconnect: () => {},
  },
  monitorData: [],
};

const ProxyContext = createContext<ProxyContextProps>(DEFAULT_CONTEXT);

export const useGsproConnection = () => useContext(ProxyContext).gspro;
export const useMonitorConnection = () => useContext(ProxyContext).monitor;
export const useMonitorData = () => useContext(ProxyContext).monitorData;

export const ProxyContextProvider = ({ children }: PropsWithChildren) => {
  const [port, setPort] = useState<MessagePort>();
  const [gsproStatus, setGsproStatus] = useState<ConnectionStatus>(ConnectionStatus.Disconnected);
  const [monitorStatus, setMonitorStatus] = useState<ConnectionStatus>(ConnectionStatus.Disconnected);
  const [monitorData, setMonitorData] = useState<MonitorToGSConnect[]>([]);

  const toasterId = useId('toaster');
  const { dispatchToast } = useToastController(toasterId);

  useEffect(() => {
    console.log(`attempting to set listener`);
    const getPort = async () => {
      const mainPort = await window.port;
      mainPort.onmessage = onMessageRecieved;
      setPort(mainPort);
    };

    getPort();
  }, []);

  const onMonitorData = (data: MonitorToGSConnect) => {
    console.log(`Adding data to ${monitorData.length} rows`);
    setMonitorData((oldMonitorData) => {
      const updatedMonitorData = [
        {
          ...data,
          ShotNumber: oldMonitorData.length + 1,
        },
        ...oldMonitorData,
      ];
      return updatedMonitorData;
    });
  };

  const onStatus = (event: ProxyStatusEvent) => {
    console.info(`ProxyContext#onStatus ${JSON.stringify(event)}`);
    const { system, status } = event;
    switch (system) {
      case 'gspro':
        setGsproStatus(status);
        break;
      case 'monitor':
        setMonitorStatus(status);
        break;
    }

    dispatchToast(
      <Toast>
        <ToastTitle>{`${capitalize(system)} is ${ConnectionStatus[status]}.`}</ToastTitle>
      </Toast>
    );
  };

  const onError = (error: ProxyErrorEvent) => {
    console.error(`ProxyContext#onError`, JSON.stringify(error));
    const { system, message } = error;
    dispatchToast(
      <Toast>
        <ToastTitle>
          {capitalize(system)}: {message}
        </ToastTitle>
      </Toast>,
      { intent: 'error' }
    );
  };

  /**
   * Primary communication handler for the Proxy.  All messages come through this function and are processed
   * based on type and/or system.
   *
   * @param event incoming event (of any type)
   * @returns
   */
  const onMessageRecieved = ({ data }: MessageEvent<ProxyMessageEvent>) => {
    console.log(`ProxyContext#onMessageReceived eventData`, JSON.stringify(data));
    switch (data.type) {
      case ProxyEventType.Data:
        if (data.system === 'monitor') {
          return onMonitorData((data as ProxyDataEvent<MonitorToGSConnect>).data);
        } else {
          return;
        }
      case ProxyEventType.Status:
        return onStatus(data as ProxyStatusEvent);
      case ProxyEventType.Error:
        return onError(data as ProxyErrorEvent);
    }
  };

  const gsproContext = useMemo<GsproContext>(
    () => ({
      status: gsproStatus,
      isConnected: gsproStatus === ConnectionStatus.Connected,
      connect: () => {
        console.info(`Posting ${ProxyEventType.ConnectGspro}`);
        port?.postMessage(ProxyEventType.ConnectGspro) && setGsproStatus(ConnectionStatus.Connecting);
      },
      disconnect: () => {
        console.info(`Posting ${ProxyEventType.DisconnectGspro}`);
        port?.postMessage(ProxyEventType.DisconnectGspro);
      },
    }),
    [gsproStatus, port]
  );

  const monitorContext = useMemo<MonitorContext>(
    () => ({
      status: monitorStatus,
      isConnected: monitorStatus === ConnectionStatus.Connected,
      listen: () => {
        port?.postMessage(ProxyEventType.ListenMonitor) && setMonitorStatus(ConnectionStatus.Connecting);
      },
      disconnect: () => {
        port?.postMessage(ProxyEventType.DisconnectMonitor);
      },
    }),
    [monitorStatus, port]
  );

  return (
    <ProxyContext.Provider
      value={{
        gspro: gsproContext,
        monitor: monitorContext,
        monitorData,
      }}
    >
      {children}
      <Toaster toasterId={toasterId} position="bottom" />
    </ProxyContext.Provider>
  );
};
