// app/api/standings/route.ts
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
      next: { revalidate: 1800 } // Cache for 30 minutes
    });
    
    console.log(`API Response Status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error Response: ${errorText}`);
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`API Response: ${data.results} standings found`);
    
    return data;
    
  } catch (error) {
    console.error(`API call error:`, error);
    throw error;
  }
}

// Transform standings data
function transformStanding(standingData: any) {
  return {
    rank: standingData.rank,
    team: {
      id: standingData.team.id,
      name: standingData.team.name,
      logo: standingData.team.logo
    },
    points: standingData.points,
    goalsDiff: standingData.goalsDiff,
    group: standingData.group,
    form: standingData.form,
    status: standingData.status,
    description: standingData.description,
    all: {
      played: standingData.all.played,
      win: standingData.all.win,
      draw: standingData.all.draw,
      lose: standingData.all.lose,
      goals: {
        for: standingData.all.goals.for,
        against: standingData.all.goals.against
      }
    },
    home: {
      played: standingData.home.played,
      win: standingData.home.win,
      draw: standingData.home.draw,
      lose: standingData.home.lose,
      goals: {
        for: standingData.home.goals.for,
        against: standingData.home.goals.against
      }
    },
    away: {
      played: standingData.away.played,
      win: standingData.away.win,
      draw: standingData.away.draw,
      lose: standingData.away.lose,
      goals: {
        for: standingData.away.goals.for,
        against: standingData.away.goals.against
      }
    },
    update: standingData.update
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get('league') || '39'; // Default to Premier League
    const season = searchParams.get('season') || '2023'; // Use 2023 for free plan

    console.log('=== Standings API ===');
    console.log('Parameters:', { league, season });

    let standings: any[] = [];
    
    try {
      const data = await callAPI('standings', {
        league,
        season
      });
      
      if (data.response && data.response.length > 0) {
        // Get the league standings (usually the first response)
        const leagueStandings = data.response[0];
        standings = leagueStandings.league.standings[0] || [];
        
        // Transform the standings data
        standings = standings.map(transformStanding);
      }
      
    } catch (error) {
      console.error('Error fetching standings:', error);
      return NextResponse.json(
        { 
          error: 'Failed to fetch standings from API',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    if (standings.length === 0) {
      return NextResponse.json(
        { 
          standings: [],
          total: 0,
          message: 'No standings found for the specified league and season'
        },
        { status: 200 }
      );
    }

    console.log(`Returning ${standings.length} standings`);

    return NextResponse.json({
      standings,
      total: standings.length,
      league: {
        id: league,
        season: season
      },
      debug: {
        totalFetched: standings.length,
        apiUsed: 'API-Football'
      }
    });

  } catch (error) {
    console.error('Standings API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}