// src/hooks/useFootballData.ts
import { useState, useEffect } from 'react';
// import { Competition, Match, Team, Standing } from '@/types/football';
import { Competition, Match, Team, Standing} from '@/lib/types/football';

export function useCompetitions(areas?: string) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        setLoading(true);
        const params = areas ? `?areas=${areas}` : '';
        const response = await fetch(`/api/competitions${params}`);
        
        if (!response.ok) throw new Error('Failed to fetch competitions');
        
        const data = await response.json();
        setCompetitions(data.competitions || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchCompetitions();
  }, [areas]);

  return { competitions, loading, error };
}

// export function useMatches(filters?: {
//   competitions?: string;
//   dateFrom?: string;
//   dateTo?: string;
//   status?: string;
// }) {
//   const [matches, setMatches] = useState<Match[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchMatches() {
//       try {
//         setLoading(true);
//         const params = new URLSearchParams();
        
//         if (filters) {
//           Object.entries(filters).forEach(([key, value]) => {
//             if (value) params.append(key, value);
//           });
//         }

//         const response = await fetch(`/api/matches?${params.toString()}`);
        
//         if (!response.ok) throw new Error('Failed to fetch matches');
        
//         const data = await response.json();
//         setMatches(data.matches || []);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Unknown error');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchMatches();
//   }, [filters]);

//   return { matches, loading, error };
// }

export function useMatches(filters?: {
  competitions?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
}) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchMatches() {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        
        if (filters) {
          // Add default dateTo for scheduled matches
          if (filters.status === 'SCHEDULED' && filters.dateFrom && !filters.dateTo) {
            const dateFrom = new Date(filters.dateFrom);
            dateFrom.setDate(dateFrom.getDate() + 7);
            filters.dateTo = dateFrom.toISOString().split('T')[0];
          }

          Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
          });
        }

        const response = await fetch(`/api/matches?${params.toString()}`, {
          signal: abortController.signal
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch matches');
        }
        
        const data = await response.json();
        setMatches(data.matches || []);
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchMatches();

    return () => {
      abortController.abort();
    };
  }, [JSON.stringify(filters)]); // Deep comparison

  return { matches, loading, error };
}

export function useStandings(competitionId: string, filters?: {
  matchday?: string;
  season?: string;
  date?: string;
}) {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStandings() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
          });
        }

        const response = await fetch(
          `/api/competitions/${competitionId}/standings?${params.toString()}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch standings');
        
        const data = await response.json();
        setStandings(data.standings || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (competitionId) {
      fetchStandings();
    }
  }, [competitionId, filters]);

  return { standings, loading, error };
}