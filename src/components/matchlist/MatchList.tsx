'use client';

import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Trophy,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Activity,
  Zap,
  Target,
  Users,
} from 'lucide-react';

// Define the Match interface
interface Match {
  id: number;
  utcDate: string;
  status: 'LIVE' | 'FINISHED' | 'SCHEDULED' | 'IN_PLAY' | 'PAUSED' | 'TIMED';
  homeTeam: {
    id: number;
    name: string;
    shortName?: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName?: string;
    crest: string;
  };
  score?: {
    fullTime?: {
      home: number | null;
      away: number | null;
    };
    halfTime?: {
      home: number | null;
      away: number | null;
    };
  };
  competition: {
    id: number;
    name: string;
    code: string;
    emblem: string;
  };
  matchday?: number;
  stage?: string;
}

interface MatchesListProps {
  competitionId?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: 'LIVE' | 'FINISHED' | 'SCHEDULED' | 'IN_PLAY' | 'PAUSED' | 'TIMED';
}

// Updated API function to use Next.js API route
async function getMatches(
  dateFrom?: string, 
  dateTo?: string, 
  status?: string, 
  competitionId?: string
): Promise<Match[]> {
  try {
    const params = new URLSearchParams();
    
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    if (status) params.append('status', status);
    if (competitionId) params.append('competitionId', competitionId);
    
    const apiUrl = `/api/matches${params.toString() ? `?${params.toString()}` : ''}`;
    console.log('Calling Next.js API route:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        url: apiUrl
      });
      throw new Error(
        errorData.error || 
        errorData.details || 
        `HTTP ${response.status}: ${response.statusText}`
      );
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    return data.matches || [];
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

export function MatchesList({ competitionId, dateFrom, dateTo, status }: MatchesListProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching matches with params:', { competitionId, dateFrom, dateTo, status });
        
        let matchesData = await getMatches(dateFrom, dateTo, status, competitionId);
        
        console.log('Matches data received:', matchesData);
        setMatches(matchesData);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [competitionId, dateFrom, dateTo, status]);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 animate-pulse">
            <div className="flex justify-between items-center mb-4">
              <div className="h-4 bg-white/20 rounded w-32"></div>
              <div className="h-4 bg-white/20 rounded w-24"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                <div className="h-4 bg-white/20 rounded w-24"></div>
              </div>
              <div className="h-6 bg-white/20 rounded w-16"></div>
              <div className="flex items-center gap-3">
                <div className="h-4 bg-white/20 rounded w-24"></div>
                <div className="w-8 h-8 bg-white/20 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 backdrop-blur-xl rounded-2xl p-8 border border-red-500/20 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-200 mb-2">Error Loading Matches</h3>
        <p className="text-red-300 mb-4">{error}</p>
        <div className="text-red-300/70 text-sm mb-4">
          Params: {JSON.stringify({ dateFrom, dateTo, status, competitionId }, null, 2)}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-12 border border-white/20 text-center">
        <Target className="w-16 h-16 text-white/40 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">No Matches Found</h3>
        <p className="text-white/70">
          {status === 'LIVE' || status === 'IN_PLAY' 
            ? 'No live matches at the moment' 
            : 'No matches found for the selected criteria'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
          {status === 'LIVE' || status === 'IN_PLAY' ? (
            <Activity className="w-6 h-6 text-white" />
          ) : status === 'FINISHED' ? (
            <Trophy className="w-6 h-6 text-white" />
          ) : (
            <Calendar className="w-6 h-6 text-white" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">
            {status === 'LIVE' || status === 'IN_PLAY' 
              ? 'Live Football' 
              : status === 'FINISHED'
              ? 'Recent Results'
              : 'Upcoming Matches'}
          </h2>
          <p className="text-white/70">{matches.length} matches found</p>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="space-y-4">
        {matches.map((match, index) => (
          <MatchCard 
            key={match.id} 
            match={match} 
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

// Helper function for status info - moved outside component
function getStatusInfo(status: string) {
  switch (status) {
    case 'LIVE':
    case 'IN_PLAY':
      return { icon: Activity, text: 'Live', color: 'text-green-400', bg: 'bg-green-500/20', pulse: true };
    case 'PAUSED':
      return { icon: Pause, text: 'Paused', color: 'text-yellow-400', bg: 'bg-yellow-500/20', pulse: false };
    case 'FINISHED':
      return { icon: CheckCircle, text: 'Finished', color: 'text-blue-400', bg: 'bg-blue-500/20', pulse: false };
    case 'SCHEDULED':
    case 'TIMED':
      return { icon: Clock, text: 'Scheduled', color: 'text-purple-400', bg: 'bg-purple-500/20', pulse: false };
    default:
      return { icon: Clock, text: status, color: 'text-gray-400', bg: 'bg-gray-500/20', pulse: false };
  }
}

function MatchCard({ match, index }: { match: Match; index: number }) {
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  const matchDate = new Date(match.utcDate);
  const statusInfo = getStatusInfo(match.status);
  const StatusIcon = statusInfo.icon;

  const handleImageError = (teamId: number) => {
    setImageErrors(prev => ({ ...prev, [teamId]: true }));
  };

  return (
    <div 
      className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl animate-fadeInUp opacity-0"
      style={{
        animationDelay: `${index * 0.1}s`,
        animationDuration: '0.6s',
        animationFillMode: 'forwards',
        animationTimingFunction: 'ease-out'
      }}
    >
      {/* Match Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <img 
            src={match.competition.emblem} 
            alt={match.competition.name}
            className="w-6 h-6 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="text-white/80 font-medium">{match.competition.name}</span>
          {match.matchday && (
            <span className="text-white/60 text-sm">MD {match.matchday}</span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusInfo.bg} border border-white/20`}>
            <StatusIcon className={`w-4 h-4 ${statusInfo.color} ${statusInfo.pulse ? 'animate-pulse' : ''}`} />
            <span className={`text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>
          <span className="text-white/60 text-sm">
            {matchDate.toLocaleDateString()} {matchDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        </div>
      </div>
      
      {/* Teams and Score */}
      <div className="flex items-center justify-between">
        {/* Home Team */}
        <div className="flex items-center gap-4 flex-1 group-hover:scale-105 transition-transform duration-300">
          <div className="relative">
            {!imageErrors[match.homeTeam.id] ? (
              <img 
                src={match.homeTeam.crest} 
                alt={match.homeTeam.name} 
                className="w-12 h-12 object-contain rounded-lg border border-white/20 bg-white/10 p-1 hover:rotate-3 transition-transform duration-300" 
                onError={() => handleImageError(match.homeTeam.id)}
              />
            ) : (
              <div className="w-12 h-12 bg-white/10 rounded-lg border border-white/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-white/40" />
              </div>
            )}
          </div>
          <div>
            <div className="font-bold text-white text-lg group-hover:text-blue-200 transition-colors duration-300">
              {match.homeTeam.shortName || match.homeTeam.name}
            </div>
            <div className="text-white/60 text-sm">Home</div>
          </div>
        </div>
        
        {/* Score */}
        <div className="text-center min-w-[120px] mx-8">
          {match.status === 'FINISHED' || match.status === 'IN_PLAY' || match.status === 'PAUSED' || match.status === 'LIVE' ? (
            <div className="space-y-2">
              <div className="text-3xl font-black text-white">
                {match.score?.fullTime?.home ?? '-'} - {match.score?.fullTime?.away ?? '-'}
              </div>
              {match.score?.halfTime && (match.score.halfTime.home !== null || match.score.halfTime.away !== null) && (
                <div className="text-sm text-white/60">
                  HT: {match.score.halfTime.home ?? 0} - {match.score.halfTime.away ?? 0}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="text-2xl font-bold text-white/60 mb-1">VS</div>
              <div className="text-xs text-white/40">
                {matchDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          )}
        </div>
        
        {/* Away Team */}
        <div className="flex items-center gap-4 flex-1 justify-end group-hover:scale-105 transition-transform duration-300">
          <div className="text-right">
            <div className="font-bold text-white text-lg group-hover:text-blue-200 transition-colors duration-300">
              {match.awayTeam.shortName || match.awayTeam.name}
            </div>
            <div className="text-white/60 text-sm">Away</div>
          </div>
          <div className="relative">
            {!imageErrors[match.awayTeam.id] ? (
              <img 
                src={match.awayTeam.crest} 
                alt={match.awayTeam.name} 
                className="w-12 h-12 object-contain rounded-lg border border-white/20 bg-white/10 p-1 hover:rotate-3 transition-transform duration-300"
                onError={() => handleImageError(match.awayTeam.id)}
              />
            ) : (
              <div className="w-12 h-12 bg-white/10 rounded-lg border border-white/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-white/40" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Live Indicator */}
      {(match.status === 'IN_PLAY' || match.status === 'LIVE') && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-bold text-sm">LIVE MATCH</span>
            <Zap className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
}