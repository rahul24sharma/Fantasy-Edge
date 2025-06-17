// src/app/api/areas/route.ts

import { NextResponse } from 'next/server';

const API_KEY = "8bba67bee162456589814afddce138db";
const BASE_URL = 'https://api.football-data.org/v4';

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/areas`, {
      headers: {
        'X-Auth-Token': API_KEY
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch areas: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}