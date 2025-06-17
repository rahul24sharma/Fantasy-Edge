// src/app/api/competitions/[id]/standings/route.ts
import { NextRequest, NextResponse } from 'next/server';
// import { footballApi } from '@/lib/football-api';
import { footballApi } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Changed: await params and destructure
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      matchday: searchParams.get('matchday') || undefined,
      season: searchParams.get('season') || undefined,
      date: searchParams.get('date') || undefined,
    };

    const standings = await footballApi.getCompetitionStandings(id, filters);
    return NextResponse.json(standings);
  } catch (error) {
    console.error('Error fetching standings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch standings' },
      { status: 500 }
    );
  }
}