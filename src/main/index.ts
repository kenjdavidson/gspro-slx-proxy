import { ConnectionProxy } from "@common/gspro/ConnectionProxy";
import { GsproConnection } from "@common/gspro/GsproConnection";
import { MonitorConnection } from "@common/gspro/MonitorConnection";
import { app, BrowserWindow, ipcMain, IpcMainEvent, nativeTheme, MessageChannelMain } from "electron";
import { join } from "path";

const { port1, port2 } = new MessageChannelMain();
const proxy = new ConnectionProxy(new GsproConnection(), new MonitorConnection());

const createBrowserWindow = (): BrowserWindow => {
    const preloadScriptFilePath = join(__dirname, "..", "dist-preload", "index.js");

    return new BrowserWindow({
        autoHideMenuBar: true,
        resizable: true,
        webPreferences: {
            preload: preloadScriptFilePath,
        },
    });
};

const loadFileOrUrl = (browserWindow: BrowserWindow, appIsPackaged: boolean) => {
    appIsPackaged
        ? browserWindow.loadFile(join(__dirname, "..", "dist-renderer", "index.html"))
        : browserWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
};

const registerIpcEventListeners = () => {
    ipcMain.on("themeShouldUseDarkColors", (event: IpcMainEvent) => {
        event.returnValue = nativeTheme.shouldUseDarkColors;
    });
};

const registerNativeThemeEventListeners = (allBrowserWindows: BrowserWindow[]) => {
    nativeTheme.addListener("updated", () => {
        for (const browserWindow of allBrowserWindows) {
            browserWindow.webContents.send("nativeThemeChanged");
        }
    });
};

/**
 * Run the application!
 */
(async () => {
    await app.whenReady();
    const mainWindow: BrowserWindow = createBrowserWindow();
    mainWindow.webContents.postMessage('app:ports', null, [port2]);

    loadFileOrUrl(mainWindow, app.isPackaged);
    registerIpcEventListeners();
    registerNativeThemeEventListeners(BrowserWindow.getAllWindows());

    !app.isPackaged && mainWindow.webContents.openDevTools();
})();
