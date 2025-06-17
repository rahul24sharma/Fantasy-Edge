// components/UpcomingMatches.tsx
import { useState, useEffect } from 'react';
import { footballApi } from '@/lib/api';
import Link from 'next/link';

// Define types for better TypeScript support
interface Match {
  id: number;
  utcDate: string;
  homeTeam: {
    id: number;
    name: string;
    shortName?: string;
    crest?: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName?: string;
    crest?: string;
  };
  status: string;
  score?: {
    fullTime?: {
      home: number | null;
      away: number | null;
    };
  };
}

interface UpcomingMatchesProps {
  competitionId: string | number;
}

export default function UpcomingMatches({ competitionId }: UpcomingMatchesProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        
        const data = await footballApi.getCompetitionMatches(competitionId.toString(), {
          dateFrom: today.toISOString().split('T')[0],
          dateTo: nextWeek.toISOString().split('T')[0],
          status: 'SCHEDULED'
        });
        console.log('Upcoming Matches Data:', data);
        setMatches(data.matches || []);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch matches');
      } finally {
        setLoading(false);
      }
    };

    if (competitionId) {
      fetchMatches();
    }
  }, [competitionId]);

  if (loading) {
    return (
      <div className="matches-container p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4 w-48"></div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="matches-container p-4">
        <div className="text-red-600 bg-red-50 border border-red-200 rounded p-3">
          <h3 className="font-semibold">Error loading matches</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="matches-container p-4">
        <h2 className="text-xl font-bold mb-4">Upcoming Matches</h2>
        <p className="text-gray-500">No upcoming matches found</p>
      </div>
    );
  }

  return (
    <div className="matches-container p-4">
      <h2 className="text-xl font-bold mb-4">Upcoming Matches</h2>
      <div className="space-y-3">
        {matches.map((match) => (
          <div key={match.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
            <Link href={`/matches/${match.id}`} className="block">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="font-medium">
                    {match.homeTeam.shortName || match.homeTeam.name} 
                    <span className="mx-2 text-gray-500">vs</span>
                    {match.awayTeam.shortName || match.awayTeam.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(match.utcDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="text-sm text-blue-600 hover:text-blue-800">
                  View Details →
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}