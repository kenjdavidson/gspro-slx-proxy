import { MonitorToGSConnect } from "@common/gspro/MonitorEvent";
import { createContext, useContext } from "react";

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
    gspro?: GsproConnectionProps,
    monitor?: MonitorConnectionProps,
    monitorData: MonitorToGSConnect[]
}

export const ProxyContext = createContext<ProxyContextProps>({
    monitorData: []
});
export const useGsproConnection = () => useContext(ProxyContext).gspro;
export const useMonitorConnection = () => useContext(ProxyContext).gspro;
export const useMonitorData = () => useContext(ProxyContext).monitorData;