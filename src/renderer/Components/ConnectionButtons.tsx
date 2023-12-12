import { Button } from "@fluentui/react-components"

export type ConnectionButtonsProps = {
    gsproButtonClick: () => void,
    slxButtonClick: () => void
}

export const ConnectionButtons = ({
    gsproButtonClick,
    slxButtonClick
}: ConnectionButtonsProps) => {
    return (
        <>            
            <Button onClick={gsproButtonClick}>Toggle GSPro</Button>
            <Button onClick={slxButtonClick}>Toggle SLX</Button>
        </>
    )
}