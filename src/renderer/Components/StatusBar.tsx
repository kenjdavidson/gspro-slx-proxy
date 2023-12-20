import { ConnectionStatus } from "@common/ConnectionStatus";
import { Badge, Label, Toolbar, ToolbarGroup, ToolbarProps, Tooltip, makeStyles, shorthands } from "@fluentui/react-components";
import { useMemo } from "react";

const useStyles = makeStyles({
    toolbar: {
        justifyContent: 'space-between',   
    },
    toolbarGroup: {
        display: 'flex',
        ...shorthands.gap('4px')
    }
  });

export interface StatusBarProps extends ToolbarProps {
    gsproConnected: ConnectionStatus;
    slxconnected: ConnectionStatus;
}
  
export const StatusBar = ({
    gsproConnected,
    slxconnected,
    ...props
}: Partial<StatusBarProps>) => {
    const styles = useStyles();  

    const statusColour = (status?: ConnectionStatus) => {
        switch(status) {
            case ConnectionStatus.Connected: return 'success';
            case ConnectionStatus.Connecting: return 'warning';
            default: return 'informative'
        }
    }

    const statusMessage = (name: string, status?: ConnectionStatus) => {
        switch(status) {
            case ConnectionStatus.Connected: return `Connected to ${name}`;
            case ConnectionStatus.Connecting: return `Attempting connection to ${name}`;
            default: return `Not connected to ${name}`       
        }
    }

    const gsproColour = useMemo(() => statusColour(gsproConnected), [gsproConnected]);
    const slxColour = useMemo(() => statusColour(slxconnected), [slxconnected]);

    const gsproMessage = useMemo(() => statusMessage('GSPro', gsproConnected), [gsproConnected]);
    const slxMessage = useMemo(() => statusMessage('SLX', slxconnected), [slxconnected]);

    return (
    <Toolbar 
        aria-label="application status" 
        {...props} 
        className={styles.toolbar}>
        <ToolbarGroup
            className={styles.toolbarGroup}>
            <Label size="small" aria-label="Connection status">Connection status</Label>
        </ToolbarGroup>
        <ToolbarGroup
            className={styles.toolbarGroup}>
            <Tooltip
                content={ gsproMessage }
                relationship="label">
                <Badge
                    size="small"
                    color={ gsproColour }>GSPRO</Badge>
            </Tooltip>
            <Tooltip
                content={ slxMessage }
                relationship="label">
                <Badge
                    size="small"
                    color={ slxColour }>SLX</Badge>
            </Tooltip>
        </ToolbarGroup>
    </Toolbar>
)};