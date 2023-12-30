import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Divider,
  Link,
  Text,
  makeStyles,
  shorthands,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  p: {
    display: 'block',
  },
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
      <Text size={600}>Help Topics</Text>
      <Text as={'p'} className={styles.p}>
        SLX Proxy is an application that sits between the{' '}
        <Link href="https://slxonhttps://support.swinglogic.us/hc/en-us">SLX Connect App</Link>
        and the GSP Connector. It acts as a filter of invalid messages sent by SLX Connect which cause problems with
        GSPro:
      </Text>
      <ul>
        <li>
          Sending invalid shot data causing GSPro to reset the shot and club, making it impossible to change clubs at
          times.
        </li>
      </ul>
      <Divider className={styles.divider} />
      <Accordion>
        <AccordionItem value={1}>
          <AccordionHeader>Starting the Envrionment</AccordionHeader>
          <AccordionPanel className={styles.panel}>
            Getting up and running requires a little manual effort at this point in time, hopefully will get this all
            automated at some time. The most important thing is the order in which you turn on applications, although in
            most cases if something goes bad a restart should fix things right up.
            <ol>
              <li>
                <Text size={400}>Confgiure GSPConnect to start on a different port</Text>
                <p>
                  By default the GSPConnect app starts on port <code>0921</code>; in order for the proxy to connect this
                  port must be change from the default to <code>0922</code>. To make this change:
                </p>
                <ul>
                  <li>
                    Open the file <code>C:\GSPro\GSPC\GSPconnect.exe.config</code>
                  </li>
                  <li>
                    Find the line with content <code>&lt;OpenAPIUseAltPort&gt;false&lt;/OpenAPIUseAltPort&gt;</code> and
                    change the value to <code>&lt;OpenAPIUseAltPort&gt;true&lt;/OpenAPIUseAltPort&gt;</code>
                  </li>
                </ul>
              </li>
              <li>
                <Text size={400}>Start GSPro</Text>
                <p>Fire up GSPro as you normally would, make sure that the GSPConnect window loads.</p>
              </li>
              <li>
                <Text size={400}>Start the Proxy</Text>
                <p>
                  Fire up the <code>gspro-slx-proxy</code> app, you should see the <code>Home</code> screen displaying
                  both the
                  <strong>GSPro Connection</strong> and <strong>Monitor Connection</strong> sections.
                </p>
                <ul>
                  <li>Connect to GSPro, at this point you should see the GSPConnect status turn green.</li>
                  <li>Start the Monitor Connection, this starts the listener for SLX Connect</li>
                </ul>
              </li>
              <li>
                <Text size={400}>Start SLX Connect Widget</Text>
                <p>Start the SLX Connect widget and click to connect. The SLX status on the proxy should turn green.</p>
              </li>
            </ol>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value={2}>
          <AccordionHeader>Issues or Suggestions</AccordionHeader>
          <AccordionPanel>
            <p>
              If you have any issues or see anything funky, you can reach out or open an issue on the Github{' '}
              <Link href="https://github.com/kenjdavidson/gspro-slx-connect">project page</Link>
            </p>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};
