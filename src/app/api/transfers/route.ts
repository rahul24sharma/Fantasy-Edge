// app/api/transfers/route.ts
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

// Major team IDs to fetch transfers from
const MAJOR_TEAMS = [
  33,  // Manchester United
  40,  // Liverpool
  42,  // Arsenal
  49,  // Chelsea
  50,  // Manchester City
  47,  // Tottenham
  541, // Real Madrid
  529, // Barcelona
  85,  // Paris Saint Germain
  489  // AC Milan
];

// Helper function to make API calls
async function callAPI(endpoint: string, params: Record<string, any> = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_CONFIG.baseUrl}/${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    console.log(`Calling API: ${url}`);
    
    const response = await fetch(url, {
      headers: API_CONFIG.headers,
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    console.log(`API Response Status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error Response: ${errorText}`);
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`API Response: ${data.results || 0} transfers found`);
    
    return data;
    
  } catch (error) {
    console.error(`API call error:`, error);
    throw error;
  }
}

// Transform transfer data
function transformTransfer(transferData: any) {
  // Get the most recent transfer
  const latestTransfer = transferData.transfers?.[0];
  
  return {
    player: {
      id: transferData.player?.id,
      name: transferData.player?.name,
      photo: transferData.player?.photo
    },
    update: transferData.update,
    transfer: latestTransfer ? {
      date: latestTransfer.date,
      type: latestTransfer.type,
      teams: {
        in: {
          id: latestTransfer.teams?.in?.id,
          name: latestTransfer.teams?.in?.name,
          logo: latestTransfer.teams?.in?.logo
        },
        out: {
          id: latestTransfer.teams?.out?.id,
          name: latestTransfer.teams?.out?.name,
          logo: latestTransfer.teams?.out?.logo
        }
      }
    } : null
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const team = searchParams.get('team');
    const player = searchParams.get('player');

    console.log('=== Transfers API ===');
    console.log('Parameters:', { team, player });

    let allTransfers: any[] = [];
    
    try {
      if (team) {
        // Fetch transfers for specific team
        const data = await callAPI('transfers', { team });
        allTransfers = data.response || [];
      } else if (player) {
        // Fetch transfers for specific player
        const data = await callAPI('transfers', { player });
        allTransfers = data.response || [];
      } else {
        // Fetch recent transfers from major teams
        console.log('Fetching transfers from major teams...');
        
        for (const teamId of MAJOR_TEAMS.slice(0, 3)) { // Limit to 3 teams to avoid too many API calls
          try {
            console.log(`Fetching transfers for team ${teamId}...`);
            const data = await callAPI('transfers', { team: teamId });
            
            if (data.response && data.response.length > 0) {
              // Get recent transfers (last 6 months)
              const sixMonthsAgo = new Date();
              sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
              
              const recentTransfers = data.response.filter((transfer: any) => {
                const latestTransfer = transfer.transfers?.[0];
                if (!latestTransfer?.date) return false;
                
                const transferDate = new Date(latestTransfer.date);
                return transferDate >= sixMonthsAgo;
              });
              
              allTransfers.push(...recentTransfers);
            }
            
            // Add delay between requests to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 300));
            
          } catch (error) {
            console.warn(`Failed to fetch transfers for team ${teamId}:`, error);
          }
        }
      }

    } catch (error) {
      console.error('Error fetching transfers:', error);
      return NextResponse.json(
        { 
          error: 'Failed to fetch transfers from API',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    if (allTransfers.length === 0) {
      return NextResponse.json(
        { 
          transfers: [],
          total: 0,
          message: 'No recent transfers found'
        },
        { status: 200 }
      );
    }

    // Transform transfers
    const transformedTransfers = allTransfers
      .map(transformTransfer)
      .filter(transfer => transfer.transfer !== null) // Only include transfers with data
      .sort((a, b) => {
        // Sort by transfer date (most recent first)
        const dateA = new Date(a.transfer?.date || 0);
        const dateB = new Date(b.transfer?.date || 0);
        return dateB.getTime() - dateA.getTime();
      });

    // Limit results for dashboard
    const limitedTransfers = transformedTransfers.slice(0, 10);

    console.log(`Returning ${limitedTransfers.length} transfers`);

    return NextResponse.json({
      transfers: limitedTransfers,
      total: transformedTransfers.length,
      debug: {
        totalFetched: allTransfers.length,
        totalTransformed: transformedTransfers.length,
        apiUsed: 'API-Football Real Data'
      }
    });

  } catch (error) {
    console.error('Transfers API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}