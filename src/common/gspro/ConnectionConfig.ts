export type ConnectionProxyConfig = {
    gsproConnectionPort: number;
    gsproConnectionAddress: string;
    monitorConnectionPort: number;
    monitorConnectionAddress: string;
}

export const defaultConfiguration: ConnectionProxyConfig = {
    gsproConnectionAddress: '127.0.0.1',
    gsproConnectionPort: 921,
    monitorConnectionAddress: '127.0.0.1',
    monitorConnectionPort: 921
};