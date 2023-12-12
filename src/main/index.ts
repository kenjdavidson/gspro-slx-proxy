import { app, BrowserWindow, ipcMain, IpcMainEvent, nativeTheme } from "electron";
import { join } from "path";
import proxy from "@common/gspro/ConnectorProxy";

const createBrowserWindow = (): BrowserWindow => {
    const preloadScriptFilePath = join(__dirname, "..", "dist-preload", "index.js");

    return new BrowserWindow({
        autoHideMenuBar: true,
        resizable: app.isPackaged ? false : true,
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
    const mainWindow = createBrowserWindow();
    
    loadFileOrUrl(mainWindow, app.isPackaged);
    registerIpcEventListeners();
    registerNativeThemeEventListeners(BrowserWindow.getAllWindows());

    !app.isPackaged && mainWindow.webContents.openDevTools();
})();
