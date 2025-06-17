// // src/app/api/competitions/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// // import { footballApi } from '@/lib/football-api';
// import { footballApi } from '@/lib/api';

// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams;
//     const areas = searchParams.get('areas');
    
//     const competitions = await footballApi.getCompetitions(areas || undefined);
    
//     return NextResponse.json(competitions);
//   } catch (error) {
//     console.error('Error fetching competitions:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch competitions' },
//       { status: 500 }
//     );
//   }
// }
// app/api/competitions/route.ts
import { NextResponse } from 'next/server';

const BASE_URL = 'https://api.football-data.org/v4';
const API_KEY = "8bba67bee162456589814afddce138db";

export async function GET() {
  try {
    const response = await fetch(`${BASE_URL}/competitions?plan=TIER_ONE`, {
      headers: {
        'X-Auth-Token': API_KEY,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Football API error (${response.status}): ${errorText}`);
      return NextResponse.json(
        { error: `Football API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ competitions: data.competitions || [] });
  } catch (error) {
    console.error('Competitions API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch competitions' },
      { status: 500 }
    );
  }
}