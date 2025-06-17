// src/app/api/competitions/[id]/standings/route.ts
import { NextRequest, NextResponse } from 'next/server';
// import { footballApi } from '@/lib/football-api';
import { footballApi } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      matchday: searchParams.get('matchday'),
      season: searchParams.get('season'),
      date: searchParams.get('date'),
    };

    const standings = await footballApi.getCompetitionStandings(params.id, filters);
    return NextResponse.json(standings);
  } catch (error) {
    console.error('Error fetching standings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch standings' },
      { status: 500 }
    );
  }
}