import { makeStyles, shorthands } from '@fluentui/react-components';
import { useGsproConnection, useMonitorConnection } from '../components';
import { ProxyCard } from '../components/ProxyCard';
import { ConnectionStatus } from '@common/ConnectionStatus';

export const ACTION_TEXT = {
    [ConnectionStatus.Error]: 'Connect',
    [ConnectionStatus.Disconnected]: 'Connect',
    [ConnectionStatus.Connecting]: 'Connecting',
    [ConnectionStatus.Connected]: 'Disconnect',
}

const useStyles = makeStyles({
  grid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'start',
    ...shorthands.gap('8px'),
  },
});

export const Home = () => {
  const gspro = useGsproConnection();
  const monitor = useMonitorConnection();
  const styles = useStyles();

  return (
    <section className={styles.grid}>
      <ProxyCard 
        title="GSPro" 
        action={ACTION_TEXT[gspro.status]} 
        actionProps={{
            onClick: () => (gspro.isConnected ? gspro.disconnect() : gspro.connect(922)),
            disabled: gspro.status == ConnectionStatus.Connecting
        }} />
      <ProxyCard 
        title="SLX" 
        action={ACTION_TEXT[monitor.status]} 
        actionProps={{
            onClick: () => (monitor.isConnected ? monitor.disconnect() : monitor.listen(922)),
            disabled: monitor.status == ConnectionStatus.Connecting
        }} />
    </section>
  );
};
