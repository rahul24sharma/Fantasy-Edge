import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://api.football-data.org/v4';
const API_KEY = "8bba67bee162456589814afddce138db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const response = await fetch(`${BASE_URL}/competitions/${id}`, {
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
    return NextResponse.json(data);
  } catch (error) {
    console.error('Competition details API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch competition details' },
      { status: 500 }
    );
  }
}

// export async function getStandings(id: string) {
//   try {
//     const response = await fetch(`${BASE_URL}/competitions/${id}/standings`, {
//       headers: {
//         'X-Auth-Token': API_KEY,
//       },
//       next: { revalidate: 300 }, // Cache for 5 minutes
//     });

//     if (!response.ok) {
//       return null;
//     }

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Standings API error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch standings' },
//       { status: 500 }
//     );
//   }
// }