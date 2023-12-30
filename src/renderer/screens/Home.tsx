import { ConnectionStatus } from '@common/ConnectionStatus';
import { Badge, CardHeader, Divider, Text, Tooltip, makeStyles, shorthands } from '@fluentui/react-components';
import { ConnectionButtons, useGsproConnection, useMonitorConnection } from '../Components';

export const ACTION_TEXT = {
  [ConnectionStatus.Error]: 'Connect',
  [ConnectionStatus.Disconnected]: 'Connect',
  [ConnectionStatus.Connecting]: 'Connecting',
  [ConnectionStatus.Connected]: 'Disconnect',
};

const useStyles = makeStyles({
  grid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'stretch',
    alignItems: 'start',
    ...shorthands.gap('8px'),
  },
  gsproCard: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    ...shorthands.gap('8px'),
  },
  divider: {
    flexGrow: 0,
    height: '100%',
  },
  monitorCard: {
    flexGrow: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    ...shorthands.gap('8px'),
  },
});

export const Home = () => {
  const gspro = useGsproConnection();
  const monitor = useMonitorConnection();
  const styles = useStyles();

  return (
    <section className={styles.grid}>
      <div className={styles.gsproCard}>
        <CardHeader
          header={<Text size={300}>GSPro Connection</Text>}
          action={
            <Tooltip content={'Connection and status of GSPro'} relationship={'description'}>
              <Badge size="small">?</Badge>
            </Tooltip>
          }
        />
        <ConnectionButtons
          status={gspro.status}
          connectText={ACTION_TEXT[gspro.status]}
          onConnect={() => gspro.connect(922)}
          onDisconnect={() => gspro.disconnect()}
        />
      </div>
      <Divider className={styles.divider} vertical={true} appearance="brand" />
      <div className={styles.monitorCard}>
        <Text size={300}>Monitor Connection</Text>
        <ConnectionButtons
          status={monitor.status}
          connectText={ACTION_TEXT[monitor.status]}
          onConnect={() => monitor.listen(922)}
          onDisconnect={() => monitor.disconnect()}
        />
      </div>
    </section>
  );
};
