export type ShotDataOptions = {    
    ContainsBallData: boolean;  
    ContainsClubData: boolean;
    LaunchMonitorIsReady?: boolean;
    LauchMonitorBallDetected?: boolean;
    Heartbeat?: boolean;   
}

export type BallData = { 
    Speed: number;
    SpinAxis: number;
    TotalSpin: number;
    BackSpin: number;
    SideSpin: number;
    HLA: number;
    VLA: number;
    CarryDistance: number;
}

export type ClubData = {
    Speed: number;
    AngleOfAttack: number;
    FaceToTarget: number;
    Lie: number;
    loft: number;
    SpeedAtImpact: number;
    VerticalFaceImpact: number;
    HorizontalFaceImpact: number;
    ClosureRate: number;
}

export enum Units {
    Yards = 'Yards',
    Meters = 'Meters'
}

export type MonitorEvent = {
    DeviceID: string;
    Units: Units;
    ShotNumber: number;
    APIversion: string;
    BallData: BallData;
    ClubData: ClubData;
    ShotDataOptions: ShotDataOptions;
}
