import { Accordion, Text } from '@fluentui/react-components';

export const Help = () => {
  return (
    <>
      <Text as='p'>
        Provides a proxy between SLX Connect and GSPro Connect in order to log and filter messages.  In order to get the proxy working, there 
        are a couple of steps that need to be taken:
        <ul>
            <li>Reconfigure GSConnect port</li>
            <li>Configure the Proxy to use the new port</li>
            <li>Start GSPro/GSPConnect</li>
            <li>Start the Proxy</li>
            <li>Start and connect the SLX Widget</li>
        </ul>
      </Text>
      <Accordion></Accordion>
    </>
  );
};
