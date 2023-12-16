import { Badge, Label, Toolbar, ToolbarGroup, ToolbarProps, Tooltip, makeStyles, shorthands } from "@fluentui/react-components";

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
    gsproConnected: boolean;
    slxconnected: boolean;
}
  
export const StatusBar = ({
    gsproConnected,
    slxconnected,
    ...props
}: Partial<StatusBarProps>) => {
    const styles = useStyles();  

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
                content={ gsproConnected ? 'Connected to GSPro' : 'Not connected to GSPro' }
                relationship="label">
                <Badge
                    size="small"
                    color={ gsproConnected ? "success" : "informative"}>GSPRO</Badge>
            </Tooltip>
            <Tooltip
                content={ slxconnected ? 'Connected to SLX Connect' : 'Not connected to SLX Connect' }
                relationship="label">
                <Badge
                    size="small"
                    color={ slxconnected ? "success" : "informative"}>SLX</Badge>
            </Tooltip>
        </ToolbarGroup>
    </Toolbar>
)};