export enum Hand {
    RightHand = 'RH',
    LeftHand = 'LH'
}

export enum Club {
    Driver = 'DR',
    ThreeWood = '3W',
    ThreeHybrid = '3H',
    ThreeIron = '3I',
    FourIron = '4I',
    FiveIron = '5I',
    SixIron = '6I',
    SevenIron = '7I',
    EightIron = '8I',
    NineIron = '9I',
    PitchingWedge = 'PW',
    GapWedge = 'GW',
    SandWedge = 'SW',    
    LobWedge = 'LW',
    Putter = 'PT'
}

export type Player = {
    Handed: Hand,
    Club: Club
}

export type GsproEvent = {
    Code: number;
    Message: string;
    Player: Player;
}