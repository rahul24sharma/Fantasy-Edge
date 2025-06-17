// components/UpcomingMatches.js
import { useState, useEffect } from 'react';
import { footballApi } from '@/app/api/footballData/footballdata';
import Link from 'next/link';

export default function UpcomingMatches({ competitionId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        
        const data = await footballApi.getCompetitionMatches(competitionId, {
          dateFrom: today.toISOString().split('T')[0],
          dateTo: nextWeek.toISOString().split('T')[0],
          status: 'SCHEDULED'
        });
        console.log('Upcoming Matches Data:', data);
        setMatches(data.matches);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [competitionId]);

  if (loading) return <div>Loading upcoming matches...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="matches-container">
      <h2>Upcoming Matches</h2>
      <ul>
        {matches.map((match) => (
          <li key={match.id}>
            <Link href={`/matches/${match.id}`}>
              <a>
                {match.homeTeam.name} vs {match.awayTeam.name} - {new Date(match.utcDate).toLocaleDateString()}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}