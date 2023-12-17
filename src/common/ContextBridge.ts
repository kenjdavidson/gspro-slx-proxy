import { IpcRendererEvent } from "electron";

export type ContextBridge = {
    onNativeThemeChanged: (callback: () => void) => void;
    themeShouldUseDarkColors: () => boolean;
    onAppPorts: (callback: (event: IpcRendererEvent) => void) => void;
};
