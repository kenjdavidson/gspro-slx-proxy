import { ConnectionStatus } from '@common/ConnectionStatus';
import {
  Badge,
  Label,
  Toolbar,
  ToolbarGroup,
  ToolbarProps,
  Tooltip,
  makeStyles,
  shorthands,
} from '@fluentui/react-components';
import { useMemo } from 'react';
import { useGsproConnection, useMonitorConnection } from './ProxyContext';

const useStyles = makeStyles({
  toolbar: {
    justifyContent: 'space-between',
  },
  toolbarGroup: {
    display: 'flex',
    ...shorthands.gap('4px'),
  },
});

export interface StatusBarProps extends ToolbarProps {}

export const StatusBar = ({ ...props }: Partial<StatusBarProps>) => {
  const gspro = useGsproConnection();
  const monitor = useMonitorConnection();

  const styles = useStyles();

  const statusColour = (status?: ConnectionStatus) => {
    switch (status) {
      case ConnectionStatus.Connected:
        return 'success';
      case ConnectionStatus.Connecting:
        return 'warning';
      default:
        return 'informative';
    }
  };

  const statusMessage = (name: string, status?: ConnectionStatus) => {
    switch (status) {
      case ConnectionStatus.Connected:
        return `Connected to ${name}`;
      case ConnectionStatus.Connecting:
        return `Attempting connection to ${name}`;
      default:
        return `Not connected to ${name}`;
    }
  };

  const gsproColour = useMemo(() => statusColour(gspro.status), [gspro.status]);
  const slxColour = useMemo(() => statusColour(monitor.status), [monitor.status]);

  const gsproMessage = useMemo(() => statusMessage('GSPro', gspro.status), [gspro.status]);
  const slxMessage = useMemo(() => statusMessage('SLX', monitor.status), [monitor.status]);

  return (
    <Toolbar aria-label="application status" {...props} className={styles.toolbar}>
      <ToolbarGroup className={styles.toolbarGroup}>
        <Label size="small" aria-label="Connection status">
          Connection status
        </Label>
      </ToolbarGroup>
      <ToolbarGroup className={styles.toolbarGroup}>
        <Tooltip content={gsproMessage} relationship="label">
          <Badge size="small" color={gsproColour}>
            GSPRO
          </Badge>
        </Tooltip>
        <Tooltip content={slxMessage} relationship="label">
          <Badge size="small" color={slxColour}>
            SLX
          </Badge>
        </Tooltip>
      </ToolbarGroup>
    </Toolbar>
  );
};
