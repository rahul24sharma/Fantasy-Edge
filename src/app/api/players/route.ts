// app/api/players/route.ts
import { NextRequest, NextResponse } from 'next/server';

// API-Football configuration
const API_KEY = '9d6dfc7455cc12cb4d57e54eb32e3216';

const API_CONFIG = {
  baseUrl: 'https://v3.football.api-sports.io',
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': 'v3.football.api-sports.io'
  }
};

// Helper function to make API calls with better error handling
async function callAPI(endpoint: string, params: Record<string, any> = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_CONFIG.baseUrl}/${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    console.log(`Calling API: ${url}`);
    console.log(`API Key configured: Yes`);
    
    const response = await fetch(url, {
      headers: API_CONFIG.headers,
      next: { revalidate: 3600 }
    });
    
    console.log(`API Response Status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error Response: ${errorText}`);
      throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`API Response: ${JSON.stringify(data).substring(0, 200)}...`);
    
    return data;
    
  } catch (error) {
    console.error(`API call error:`, error);
    throw error;
  }
}

// Recursive function to get ALL players from a league with proper pagination
async function getAllPlayersFromLeague(leagueId: number, season: number, page = 1, allPlayers: any[] = []): Promise<any[]> {
  try {
    console.log(`Fetching league ${leagueId}, season ${season}, page ${page}`);
    
    const data = await callAPI('players', {
      league: leagueId,
      season: season,
      page: page
    });
    
    if (data.response && data.response.length > 0) {
      // Add current page players to our collection
      allPlayers.push(...data.response);
      console.log(`Page ${page}: Got ${data.response.length} players. Total so far: ${allPlayers.length}`);
      
      // Check if there are more pages
      if (data.paging && data.paging.current < data.paging.total) {
        console.log(`More pages available. Current: ${data.paging.current}, Total: ${data.paging.total}`);
        
        // Add delay to respect rate limits (as shown in documentation)
        if (page % 2 === 1) {
          console.log('Adding 1 second delay for rate limiting...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Recursively fetch next page
        return getAllPlayersFromLeague(leagueId, season, page + 1, allPlayers);
      } else {
        console.log(`Reached last page. Total players from league ${leagueId}: ${allPlayers.length}`);
      }
    } else {
      console.log(`Page ${page}: No players found`);
    }
    
    return allPlayers;
    
  } catch (error) {
    console.error(`Error fetching players from league ${leagueId}, page ${page}:`, error);
    return allPlayers; // Return what we have so far
  }
}

// Transform API-Football player data to our format
function transformPlayer(playerData: any) {
  try {
    return {
      id: playerData.player?.id || Math.random() * 1000000,
      name: playerData.player?.name || 'Unknown Player',
      position: playerData.statistics?.[0]?.games?.position || 'Unknown',
      dateOfBirth: playerData.player?.birth?.date || '1990-01-01',
      nationality: playerData.player?.nationality || 'Unknown',
      team: playerData.statistics?.[0]?.team ? {
        id: playerData.statistics[0].team.id,
        name: playerData.statistics[0].team.name,
        shortName: playerData.statistics[0].team.name,
        crest: playerData.statistics[0].team.logo
      } : null,
      photo: playerData.player?.photo,
      status: playerData.player?.injured ? 'Injured' : 'Active',
      gender: 'Male',
      age: playerData.player?.age,
      height: playerData.player?.height,
      weight: playerData.player?.weight
    };
  } catch (error) {
    console.error('Error transforming player:', error, playerData);
    return {
      id: Math.random() * 1000000,
      name: 'Error Player',
      position: 'Unknown',
      dateOfBirth: '1990-01-01',
      nationality: 'Unknown',
      team: null,
      photo: null,
      status: 'Unknown',
      gender: 'Male'
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const position = searchParams.get('position');
    const nationality = searchParams.get('nationality');
    const limit = parseInt(searchParams.get('limit') || '500');

    console.log('=== API-Football Players API ===');
    console.log(`Fetching players with limit: ${limit}`);
    console.log(`Using API key: ${API_KEY.substring(0, 8)}...${API_KEY.substring(API_KEY.length - 4)}`);

    // Test API connection first
    console.log('Testing API connection...');
    try {
      const testData = await callAPI('leagues', { 
        id: 39, // Premier League
        season: 2023  // Changed to 2023 for free plan
      });
      console.log('API connection test successful');
    } catch (error) {
      console.error('API connection test failed:', error);
      return NextResponse.json(
        { 
          error: 'API connection failed',
          message: 'Unable to connect to API-Football. Check your API key and internet connection.',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    let allPlayers: any[] = [];
    const currentSeason = 2023; // Changed to 2023 for free plan compatibility
    
    try {
      // Fetch from Premier League (ID: 39) - Get ALL pages
      console.log('\n--- Fetching Premier League players (ALL PAGES) ---');
      console.log(`Using season ${currentSeason} (free plan compatible)`);
      const premierLeaguePlayers = await getAllPlayersFromLeague(39, currentSeason);
      allPlayers.push(...premierLeaguePlayers);
      
      console.log(`\nPremier League: ${premierLeaguePlayers.length} players`);
      console.log(`Total players so far: ${allPlayers.length}`);

      // If we need more players, fetch from another league
      if (allPlayers.length < limit) {
        console.log('\n--- Fetching La Liga players ---');
        const laLigaPlayers = await getAllPlayersFromLeague(140, currentSeason); // La Liga
        allPlayers.push(...laLigaPlayers);
        console.log(`La Liga: ${laLigaPlayers.length} players`);
        console.log(`Total players so far: ${allPlayers.length}`);
      }

      // If still need more players, try Bundesliga
      if (allPlayers.length < limit) {
        console.log('\n--- Fetching Bundesliga players ---');
        const bundesligaPlayers = await getAllPlayersFromLeague(78, currentSeason); // Bundesliga
        allPlayers.push(...bundesligaPlayers);
        console.log(`Bundesliga: ${bundesligaPlayers.length} players`);
        console.log(`Total players so far: ${allPlayers.length}`);
      }

      console.log(`\nFinal total players fetched: ${allPlayers.length}`);

    } catch (error) {
      console.error('Error fetching players:', error);
      return NextResponse.json(
        { 
          error: 'Failed to fetch players from API',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    if (allPlayers.length === 0) {
      return NextResponse.json(
        { 
          error: 'No players found',
          message: 'API returned no players. This might be due to API limits or invalid season.',
          debug: {
            totalFetched: 0,
            apiUsed: 'API-Football'
          }
        },
        { status: 404 }
      );
    }

    // Transform players to our format
    console.log('Transforming player data...');
    const transformedPlayers = allPlayers.map(transformPlayer);

    // Remove duplicates
    const uniquePlayers = transformedPlayers.reduce((acc: any[], current: any) => {
      const exists = acc.find(player => player.id === current.id);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);

    console.log(`Unique players after deduplication: ${uniquePlayers.length}`);

    // Apply filters
    let filteredPlayers = uniquePlayers;

    // Search filter
    if (search) {
      const originalCount = filteredPlayers.length;
      filteredPlayers = filteredPlayers.filter((player: any) =>
        player.name.toLowerCase().includes(search.toLowerCase()) ||
        player.nationality?.toLowerCase().includes(search.toLowerCase()) ||
        player.team?.name?.toLowerCase().includes(search.toLowerCase())
      );
      console.log(`Search filter "${search}": ${originalCount} -> ${filteredPlayers.length}`);
    }

    // Position filter
    if (position && position !== 'all') {
      const originalCount = filteredPlayers.length;
      filteredPlayers = filteredPlayers.filter((player: any) => {
        if (!player.position) return false;
        
        const pos = player.position.toLowerCase();
        switch (position.toLowerCase()) {
          case 'goalkeeper':
            return pos.includes('goalkeeper');
          case 'defender':
            return pos.includes('defender');
          case 'midfielder':
            return pos.includes('midfielder');
          case 'forward':
            return pos.includes('attacker');
          default:
            return pos.includes(position.toLowerCase());
        }
      });
      console.log(`Position filter "${position}": ${originalCount} -> ${filteredPlayers.length}`);
    }

    // Nationality filter
    if (nationality && nationality !== 'all') {
      const originalCount = filteredPlayers.length;
      filteredPlayers = filteredPlayers.filter((player: any) => 
        player.nationality === nationality
      );
      console.log(`Nationality filter "${nationality}": ${originalCount} -> ${filteredPlayers.length}`);
    }

    // Sort and limit
    filteredPlayers.sort((a: any, b: any) => a.name.localeCompare(b.name));
    const limitedPlayers = filteredPlayers.slice(0, limit);

    // Get filter options
    const positions = [...new Set(uniquePlayers.map((p: any) => p.position).filter(Boolean))];
    const nationalities = [...new Set(uniquePlayers.map((p: any) => p.nationality).filter(Boolean))];
    const teams = [...new Set(uniquePlayers.map((p: any) => p.team?.name).filter(Boolean))];

    console.log(`\n=== FINAL RESULTS ===`);
    console.log(`Returning ${limitedPlayers.length} players to frontend`);
    console.log(`Filter options: ${positions.length} positions, ${nationalities.length} nationalities, ${teams.length} teams`);

    return NextResponse.json({
      players: limitedPlayers,
      total: filteredPlayers.length,
      positions: positions.sort(),
      nationalities: nationalities.sort(),
      teams: teams.sort(),
      debug: {
        totalFetched: allPlayers.length,
        totalUnique: uniquePlayers.length,
        totalFiltered: filteredPlayers.length,
        apiUsed: 'API-Football via RapidAPI',
        hasApiKey: true,
        apiKeyPreview: `${API_KEY.substring(0, 8)}...${API_KEY.substring(API_KEY.length - 4)}`
      }
    });

  } catch (error) {
    console.error('Players API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}