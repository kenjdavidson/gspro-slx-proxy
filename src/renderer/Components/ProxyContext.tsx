import { ProxyErrorEvent, ProxyEvent, ProxyStatusEvent } from '@common/gspro/ConnectionProxyEvent';
import { ConnectionStatus } from '@common/gspro/ConnectionStatus';
import { MonitorToGSConnect } from '@common/gspro/MonitorEvent';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { IpcRendererEvent } from 'electron';
import { Toast, ToastBody, ToastTitle, useToastController } from '@fluentui/react-toast';

interface GsproConnectionProps {
  connect: (port: number) => void;
  disconnect: () => void;
  isConnected: boolean;
}

interface MonitorConnectionProps {
  listen: (port: number) => void;
  disconnect: () => void;
  isConnected: boolean;
}

interface ProxyContextProps {
  gspro?: GsproConnectionProps;
  monitor?: MonitorConnectionProps;
  monitorData: MonitorToGSConnect[];
}

const ProxyContext = createContext<ProxyContextProps>({
  monitorData: [],
});
export const useGsproConnection = () => useContext(ProxyContext).gspro;
export const useMonitorConnection = () => useContext(ProxyContext).gspro;
export const useMonitorData = () => useContext(ProxyContext).monitorData;

export const ProxyContextProvider = ({ children }: PropsWithChildren) => {
  const [port, setPort] = useState<MessagePort>();
  const [gsproStatus, setGsproStatus] = useState<ConnectionStatus>(ConnectionStatus.Disconnected);
  const [monitorStatus, setMonitorStatus] = useState<ConnectionStatus>(ConnectionStatus.Disconnected);
  const [monitorData, setMonitorData] = useState<MonitorToGSConnect[]>([]);
  const { dispatchToast } = useToastController();

  useEffect(() => {
    window.ContextBridge.onAppPorts((e: IpcRendererEvent) => {
        const commsPort = e.ports[0];
        commsPort.onmessage = onMessageRecieved;
        setPort(commsPort);        
    });
  }, []);

  const onMonitorData = (data: MonitorToGSConnect) => setMonitorData([...monitorData, data]);
  const onStatus = (status: ProxyStatusEvent) => {
    switch (status.system) {
      case 'gspro':
        return setGsproStatus(status.status);
      case 'monitor':
        return setMonitorStatus(status.status);
    }
  };
  const onError = (error: ProxyErrorEvent) => {
    const system = error.system.charAt(0).toUpperCase() + error.system.slice(1);
    dispatchToast(
        <Toast>
            <ToastTitle>{system} Error</ToastTitle>
            <ToastBody>{error.error.message}</ToastBody>
        </Toast>,
        { intent: 'error' }
    )
    console.error(error);
  };

  const onMessageRecieved = (event: MessageEvent<unknown>) => {
    switch (event.type) {
      case ProxyEvent.Data:
        // @ts-expect-error fuck "typescript"
        return onMonitorData(event.data);
      case ProxyEvent.Status:
        // @ts-expect-error fuck "typescript"
        return onStatus(event);
      case ProxyEvent.Error:
        // @ts-expect-error fuck "typescript"
        return onError(event);
    }
  };

  return (
    <ProxyContext.Provider
      value={{
        gspro: {
            isConnected: gsproStatus == ConnectionStatus.Connected,
            connect: () => { port?.postMessage(ProxyEvent.ConnectGspro)},
            disconnect: () => { port?.postMessage(ProxyEvent.DisconnectGspro)}
        },
        monitor: {
            isConnected: monitorStatus == ConnectionStatus.Connected,
            listen: () => { port?.postMessage(ProxyEvent.ListenMonitor)},
            disconnect: () => { port?.postMessage(ProxyEvent.DisconnectMonitor)}
        },
        monitorData,
      }}
    >
      {children}
    </ProxyContext.Provider>
  );
};
