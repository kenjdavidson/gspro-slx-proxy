import { MonitorToGSConnect } from '@common/monitor/MonitorEvent';
import { Text, makeStyles, tokens } from '@fluentui/react-components';
import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  TableColumnDefinition,
  createTableColumn,
} from '@fluentui/react-table';
import { PropsWithChildren } from 'react';
import { useMonitorData } from '../Components';

const useStyles = makeStyles({
  droppedRow: {
    backgroundColor: tokens.colorStatusWarningBackground2,
  },
  row: {
    backgroundColor: 'transparent',
  },
});

const Header = (props: PropsWithChildren) => <Text size={200}>{props.children}</Text>;

export const Data = () => {
  const monitorData = useMonitorData();
  const styles = useStyles();

  const columns: TableColumnDefinition<MonitorToGSConnect>[] = [
    createTableColumn<MonitorToGSConnect>({
      columnId: 'shotNumber',
      renderHeaderCell: () => <Header>Shot#</Header>,
      renderCell: (item) => item.ShotNumber || '',
    }),
    // BallData
    createTableColumn<MonitorToGSConnect>({
      columnId: 'ballSpeed',
      renderHeaderCell: () => <Header>Ball Speed</Header>,
      renderCell: (item) => item.BallData?.Speed.toFixed(2) || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'ballSpinAxis',
      renderHeaderCell: () => <Header>Spin Axis</Header>,
      renderCell: (item) => item.BallData?.SpinAxis.toFixed(2) || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'ballTotalSpin',
      renderHeaderCell: () => <Header>Total Spin</Header>,
      renderCell: (item) => item.BallData?.TotalSpin.toFixed(2) || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'ballBackSpin',
      renderHeaderCell: () => <Header>Back Spin</Header>,
      renderCell: (item) => item.BallData?.BackSpin.toFixed(2) || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'ballSideSpin',
      renderHeaderCell: () => <Header>Side Spin</Header>,
      renderCell: (item) => item.BallData?.SideSpin.toFixed(2) || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'clubVlaHla',
      renderHeaderCell: () => <Header>VLA/HLA </Header>,
      renderCell: (item) => `${item.BallData?.VLA.toFixed(2)}/${item.BallData?.HLA.toFixed(2)}` || '',
    }),
    // Shot Data
    createTableColumn<MonitorToGSConnect>({
      columnId: 'clubSpeed',
      renderHeaderCell: () => <Header>Club Speed</Header>,
      renderCell: (item) => item.ClubData?.Speed.toFixed(2) || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'attackAngle',
      renderHeaderCell: () => <Header>Attack Angle</Header>,
      renderCell: (item) => item.ClubData?.AngleOfAttack.toFixed(2) || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'faceAngle',
      renderHeaderCell: () => <Header>Face Angle</Header>,
      renderCell: (item) => item.ClubData?.FaceToTarget.toFixed(2) || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'lieAndLof',
      renderHeaderCell: () => <Header>Lie/Loft</Header>,
      renderCell: (item) => `${item.ClubData?.Lie.toFixed(2)}/${item.ClubData?.Loft.toFixed(2)}` || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'faceImpact',
      renderHeaderCell: () => <Header>VFI/HFI</Header>,
      renderCell: (item) =>
        `${item.ClubData?.VerticalFaceImpact.toFixed(2)}/${item.ClubData?.HorizontalFaceImpact.toFixed(2)}` || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'clubClosure',
      renderHeaderCell: () => <Header>Closure Rate</Header>,
      renderCell: (item) => item.ClubData?.ClosureRate.toFixed(2) || '',
    }),
  ];

  return (
    <DataGrid items={monitorData} columns={columns}>
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<MonitorToGSConnect>>
        {({ item, rowId }) => (
          <DataGridRow<MonitorToGSConnect>
            key={rowId}
            className={item.ClubData?.Speed == 0 ? styles.droppedRow : styles.row}
          >
            {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  );
};
