import { GSPRO_PORT_STRING } from '@common/gspro/Config';
import { Button, InfoLabel, Input, InputProps, makeStyles, useId } from '@fluentui/react-components';
import { useState } from 'react';

const useStyles = makeStyles({
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  buttonBar: {
    display: 'flex',
    columnGap: '12px',
  },
});

export const Settings = () => {
  const styles = useStyles();
  const inputId = useId('gspro-port');
  const [formValues, setFormValues] = useState({
    gsproPort: GSPRO_PORT_STRING
  });

  const onGsproPortChange: InputProps["onChange"] = (_, data) => {
    if (!Number.isNaN(data.value)) {
        setFormValues({
            ...formValues,
            gsproPort: data.value
        })
    }
  };

  return (
    <>
      <p className={styles.inputWrapper}>
        <InfoLabel htmlFor={inputId} size="small" info={<>* Must be a numeric value</>}>
          GSPro Port (default {GSPRO_PORT_STRING})
        </InfoLabel>
        <Input id={inputId} type='number' value={formValues.gsproPort} onChange={onGsproPortChange} />
      </p>
      <p className={styles.buttonBar}>
        <Button appearance="primary">Save</Button>
        <Button >Reset</Button>
      </p>
    </>
  );
};
