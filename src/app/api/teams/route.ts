// app/api/teams/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://api.football-data.org/v4';
const API_KEY = "8bba67bee162456589814afddce138db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const competition = searchParams.get('competition');
    const limit = searchParams.get('limit') || '50';

    console.log('Teams API called with params:', { search, competition, limit });

    // Get teams from major competitions
    const competitions = ['PL', 'BL1', 'SA', 'PD', 'FL1', 'CL']; // Premier League, Bundesliga, Serie A, La Liga, Ligue 1, Champions League
    const allTeams = [];

    for (const comp of competitions) {
      try {
        console.log(`Fetching teams from ${comp}...`);
        
        const response = await fetch(`${BASE_URL}/competitions/${comp}/teams`, {
          headers: {
            'X-Auth-Token': API_KEY,
          },
          next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
          console.warn(`Failed to fetch teams for ${comp}: ${response.status}`);
          continue;
        }

        const data = await response.json();
        
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
          console.log(`Added ${teamsWithCompetition.length} teams from ${comp}`);
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.warn(`Error fetching teams for competition ${comp}:`, error);
      }
    }

    console.log(`Total teams fetched: ${allTeams.length}`);

    // Remove duplicates based on team ID
    const uniqueTeams = allTeams.filter((team, index, self) => 
      index === self.findIndex(t => t.id === team.id)
    );

    console.log(`Unique teams after deduplication: ${uniqueTeams.length}`);

    // Apply filters
    let filteredTeams = uniqueTeams;

    // Search filter
    if (search) {
      filteredTeams = filteredTeams.filter((team: any) =>
        team.name.toLowerCase().includes(search.toLowerCase()) ||
        team.shortName?.toLowerCase().includes(search.toLowerCase()) ||
        team.tla?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Competition filter
    if (competition && competition !== 'all') {
      filteredTeams = filteredTeams.filter((team: any) => 
        team.primaryCompetition?.id === competition
      );
    }

    // Limit results
    const limitedTeams = filteredTeams.slice(0, parseInt(limit));

    console.log(`Final teams count: ${limitedTeams.length}`);

    return NextResponse.json({
      teams: limitedTeams,
      total: filteredTeams.length,
      competitions: [...new Set(uniqueTeams.map((t: any) => t.primaryCompetition?.name).filter(Boolean))],
      countries: [...new Set(uniqueTeams.map((t: any) => t.area?.name).filter(Boolean))]
    });

  } catch (error) {
    console.error('Teams API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch teams',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
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