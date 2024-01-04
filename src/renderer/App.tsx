import { FluentProvider, webDarkTheme, webLightTheme, type Theme } from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import { ProxyContextProvider } from './Components';
import { Layout } from './screens';

type ThemeName = 'Light' | 'Dark';

const getThemeName = (): ThemeName => (window.ContextBridge.themeShouldUseDarkColors() ? 'Dark' : 'Light');

const ThemeMapping: Record<ThemeName, Theme> = {
  Dark: webDarkTheme,
  Light: webLightTheme,
};

export const App = () => {
  const [themeName, setThemeName] = useState<ThemeName>(getThemeName());

  useEffect(() => {
    window.ContextBridge.onNativeThemeChanged(() => setThemeName(getThemeName()));
  }, []);

  return (
    <FluentProvider theme={ThemeMapping[themeName]}>
      <ProxyContextProvider>
        <Layout />
      </ProxyContextProvider>
    </FluentProvider>
  );
};

// Electron IPC
// https://www.electronjs.org/docs/latest/tutorial/message-ports#communicating-directly-between-the-main-process-and-the-main-world-of-a-context-isolated-page
window.port = new Promise((resolve) => {
  window.onmessage = (event) => {
    const [port] = event.ports;

    port.postMessage({
      type: 'react:iniitalize',
    });

    resolve(port);
  };
});
