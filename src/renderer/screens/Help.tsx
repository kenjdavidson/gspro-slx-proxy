import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Divider,
  makeStyles,
  shorthands,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  divider: {
    ...shorthands.padding('2px', '2px', '2px', '2px'),
  },
  panel: {
    ...shorthands.padding('2px', '2px', '2px', '2px'),
  },
});

export const Help = () => {
  const styles = useStyles();

  return (
    <>
      <p>
        Provides a proxy between SLX Connect and GSPro Connect. This provides the ability to:
      </p>
      <ul>
          <li>Stop SLX from sending invalid data, which causes GSPro to reset clubs.</li>
          <li>Export SLX launch monitor details for use within 3rd party apps.</li>
        </ul>
      <Divider className={styles.divider} />
      <Accordion>
        <AccordionItem value={1}>
          <AccordionHeader>Configure GSPConnect Port</AccordionHeader>
          <AccordionPanel className={styles.panel}>
            <p>
              The default port for GSPConnect is <code>0921</code>, this needs to be changed so that the Proxy can be
              started on <code>0921</code> (as SLX Connect is not customizable). In order to do this:
              <ul>
                <li>
                  Open the file <code>C:\GSPro\GSPC\</code>
                </li>
                <li>
                  Find the line with content <code></code>
                </li>
                <li>
                  Change the port from <code>0921</code> to <code>0922</code> (at this point 0922 is required, need to
                  make customizable)
                </li>
              </ul>
            </p>
            <p>* Will attempt to automate this in settings at some point.</p>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value={2}>
          <AccordionHeader>Configure Proxy with newp GSPConnect port</AccordionHeader>
          <AccordionPanel>
            <p>
              <ul>
                <li>
                  Click on the <code>Settings</code> tab.
                </li>
                <li>
                  Under the <code>GSPro Section</code> change the port value to match step 1
                </li>
              </ul>
            </p>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value={3}>
          <AccordionHeader>Start GSPro</AccordionHeader>
          <AccordionPanel>
            <p>Start GSPro as you normally would, wait for GSPConnect to open.</p>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value={4}>
          <AccordionHeader>Start the PRoxy</AccordionHeader>
          <AccordionPanel>
            <p>
              On the <code>Home</code> tab, click{' '}
              <code>
                <strong>Start Proxy</strong>
              </code>
              . The GSPro connection status should be update (turn green).
            </p>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value={5}>
          <AccordionHeader>Start SLX Connect</AccordionHeader>
          <AccordionPanel>
            <p>
              Finally open SLX Connect and start the GSPro widget. The SLX connection status should update (turn green);
            </p>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};
