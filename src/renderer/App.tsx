import {
  FluentProvider,
  Tab,
  TabList,
  makeStyles,
  shorthands,
  webDarkTheme,
  webLightTheme,
  type Theme,
} from '@fluentui/react-components';
import React, { useEffect, useMemo, useState } from 'react';
import { ProxyContext, useGsproConnection, useMonitorConnection } from './components/ProxyContext';
import { Help } from './screens/Help';
import { Settings } from './screens/Settings';
import { Home } from './screens/Home';
import { StatusBar } from './components/StatusBar';
import { Data } from './screens/Data';

type ThemeName = 'Light' | 'Dark';

const getThemeName = (): ThemeName => (window.ContextBridge.themeShouldUseDarkColors() ? 'Dark' : 'Light');

const ThemeMapping: Record<ThemeName, Theme> = {
  Dark: webDarkTheme,
  Light: webLightTheme,
};

const useStyles = makeStyles({
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    ...shorthands.gap('12px', '8px'),
  },
  main: {
    flexGrow: 1,
    ...shorthands.margin('12px'),
    ...shorthands.overflow('hidden', 'scroll'),
  },
});

enum Tabs {
  Home,
  Data,
  Settings,
  Help,
}

export const App = () => {
  const [themeName, setThemeName] = useState<ThemeName>(getThemeName());
  const [currentTab, setCurrentTab] = useState(Tabs.Home);

  const gsproConnection = useGsproConnection();
  const monitorConnection = useMonitorConnection();
  const styles = useStyles();

  useEffect(() => {
    window.ContextBridge.onNativeThemeChanged(() => setThemeName(getThemeName()));
  }, []);

  const CurrentTab = useMemo(() => {
    console.log(currentTab);
    switch (currentTab) {
      case Tabs.Home:
        return Home;
      case Tabs.Data:
        return Data;  
      case Tabs.Settings:
        return Settings;
      case Tabs.Help:
        return Help;
      default:
        return React.Fragment;
    }
  }, [currentTab]);

  return (
    <FluentProvider theme={ThemeMapping[themeName]}>
      <ProxyContext.Provider value={{
        monitorData: []
      }}>
        <div className={styles.container}>
          <nav>
            <TabList selectedValue={currentTab} onTabSelect={(_, data) => setCurrentTab(data.value as Tabs)}>
              <Tab value={Tabs.Home}>Home</Tab>
              <Tab value={Tabs.Data}>Data</Tab>
              <Tab value={Tabs.Settings}>Settings</Tab>
              <Tab value={Tabs.Help}>Help</Tab>
            </TabList>
          </nav>
          <main className={styles.main}>
            <section>
              <CurrentTab></CurrentTab>
            </section>
          </main>
          <StatusBar gsproConnected={gsproConnection?.isConnected} slxconnected={monitorConnection?.isConnected} />
        </div>
      </ProxyContext.Provider>
    </FluentProvider>
  );
};
