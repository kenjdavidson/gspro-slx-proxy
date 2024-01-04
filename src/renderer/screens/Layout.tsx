import { Tab, TabList, makeStyles, shorthands } from '@fluentui/react-components';
import React, { useMemo, useState } from 'react';
import { Data, Help, Home, Settings } from '.';
import { StatusBar, useGsproConnection, useMonitorConnection } from '../Components';

export enum Tabs {
  Home,
  Data,
  Settings,
  Help,
}

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
    ...shorthands.overflow('hidden', 'auto'),
  },
});

export const Layout = () => {
  const styles = useStyles();

  const [currentTab, setCurrentTab] = useState(Tabs.Home);

  const CurrentTab = useMemo(() => {
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

  const gsproConnection = useGsproConnection();
  const monitorConnection = useMonitorConnection();

  return (
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
        <CurrentTab></CurrentTab>
      </main>
      <StatusBar gsproStatus={gsproConnection.status} monitorStatus={monitorConnection.status} />
    </div>
  );
};
