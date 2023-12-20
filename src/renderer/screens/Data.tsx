import { MonitorToGSConnect } from '@common/monitor/MonitorEvent';
import { Text } from '@fluentui/react-components';
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
import { useMonitorData } from '../components/ProxyContext';

const Header = (props: PropsWithChildren) => <Text size={200}>{props.children}</Text>;

export const Data = () => {
  const monitorData = useMonitorData();

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
      renderCell: (item) => item.BallData?.Speed || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'ballSpinAxis',
      renderHeaderCell: () => <Header>Spin Axis</Header>,
      renderCell: (item) => item.BallData?.SpinAxis || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'ballTotalSpin',
      renderHeaderCell: () => <Header>Total Spin</Header>,
      renderCell: (item) => item.BallData?.TotalSpin || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'ballBackSpin',
      renderHeaderCell: () => <Header>Back Spin</Header>,
      renderCell: (item) => item.BallData?.BackSpin || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'ballSideSpin',
      renderHeaderCell: () => <Header>Side Spin</Header>,
      renderCell: (item) => item.BallData?.SideSpin || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'ballHLaunchAngle',
      renderHeaderCell: () => <Header>HLA </Header>,
      renderCell: (item) => item.BallData?.HLA || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'clubVlaHla',
      renderHeaderCell: () => <Header>VLA/HLA </Header>,
      renderCell: (item) => `${item.BallData?.VLA}/${item.BallData?.HLA}` || '',
    }),
    // Shot Data
    createTableColumn<MonitorToGSConnect>({
      columnId: 'clubSpeed',
      renderHeaderCell: () => <Header>Club Speed</Header>,
      renderCell: (item) => item.ClubData?.Speed || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'attackAngle',
      renderHeaderCell: () => <Header>Attack Angle</Header>,
      renderCell: (item) => item.ClubData?.AngleOfAttack || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'faceAngle',
      renderHeaderCell: () => <Header>Face Angle</Header>,
      renderCell: (item) => item.ClubData?.FaceToTarget || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'lieAndLof',
      renderHeaderCell: () => <Header>Lie/Loft</Header>,
      renderCell: (item) => `${item.ClubData?.Lie}/${item.ClubData?.Loft}` || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'faceImpact',
      renderHeaderCell: () => <Header>VFI/HFI</Header>,
      renderCell: (item) => `${item.ClubData?.VerticalFaceImpact}/${item.ClubData?.HorizontalFaceImpact}` || '',
    }),
    createTableColumn<MonitorToGSConnect>({
      columnId: 'clubClosure',
      renderHeaderCell: () => <Header>Closure Rate</Header>,
      renderCell: (item) => item.ClubData?.ClosureRate || '',
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
          >
            {({ renderCell }) => (
              <DataGridCell>{renderCell(item)}</DataGridCell>
            )}
          </DataGridRow>
        )}
      </DataGridBody> 
    </DataGrid>
  );
};
