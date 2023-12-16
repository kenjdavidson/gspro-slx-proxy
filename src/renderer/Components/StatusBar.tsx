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
            <Label size="small" aria-label="Application name">GSPro SLX Proxy</Label>
        </ToolbarGroup>
        <ToolbarGroup
            className={styles.toolbarGroup}>
            <Tooltip
                content={ gsproConnected ? 'Connected to GSPConnect' : 'Not connected to GSPConnect' }
                relationship="label">
                <Badge
                    size="small"
                    color={ gsproConnected ? "success" : "informative"}>GSPRO</Badge>
            </Tooltip>
            <Tooltip
                content={ slxconnected ? 'Conected to SLX Connect' : 'Not connected to SLX Connect' }
                relationship="label">
                <Badge
                    size="small"
                    color={ slxconnected ? "success" : "informative"}>SLX</Badge>
            </Tooltip>
        </ToolbarGroup>
    </Toolbar>
)};