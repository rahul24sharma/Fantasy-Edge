export interface Competition {
    id: number;
    name: string;
    code: string;
    type: string;
    emblem: string;
  }
  
  export interface Team {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  }
  
  export interface Score {
    home: number | null;
    away: number | null;
  }
  
  export interface Match {
    id: number;
    utcDate: string;
    status: string;
    homeTeam: Team;
    awayTeam: Team;
    score: {
      fullTime: Score;
      halfTime?: Score;
    };
    competition: {
      id: number;
      name: string;
      code: string;
    };
  }
  
  export interface Standing {
    position: number;
    team: Team;
    playedGames: number;
    won: number;
    draw: number;
    lost: number;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
  }