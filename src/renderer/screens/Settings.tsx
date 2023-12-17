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
    gsproPort: "0922"
  });

  const onGsproPortChange: InputProps["onChange"] = (_, data) => {
    if (!Number.isNaN(data.value)) {
        setFormValues({
            ...formValues,
            gsproPort: data.value.toString().padStart(4, '0')
        })
    }
  };

  return (
    <>
      <p className={styles.inputWrapper}>
        <InfoLabel htmlFor={inputId} 
          size="small">
          GSPro Port (default 0921)
        </InfoLabel>
        <Input id={inputId} 
          type='number' 
          value={formValues.gsproPort} 
          onChange={onGsproPortChange}
          readOnly={true} />
      </p>
      <p className={styles.buttonBar}>
        <Button appearance="primary">Save</Button>
        <Button >Reset</Button>
      </p>
    </>
  );
};
