import { Button, ButtonProps, Card, CardPreview, Text, makeStyles } from '@fluentui/react-components';
import { PropsWithChildren } from 'react';

const useStyles = makeStyles({
  card: {
    minWidth: '300px',
  },
  preview: {
    minHeight: '150px',
    position: 'relative',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  title: {
    position: 'absolute',
    textAlign: 'center',
    userSelect: 'none',
  },
});

export interface ProxyCardProps extends PropsWithChildren {
  title: string;
  action: string;
  actionProps: ButtonProps;
}

export const ProxyCard = ({ title, action, actionProps }: ProxyCardProps) => {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <CardPreview className={styles.preview}>
        <Text size={1000} className={styles.title}>
          {title}
        </Text>
      </CardPreview>
      <Button {...actionProps}>{action}</Button>
    </Card>
  );
};
