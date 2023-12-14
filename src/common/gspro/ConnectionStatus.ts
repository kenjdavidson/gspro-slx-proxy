export enum ConnectionStatus {
    Error,
    Disconnected,
    Connecting,
    Connected,
}

export type ConnectionStatusEvent = {
    status: ConnectionStatus;
    message?: string;
}