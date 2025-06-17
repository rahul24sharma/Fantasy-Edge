// app/api/fixtures/route.ts
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

// Helper function to make API calls
async function callAPI(endpoint: string, params: Record<string, any> = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_CONFIG.baseUrl}/${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    console.log(`Calling API: ${url}`);
    
    const response = await fetch(url, {
      headers: API_CONFIG.headers,
      next: { revalidate: 15 } // Cache for 15 seconds (matches API update frequency)
    });
    
    console.log(`API Response Status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error Response: ${errorText}`);
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`API Response: ${data.results} fixtures found`);
    
    return data;
    
  } catch (error) {
    console.error(`API call error:`, error);
    throw error;
  }
}

// Transform fixture data
function transformFixture(fixtureData: any) {
  return {
    id: fixtureData.fixture.id,
    referee: fixtureData.fixture.referee,
    timezone: fixtureData.fixture.timezone,
    date: fixtureData.fixture.date,
    timestamp: fixtureData.fixture.timestamp,
    periods: {
      first: fixtureData.fixture.periods?.first,
      second: fixtureData.fixture.periods?.second
    },
    venue: {
      id: fixtureData.fixture.venue?.id,
      name: fixtureData.fixture.venue?.name || 'Unknown Venue',
      city: fixtureData.fixture.venue?.city || 'Unknown City'
    },
    status: {
      long: fixtureData.fixture.status?.long || 'Unknown',
      short: fixtureData.fixture.status?.short || 'NS',
      elapsed: fixtureData.fixture.status?.elapsed,
      extra: fixtureData.fixture.status?.extra
    },
    league: {
      id: fixtureData.league.id,
      name: fixtureData.league.name,
      country: fixtureData.league.country,
      logo: fixtureData.league.logo,
      flag: fixtureData.league.flag,
      season: fixtureData.league.season,
      round: fixtureData.league.round
    },
    teams: {
      home: {
        id: fixtureData.teams.home.id,
        name: fixtureData.teams.home.name,
        logo: fixtureData.teams.home.logo,
        winner: fixtureData.teams.home.winner
      },
      away: {
        id: fixtureData.teams.away.id,
        name: fixtureData.teams.away.name,
        logo: fixtureData.teams.away.logo,
        winner: fixtureData.teams.away.winner
      }
    },
    goals: {
      home: fixtureData.goals.home,
      away: fixtureData.goals.away
    },
    score: {
      halftime: {
        home: fixtureData.score.halftime?.home,
        away: fixtureData.score.halftime?.away
      },
      fulltime: {
        home: fixtureData.score.fulltime?.home,
        away: fixtureData.score.fulltime?.away
      },
      extratime: {
        home: fixtureData.score.extratime?.home,
        away: fixtureData.score.extratime?.away
      },
      penalty: {
        home: fixtureData.score.penalty?.home,
        away: fixtureData.score.penalty?.away
      }
    }
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const league = searchParams.get('league');
    const team = searchParams.get('team');
    const live = searchParams.get('live');
    const next = searchParams.get('next');
    const last = searchParams.get('last');
    const status = searchParams.get('status');

    console.log('=== Fixtures API ===');
    console.log('Parameters:', { date, league, team, live, next, last, status });

    let fixtures: any[] = [];
    
    try {
      // Handle different types of requests
      if (live === 'all') {
        // Get all live fixtures
        console.log('Fetching all live fixtures...');
        const data = await callAPI('fixtures', { live: 'all' });
        fixtures = data.response || [];
        
      } else if (live && live.includes('-')) {
        // Get live fixtures for specific leagues
        console.log(`Fetching live fixtures for leagues: ${live}`);
        const data = await callAPI('fixtures', { live });
        fixtures = data.response || [];
        
      } else if (date) {
        // Get fixtures for specific date
        console.log(`Fetching fixtures for date: ${date}`);
        const params: any = { date };
        if (league) params.league = league;
        if (team) params.team = team;
        if (status) params.status = status;
        
        const data = await callAPI('fixtures', params);
        fixtures = data.response || [];
        
      } else if (next) {
        // Get next X fixtures
        console.log(`Fetching next ${next} fixtures`);
        const params: any = { next };
        if (league) params.league = league;
        if (team) params.team = team;
        
        const data = await callAPI('fixtures', params);
        fixtures = data.response || [];
        
      } else if (last) {
        // Get last X fixtures
        console.log(`Fetching last ${last} fixtures`);
        const params: any = { last };
        if (league) params.league = league;
        if (team) params.team = team;
        if (status) params.status = status;
        
        const data = await callAPI('fixtures', params);
        fixtures = data.response || [];
        
      } else {
        // Default: Get today's fixtures from major leagues
        const today = new Date().toISOString().split('T')[0];
        console.log(`Fetching today's fixtures: ${today}`);
        
        const majorLeagues = [39, 140, 78, 135, 61]; // Premier League, La Liga, Bundesliga, Serie A, Ligue 1
        
        // Fetch from multiple leagues if no specific league requested
        if (!league) {
          for (const leagueId of majorLeagues.slice(0, 3)) { // Limit to 3 leagues to avoid too many API calls
            try {
              const data = await callAPI('fixtures', { 
                date: today, 
                league: leagueId,
                season: 2023 // Use 2023 season for free plan
              });
              if (data.response) {
                fixtures.push(...data.response);
              }
              // Small delay between requests
              await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
              console.warn(`Failed to fetch fixtures for league ${leagueId}:`, error);
            }
          }
        } else {
          const data = await callAPI('fixtures', { 
            date: today, 
            league,
            season: 2023 // Use 2023 season for free plan
          });
          fixtures = data.response || [];
        }
      }

      console.log(`Total fixtures fetched: ${fixtures.length}`);

    } catch (error) {
      console.error('Error fetching fixtures:', error);
      return NextResponse.json(
        { 
          error: 'Failed to fetch fixtures from API',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    if (fixtures.length === 0) {
      return NextResponse.json(
        { 
          fixtures: [],
          total: 0,
          leagues: [],
          message: 'No fixtures found for the specified criteria'
        },
        { status: 200 }
      );
    }

    // Transform fixtures
    const transformedFixtures = fixtures.map(transformFixture);

    // Sort by date/time
    transformedFixtures.sort((a, b) => a.timestamp - b.timestamp);

    // Get unique leagues for filter options
    const leagues = [...new Set(transformedFixtures.map(f => f.league.name))];

    console.log(`Returning ${transformedFixtures.length} fixtures`);
    console.log(`Available leagues: ${leagues.join(', ')}`);

    return NextResponse.json({
      fixtures: transformedFixtures,
      total: transformedFixtures.length,
      leagues: leagues.sort(),
      debug: {
        totalFetched: fixtures.length,
        apiUsed: 'API-Football',
        parameters: { date, league, team, live, next, last, status }
      }
    });

  } catch (error) {
    console.error('Fixtures API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}