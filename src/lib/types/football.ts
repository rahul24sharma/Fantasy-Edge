export interface Competition {
    id: number;
    name: string;
    code: string;
    type: string;
    emblem: string;
    area: Area;
    currentSeason: Season;
  }
  
  export interface Area {
    id: number;
    name: string;
    code: string;
    flag: string;
  }
  
  export interface Season {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number;
    winner?: Team;
  }
  
  export interface Team {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
    address: string;
    website: string;
    founded: number;
    clubColors: string;
    venue: string;
    runningCompetitions: Competition[];
    coach: Person;
    squad: Person[];
  }
  
  export interface Person {
    id: number;
    name: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    nationality?: string;
    position?: string;
    shirtNumber?: number;
  }
  
  export interface Match {
    id: number;
    competition: Competition;
    season: Season;
    utcDate: string;
    status: MatchStatus;
    matchday: number;
    stage: string;
    group?: string;
    lastUpdated: string;
    homeTeam: Team;
    awayTeam: Team;
    score: Score;
    goals: Goal[];
    bookings: Booking[];
    substitutions: Substitution[];
    odds?: Odds;
    referees: Referee[];
  }
  
  export interface Score {
    winner?: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW';
    duration: string;
    fullTime: ScoreDetail;
    halfTime: ScoreDetail;
    extraTime?: ScoreDetail;
    penalties?: ScoreDetail;
  }
  
  export interface ScoreDetail {
    home: number | null;
    away: number | null;
  }
  
  export interface Goal {
    minute: number;
    injuryTime?: number;
    type: string;
    team: Team;
    scorer: Person;
    assist?: Person;
  }
  
  export interface Booking {
    minute: number;
    team: Team;
    player: Person;
    card: 'YELLOW_CARD' | 'SECOND_YELLOW_CARD' | 'RED_CARD';
  }
  
  export interface Substitution {
    minute: number;
    team: Team;
    playerOut: Person;
    playerIn: Person;
  }
  
  export interface Referee {
    id: number;
    name: string;
    type: string;
    nationality: string;
  }
  
  export interface Odds {
    msg: string;
  }
  
  export interface Standing {
    stage: string;
    type: string;
    group?: string;
    table: TableEntry[];
  }
  
  export interface TableEntry {
    position: number;
    team: Team;
    playedGames: number;
    form?: string;
    won: number;
    draw: number;
    lost: number;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
  }
  
  export type MatchStatus = 
    | 'SCHEDULED' 
    | 'LIVE' 
    | 'IN_PLAY' 
    | 'PAUSED' 
    | 'FINISHED' 
    | 'POSTPONED' 
    | 'SUSPENDED' 
    | 'CANCELLED';
  
  export type MatchStage = 
    | 'FINAL'
    | 'THIRD_PLACE'
    | 'SEMI_FINALS'
    | 'QUARTER_FINALS'
    | 'LAST_16'
    | 'LAST_32'
    | 'LAST_64'
    | 'ROUND_4'
    | 'ROUND_3'
    | 'ROUND_2'
    | 'ROUND_1'
    | 'GROUP_STAGE'
    | 'PRELIMINARY_ROUND'
    | 'QUALIFICATION'
    | 'QUALIFICATION_ROUND_1'
    | 'QUALIFICATION_ROUND_2'
    | 'QUALIFICATION_ROUND_3'
    | 'PLAYOFF_ROUND_1'
    | 'PLAYOFF_ROUND_2'
    | 'PLAYOFFS'
    | 'REGULAR_SEASON'
    | 'CLAUSURA'
    | 'APERTURA'
    | 'CHAMPIONSHIP'
    | 'RELEGATION'
    | 'RELEGATION_ROUND';
  
  export type Venue = 'HOME' | 'AWAY';