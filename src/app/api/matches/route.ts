// app/api/matches/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://api.football-data.org/v4';
const API_KEY = "8bba67bee162456589814afddce138db";

// Helper function to validate and adjust date ranges
function validateDateRange(fromDate: string, toDate: string) {
  try {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    
    // Check if dates are valid
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      throw new Error('Invalid date format provided');
    }
    
    // Ensure fromDate is not after toDate
    if (from > to) {
      return {
        fromDate: toDate,
        toDate: fromDate,
        adjusted: true,
        originalDays: 0,
        warning: 'Date range was reversed (fromDate was after toDate)'
      };
    }
    
    const daysDiff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
    
    // Football-data.org API limit: max 10 days
    if (daysDiff > 10) {
      const adjustedTo = new Date(from);
      adjustedTo.setDate(from.getDate() + 10);
      return {
        fromDate: fromDate,
        toDate: adjustedTo.toISOString().split('T')[0],
        adjusted: true,
        originalDays: daysDiff,
        warning: `Date range reduced from ${daysDiff} days to 10 days (API limit)`
      };
    }
    
    // If date range is 0 (same day), extend to at least 1 day
    if (daysDiff === 0) {
      const adjustedTo = new Date(from);
      adjustedTo.setDate(from.getDate() + 1);
      return {
        fromDate: fromDate,
        toDate: adjustedTo.toISOString().split('T')[0],
        adjusted: true,
        originalDays: 0,
        warning: 'Extended single day to 1-day range for better results'
      };
    }
    
    return {
      fromDate,
      toDate,
      adjusted: false,
      originalDays: daysDiff,
      warning: null
    };
    
  } catch (error) {
    // Return a safe default range if validation fails
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    return {
      fromDate: today.toISOString().split('T')[0],
      toDate: nextWeek.toISOString().split('T')[0],
      adjusted: true,
      originalDays: -1,
      warning: `Date validation failed, using default range: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const status = searchParams.get('status');
    const competitionId = searchParams.get('competitionId');
    
    console.log('=== API Route Debug ===');
    console.log('Received params:', { dateFrom, dateTo, status, competitionId });
    
    // Build Football Data API URL - following documentation exactly
    const params = new URLSearchParams();
    
    // According to docs, if no parameters are provided, it returns today's matches
    // Let's handle different scenarios:
    
    if (status === 'SCHEDULED') {
      // For scheduled matches, we need a future date range
      const today = new Date();
      const startDate = dateFrom ? new Date(dateFrom) : today;
      
      // Set end date to 7 days from start (well within 10-day limit)
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 7);
      
      const fromDateStr = startDate.toISOString().split('T')[0];
      const toDateStr = endDate.toISOString().split('T')[0];
      
      params.append('dateFrom', fromDateStr);
      params.append('dateTo', toDateStr);
      params.append('status', 'SCHEDULED');
      
      console.log('Scheduled matches setup:', { fromDateStr, toDateStr });
      
    } else if (dateFrom || dateTo) {
      // Handle explicit date ranges
      if (dateFrom) {
        params.append('dateFrom', new Date(dateFrom).toISOString().split('T')[0]);
      }
      if (dateTo) {
        params.append('dateTo', new Date(dateTo).toISOString().split('T')[0]);
      }
      if (status) {
        params.append('status', status.toUpperCase());
      }
      
    } else if (status) {
      // Handle status-only queries
      params.append('status', status.toUpperCase());
      
    } else {
      // No parameters - let API return default (today's matches)
      console.log('No parameters provided - using API default (today\'s matches)');
    }
    
    // Add competition filter if provided
    if (competitionId) {
      params.append('competitions', competitionId);
    }
    
    const footballApiUrl = `${BASE_URL}/matches${params.toString() ? `?${params.toString()}` : ''}`;
    
    console.log('Final Football API URL:', footballApiUrl);
    
    // Make request to Football Data API
    const response = await fetch(footballApiUrl, {
      headers: {
        'X-Auth-Token': API_KEY,
      },
      next: { revalidate: 30 }, // Shorter cache for more up-to-date data
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Football API error (${response.status}): ${errorText}`);
      
      return NextResponse.json(
        { 
          error: `Football API error: ${response.status}`,
          details: errorText,
          url: footballApiUrl,
          params: Object.fromEntries(params)
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    let matches = data.matches || [];
    
    console.log(`Football API returned ${matches.length} raw matches`);
    
    // Log some sample matches for debugging
    if (matches.length > 0) {
      console.log('Sample matches:', matches.slice(0, 2).map((m: any) => ({
        id: m.id,
        homeTeam: m.homeTeam.name,
        awayTeam: m.awayTeam.name,
        status: m.status,
        utcDate: m.utcDate,
        competition: m.competition.name
      })));
    } else {
      console.log('No matches returned from Football API');
      console.log('Response structure:', Object.keys(data));
    }
    
    console.log(`Final result: ${matches.length} matches`);
    console.log('=== End Debug ===');
    
    return NextResponse.json({ 
      matches,
      debug: {
        originalCount: data.matches?.length || 0,
        filteredCount: matches.length,
        params: Object.fromEntries(params),
        url: footballApiUrl,
        responseKeys: Object.keys(data)
      }
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch matches',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}