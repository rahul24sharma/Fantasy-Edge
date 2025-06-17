// api/footballData.ts
import { footballApi } from '@/lib/api';

const BASE_URL = 'https://api.football-data.org/v4';
const API_KEY = "8bba67bee162456589814afddce138db";

async function fetchFootballData(endpoint: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'X-Auth-Token': API_KEY! },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error(`Football API error (${res.status}): ${await res.text()}`);
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export async function getCompetitions() {
  const data = await fetchFootballData('/competitions?plan=TIER_ONE');
  return data.competitions || [];
}

export async function getTodaysMatches() {
  const today = new Date().toISOString().split('T')[0];
  const data = await fetchFootballData(`/matches?dateFrom=${today}&dateTo=${today}`);
  return data.matches || [];
}

export async function getLiveMatches() {
  const data = await fetchFootballData('/matches?status=LIVE');
  return data.matches || [];
}

export async function getStandings(competitionCode: string) {
  const data = await fetchFootballData(`/competitions/${competitionCode}/standings`);
  return data.standings?.[0]?.table || [];
}

export async function getCompetitionDetails(id: string) {
  const data = await fetchFootballData(`/competitions/${id}`);
  return data || null;}

  export async function getCompetitionStandings(id: string) {
    const res = await fetchFootballData(`/competitions/${id}/standings`);
    if (!res.ok) return null;
    return res.json();
  }
  
  export async function getCompetitionMatches(id: string) {
    const res = await fetchFootballData(`/competitions/${id}/matches`);
    if (!res.ok) return null;
    return res.json();
  }
  
  export async function getCompetitionScorers(id: string) {
    const res = await fetchFootballData(`/competitions/${id}/scorers?limit=10`);
    if (!res.ok) return null;
    return res.json();
  }
  
  export async function getCompetitionTeams(id: string) {
    const res = await fetchFootballData(`/competitions/${id}/teams`);
    if (!res.ok) return null;
    return res.json();
  }

  /**
 * Get all matches for a specific team
 * @param teamId - Team ID
 * @param options - Filtering options
 */
export async function getTeamMatches(
  teamId: string, 
  options: {
    dateFrom?: string;
    dateTo?: string;
    status?: 'SCHEDULED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'FINISHED';
    competitions?: string;
    venue?: 'HOME' | 'AWAY';
    limit?: number;
  } = {}
) {
  const params = new URLSearchParams();
  
  if (options.dateFrom) params.append('dateFrom', options.dateFrom);
  if (options.dateTo) params.append('dateTo', options.dateTo);
  if (options.status) params.append('status', options.status);
  if (options.competitions) params.append('competitions', options.competitions);
  if (options.venue) params.append('venue', options.venue);
  if (options.limit) params.append('limit', options.limit.toString());
  
  const endpoint = `/teams/${teamId}/matches${params.toString() ? `?${params.toString()}` : ''}`;
  const data = await fetchFootballData(endpoint);
  return data;
}

/**
 * Get teams from multiple competitions (popular teams)
 */
export async function getPopularTeams() {
  try {
    // Get teams from major competitions
    const competitions = ['PL', 'BL1', 'SA', 'PD', 'FL1']; // Premier League, Bundesliga, Serie A, La Liga, Ligue 1
    const allTeams = [];
    
    for (const comp of competitions) {
      try {
        const data = await fetchFootballData(`/competitions/${comp}/teams`);
        if (data.teams) {
          // Add competition info to each team
          const teamsWithCompetition = data.teams.map((team: any) => ({
            ...team,
            primaryCompetition: {
              id: comp,
              name: getCompetitionName(comp)
            }
          }));
          allTeams.push(...teamsWithCompetition);
        }
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn(`Failed to fetch teams for competition ${comp}:`, error);
      }
    }
    
    return {
      teams: allTeams.slice(0, 50), // Limit to top 50 teams
      count: allTeams.length
    };
  } catch (error) {
    console.error('Error fetching popular teams:', error);
    return { teams: [], count: 0 };
  }
}

/**
 * Search teams by name (client-side filtering)
 */
export async function searchTeams(query: string, limit: number = 10) {
  try {
    const popularTeams = await getPopularTeams();
    const filteredTeams = popularTeams.teams.filter((team: any) =>
      team.name.toLowerCase().includes(query.toLowerCase()) ||
      team.shortName?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit);
    
    return {
      teams: filteredTeams,
      count: filteredTeams.length,
      query
    };
  } catch (error) {
    console.error('Error searching teams:', error);
    return { teams: [], count: 0, query };
  }
}

// ===== PLAYERS API FUNCTIONS =====

/**
 * Get detailed information about a specific team including players
 * @param teamId - Team ID
 */
export async function getTeamDetails(teamId: string) {
  const data = await fetchFootballData(`/teams/${teamId}`);
  return data;
}

/**
 * Get players from multiple top teams
 */
export async function getPopularPlayers() {
  try {
    const topTeamIds = [
      57, 86, 81, 64, 65, 61, // Arsenal, Real Madrid, Barcelona, Liverpool, Man City, Chelsea
      5, 18, 108, 109, 113, // Bayern Munich, Borussia Dortmund, Inter, AC Milan, Napoli
      524, 548, 541, 529, // PSG, Real Sociedad, Atletico Madrid, Valencia
    ];

    const allPlayers = [];
    
    for (const teamId of topTeamIds) {
      try {
        console.log(`Fetching players from team ${teamId}...`);
        const teamData = await fetchFootballData(`/teams/${teamId}`);
        
        if (teamData.squad) {
          const playersWithTeam = teamData.squad.map((player: any) => ({
            ...player,
            team: {
              id: teamData.id,
              name: teamData.name,
              shortName: teamData.shortName,
              crest: teamData.crest,
              area: teamData.area
            }
          }));
          
          allPlayers.push(...playersWithTeam);
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 150));
        
      } catch (error) {
        console.warn(`Failed to fetch team ${teamId}:`, error);
      }
    }
    
    // Remove duplicates based on player name and date of birth
    const uniquePlayers = allPlayers.filter((player, index, self) => 
      index === self.findIndex(p => 
        p.name === player.name && p.dateOfBirth === player.dateOfBirth
      )
    );
    
    return {
      players: uniquePlayers,
      count: uniquePlayers.length
    };
  } catch (error) {
    console.error('Error fetching popular players:', error);
    return { players: [], count: 0 };
  }
}

/**
 * Search players by name or team
 */
export async function searchPlayers(query: string, limit: number = 50) {
  try {
    const popularPlayers = await getPopularPlayers();
    const filteredPlayers = popularPlayers.players.filter((player: any) =>
      player.name.toLowerCase().includes(query.toLowerCase()) ||
      player.nationality?.toLowerCase().includes(query.toLowerCase()) ||
      player.team?.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit);
    
    return {
      players: filteredPlayers,
      count: filteredPlayers.length,
      query
    };
  } catch (error) {
    console.error('Error searching players:', error);
    return { players: [], count: 0, query };
  }
}

// Helper function to get competition names
function getCompetitionName(code: string): string {
  const names: { [key: string]: string } = {
    'PL': 'Premier League',
    'BL1': 'Bundesliga',
    'SA': 'Serie A',
    'PD': 'La Liga',
    'FL1': 'Ligue 1',
    'CL': 'Champions League',
    'EL': 'Europa League'
  };
  return names[code] || code;
}