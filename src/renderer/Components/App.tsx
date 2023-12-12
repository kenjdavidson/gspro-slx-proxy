import {
  FluentProvider,
  Tab,
  TabList,
  makeStyles,
  webDarkTheme,
  webLightTheme,
  type Theme,
  shorthands,
} from '@fluentui/react-components';
import React, { useEffect, useMemo, useState } from 'react';
import { Help } from './Help';
import { StatusBar } from './StatusBar';
import { ConnectionButtons } from './ConnectionButtons';
import { Settings } from './Settings';

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
    ...shorthands.gap("12px", "8px")
  },
  main: {
    flexGrow: 1,
    ...shorthands.margin("12px"),
    ...shorthands.overflow('hidden', 'scroll')
  },
});

enum Tabs {
  Home,
  Settings,
  Help,
}

export const App = () => {
  const [themeName, setThemeName] = useState<ThemeName>(getThemeName());
  const [slxConnected, setSlxConnected] = useState(false);
  const [gsproConnected, setGsproConnected] = useState(false);
  const [currentTab, setCurrentTab] = useState(Tabs.Home);

  const styles = useStyles();

  useEffect(() => {
    window.ContextBridge.onNativeThemeChanged(() => setThemeName(getThemeName()));
  }, []);

  const CurrentTab = useMemo(() => {
    console.log(currentTab);
    switch (currentTab) {
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
      <div className={styles.container}>
        <nav>
          <TabList selectedValue={currentTab} onTabSelect={(_, data) => setCurrentTab(data.value as Tabs)}>
            <Tab value={Tabs.Home}>Home</Tab>
            <Tab value={Tabs.Settings}>Settings</Tab>
            <Tab value={Tabs.Help}>Help</Tab>
          </TabList>
        </nav>
        <main className={styles.main}>
          <section>
            <CurrentTab></CurrentTab>
          </section>
          <section>
            <ConnectionButtons 
                gsproButtonClick={() => setSlxConnected(!slxConnected)}
                slxButtonClick={() => setGsproConnected(!gsproConnected)}
            />
          </section>
        </main>
        <StatusBar slxconnected={slxConnected} gsproConnected={gsproConnected} />
      </div>
    </FluentProvider>
  );
};
