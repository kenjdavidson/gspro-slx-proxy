import type { ContextBridge } from '@common/ContextBridge';
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('ContextBridge', <ContextBridge>{
  onNativeThemeChanged: (callback: () => void) => ipcRenderer.on('nativeThemeChanged', callback),
  themeShouldUseDarkColors: () => ipcRenderer.sendSync('themeShouldUseDarkColors'),
});

// We need to wait until the main world is ready to receive the message before
// sending the port. We create this promise in the preload so it's guaranteed
// to register the onload listener before the load event is fired.
const windowLoaded = new Promise((resolve) => {
  window.onload = resolve;
});

ipcRenderer.on('app:ports', async (event) => {
  await windowLoaded;
  // We use regular window.postMessage to transfer the port from the isolated
  // world to the main world.
  window.postMessage('app:ports', '*', event.ports);
});
