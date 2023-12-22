import { ConnectionStatus } from "@common/ConnectionStatus"
import { Button, makeStyles, shorthands } from "@fluentui/react-components"
import { useMemo } from "react";

export type ConnectionButtonsProps = {
    status: ConnectionStatus,
    connectText: string,
    onConnect: () => void,
    disconnectText?: string,
    onDisconnect: () => void
}

const useStyles = makeStyles({
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        ...shorthands.gap('8px')
    },
    connectButton: {
        flexGrow: 1
    },
    disconnectButton: {
        flexGrow: 0
    }
});

export const ConnectionButtons = ({
    status,
    connectText,
    onConnect,
    disconnectText = 'X',
    onDisconnect
}: ConnectionButtonsProps) => {
    const styles = useStyles();

    const connectDisabled = useMemo(() => {
        return status === ConnectionStatus.Connecting 
            || status === ConnectionStatus.Connected
    }, [status]);

    return (
        <div className={styles.wrapper}>            
            <Button className={styles.connectButton} onClick={onConnect} disabled={connectDisabled}>{connectText}</Button>
            <Button className={styles.disconnectButton} onClick={onDisconnect} disabled={!connectDisabled}>{disconnectText}</Button>
        </div>
    )
}