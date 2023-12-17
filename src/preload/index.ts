import type { ContextBridge } from "@common/ContextBridge";
import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ContextBridge", <ContextBridge>{
    onNativeThemeChanged: (callback: () => void) => ipcRenderer.on("nativeThemeChanged", callback),
    themeShouldUseDarkColors: () => ipcRenderer.sendSync("themeShouldUseDarkColors"),
    onAppPorts: (callback: (event: IpcRendererEvent) => void) => ipcRenderer.on('app:ports', callback)
});
