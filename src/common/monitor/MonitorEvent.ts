export type ShotDataOptions = {
  ContainsBallData: boolean;
  ContainsClubData: boolean;
  LaunchMonitorIsReady?: boolean;
  LauchMonitorBallDetected?: boolean;
  Heartbeat?: boolean;
};

export type BallData = {
  Speed: number;
  SpinAxis: number;
  TotalSpin: number;
  BackSpin: number;
  SideSpin: number;
  HLA: number;
  VLA: number;
  CarryDistance: number;
};

export type ClubData = {
  Speed: number;
  AngleOfAttack: number;
  FaceToTarget: number;
  Lie: number;
  Loft: number;
  SpeedAtImpact: number;
  VerticalFaceImpact: number;
  HorizontalFaceImpact: number;
  ClosureRate: number;
};

export enum Units {
  Yards = 'Yards',
  Meters = 'Meters',
}

export type MonitorToGSConnect = {
  DeviceID: string;
  Units: Units;
  ShotNumber: number;
  APIversion: string;
  BallData?: BallData;
  ClubData?: ClubData;
  ShotDataOptions: ShotDataOptions;
};

export function convertToHeartbeat(data: MonitorToGSConnect): MonitorToGSConnect {
  return {
    DeviceID: data.DeviceID,
    Units: data.Units,
    ShotNumber: data.ShotNumber,
    APIversion: data.APIversion,
    ShotDataOptions: {
      ContainsBallData: false,
      ContainsClubData: false,
      LaunchMonitorIsReady: data.ShotDataOptions.LaunchMonitorIsReady,
      LauchMonitorBallDetected: data.ShotDataOptions.LauchMonitorBallDetected,
      Heartbeat: true,
    },
  };
}
