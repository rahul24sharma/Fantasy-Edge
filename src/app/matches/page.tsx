'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  Activity,
  Zap,
  AlertCircle,
  RefreshCw,
  Loader2,
  Play,
  Pause,
  Filter,
  Globe,
  Target,
  TrendingUp,
  Eye,
  Star,
  Gamepad2
} from 'lucide-react';

interface Fixture {
  id: number;
  referee?: string;
  timezone: string;
  date: string;
  timestamp: number;
  periods: {
    first?: number;
    second?: number;
  };
  venue: {
    id?: number;
    name: string;
    city: string;
  };
  status: {
    long: string;
    short: string;
    elapsed?: number;
    extra?: number;
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner?: boolean;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner?: boolean;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
}

export default function MatchesPage() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [filteredFixtures, setFilteredFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('2025-06-16'); // Fixed date to prevent hydration issues
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [leagues, setLeagues] = useState<string[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch fixtures from API
  const fetchFixtures = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching fixtures for date:', selectedDate);
      
      let url = `/api/fixtures?date=${selectedDate}`;
      if (selectedLeague !== 'all') {
        url += `&league=${selectedLeague}`;
      }
      if (showLiveOnly) {
        url = `/api/fixtures?live=all`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fixtures data received:', data);
      
      setFixtures(data.fixtures || []);
      setFilteredFixtures(data.fixtures || []);
      setLeagues(data.leagues || []);
      
    } catch (err) {
      console.error('Error fetching fixtures:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch fixtures');
    } finally {
      setLoading(false);
    }
  };

  // Set today's date after component mounts to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Initial fetch
  useEffect(() => {
    if (mounted) {
      fetchFixtures();
    }
  }, [selectedDate, selectedLeague, showLiveOnly, mounted]);

  // Auto-refresh for live matches
  useEffect(() => {
    if (autoRefresh && showLiveOnly) {
      refreshIntervalRef.current = setInterval(() => {
        fetchFixtures();
      }, 60000); // Refresh every minute for live matches
    } else if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [autoRefresh, showLiveOnly]);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Filter fixtures
  useEffect(() => {
    let filtered = fixtures;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(fixture =>
        fixture.teams.home.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fixture.teams.away.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fixture.league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fixture.venue.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(fixture => fixture.status.short === selectedStatus);
    }

    setFilteredFixtures(filtered);
  }, [searchQuery, selectedStatus, fixtures]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NS': return 'from-blue-500 to-cyan-500';
      case '1H': case '2H': case 'HT': case 'ET': case 'LIVE': return 'from-green-500 to-emerald-500';
      case 'FT': case 'AET': case 'PEN': return 'from-gray-500 to-slate-500';
      case 'PST': case 'CANC': case 'ABD': return 'from-red-500 to-pink-500';
      case 'SUSP': case 'INT': return 'from-yellow-500 to-orange-500';
      default: return 'from-purple-500 to-indigo-500';
    }
  };

  const getStatusText = (fixture: Fixture) => {
    const status = fixture.status;
    switch (status.short) {
      case 'NS': return 'Not Started';
      case '1H': return `${status.elapsed}'`;
      case 'HT': return 'Half Time';
      case '2H': return `${status.elapsed}'`;
      case 'ET': return `ET ${status.elapsed}'`;
      case 'FT': return 'Full Time';
      case 'AET': return 'After ET';
      case 'PEN': return 'Penalties';
      case 'PST': return 'Postponed';
      case 'CANC': return 'Cancelled';
      case 'ABD': return 'Abandoned';
      case 'SUSP': return 'Suspended';
      case 'LIVE': return 'Live';
      default: return status.long;
    }
  };

  const isLiveMatch = (status: string) => {
    return ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE'].includes(status);
  };

  const formatDateTime = (dateString: string) => {
    if (!mounted) {
      return { date: '', time: '' }; // Prevent hydration mismatch
    }
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Loading Matches</h2>
          <p className="text-white/70">Fetching latest fixture data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Matches</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={fetchFixtures}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-300"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden pt-20 md:pt-24">
      {/* Animated Background Effects */}
      <div className="absolute inset-0">
        {/* Matrix-like grid lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-slide-right"></div>
          <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-slide-right delay-1000"></div>
          <div className="absolute top-40 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-slide-right delay-2000"></div>
          <div className="absolute top-60 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-slide-right delay-3000"></div>
        </div>
        
        {/* Subtle floating particles */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-1 h-1 bg-green-400 rounded-full animate-float-1"></div>
          <div className="absolute top-32 right-20 w-1 h-1 bg-blue-400 rounded-full animate-float-2"></div>
          <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-green-400 rounded-full animate-float-3"></div>
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-float-1"></div>
          <div className="absolute bottom-40 right-10 w-1 h-1 bg-green-400 rounded-full animate-float-2"></div>
        </div>
        
        {/* Subtle scan lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-scan"></div>
        </div>
        
        {/* Very subtle cursor glow - much reduced */}
        <div
          className="absolute w-32 h-32 bg-green-400/2 rounded-full blur-2xl pointer-events-none transition-all duration-500"
          style={{
            transform: `translate(${mousePosition.x - 64}px, ${mousePosition.y - 64}px)`,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-6 border border-white/20">
            <Gamepad2 className="w-5 h-5 text-green-400" />
            <span className="text-white/90 font-medium">Live Football Matches</span>
            {autoRefresh && showLiveOnly && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-green-200 to-blue-200 bg-clip-text text-transparent">
            Match Center
          </h1>
          
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Live scores, fixtures, and match details from top football leagues
          </p>
        </div>

        {/* Controls Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search teams, leagues, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-green-400 focus:bg-white/15 transition-all duration-300"
              />
            </div>

            {/* Date Picker */}
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-green-400 transition-all duration-300"
              />
            </div>

            {/* League Filter */}
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-green-400 transition-all duration-300"
            >
              <option value="all">All Leagues</option>
              <option value="39">Premier League</option>
              <option value="140">La Liga</option>
              <option value="78">Bundesliga</option>
              <option value="135">Serie A</option>
              <option value="61">Ligue 1</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-green-400 transition-all duration-300"
            >
              <option value="all">All Status</option>
              <option value="NS">Not Started</option>
              <option value="LIVE">Live</option>
              <option value="1H">1st Half</option>
              <option value="HT">Half Time</option>
              <option value="2H">2nd Half</option>
              <option value="FT">Finished</option>
            </select>

            {/* Live Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowLiveOnly(!showLiveOnly)}
                className={`px-6 py-4 rounded-2xl transition-all duration-300 ${
                  showLiveOnly 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  <span>Live Only</span>
                </div>
              </button>

              <button
                onClick={fetchFixtures}
                className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
            <div className="text-white/70">
              Showing <span className="text-white font-bold">{filteredFixtures.length}</span> matches
              {selectedDate && !showLiveOnly && mounted && (
                <span> for <span className="text-green-300">{new Date(selectedDate).toLocaleDateString()}</span></span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-white/70 text-sm">Updates every 15s</span>
            </div>
          </div>
        </div>

        {/* Matches Grid */}
        {filteredFixtures.length > 0 ? (
          <div className="grid gap-6">
            {filteredFixtures.map((fixture, index) => (
              <MatchCard
                key={fixture.id}
                fixture={fixture}
                index={index}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
                isLiveMatch={isLiveMatch}
                formatDateTime={formatDateTime}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Target className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Matches Found</h3>
            <p className="text-white/70 mb-6">
              {showLiveOnly 
                ? "No live matches at the moment" 
                : "No matches found for the selected criteria"
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('all');
                setShowLiveOnly(false);
              }}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-right {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw);
            opacity: 0;
          }
        }
        
        @keyframes float-1 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          33% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.7;
          }
          66% {
            transform: translateY(10px) translateX(-5px);
            opacity: 0.4;
          }
        }
        
        @keyframes float-2 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-15px) translateX(-10px);
            opacity: 0.8;
          }
        }
        
        @keyframes float-3 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.2;
          }
          25% {
            transform: translateY(-10px) translateX(15px);
            opacity: 0.6;
          }
          75% {
            transform: translateY(5px) translateX(-8px);
            opacity: 0.5;
          }
        }
        
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }
        
        .animate-slide-right {
          animation: slide-right 8s linear infinite;
        }
        
        .animate-float-1 {
          animation: float-1 6s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float-2 8s ease-in-out infinite;
        }
        
        .animate-float-3 {
          animation: float-3 7s ease-in-out infinite;
        }
        
        .animate-scan {
          animation: scan 10s linear infinite;
        }
        
        .match-card-animate {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .match-card-animate-0 { animation-delay: 0s; }
        .match-card-animate-1 { animation-delay: 0.1s; }
        .match-card-animate-2 { animation-delay: 0.2s; }
        .match-card-animate-3 { animation-delay: 0.3s; }
        .match-card-animate-4 { animation-delay: 0.4s; }
        .match-card-animate-5 { animation-delay: 0.5s; }
        .match-card-animate-6 { animation-delay: 0.6s; }
        .match-card-animate-7 { animation-delay: 0.7s; }
        .match-card-animate-8 { animation-delay: 0.8s; }
        .match-card-animate-9 { animation-delay: 0.9s; }
        .match-card-animate-10 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}

interface MatchCardProps {
  fixture: Fixture;
  index: number;
  getStatusColor: (status: string) => string;
  getStatusText: (fixture: Fixture) => string;
  isLiveMatch: (status: string) => boolean;
  formatDateTime: (dateString: string) => { date: string; time: string };
}

function MatchCard({ fixture, index, getStatusColor, getStatusText, isLiveMatch, formatDateTime }: MatchCardProps) {
  const datetime = formatDateTime(fixture.date);
  const isLive = isLiveMatch(fixture.status.short);

  return (
    <div className={`group bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl match-card-animate match-card-animate-${Math.min(index, 10)}`}>
      {/* Match Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img
            src={fixture.league.logo}
            alt={fixture.league.name}
            className="w-8 h-8 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div>
            <h3 className="text-white font-bold">{fixture.league.name}</h3>
            <p className="text-white/60 text-sm">{fixture.league.round}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 bg-gradient-to-r ${getStatusColor(fixture.status.short)} text-white text-sm font-bold rounded-full ${isLive ? 'animate-pulse' : ''}`}>
            {getStatusText(fixture)}
          </span>
          {isLive && (
            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
          )}
        </div>
      </div>

      {/* Teams and Score */}
      <div className="flex items-center justify-between mb-6">
        {/* Home Team */}
        <div className="flex items-center gap-4 flex-1">
          <img
            src={fixture.teams.home.logo}
            alt={fixture.teams.home.name}
            className="w-12 h-12 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div>
            <h4 className={`text-lg font-bold ${fixture.teams.home.winner ? 'text-green-300' : 'text-white'}`}>
              {fixture.teams.home.name}
            </h4>
          </div>
        </div>

        {/* Score */}
        <div className="text-center px-6">
          {fixture.status.short === 'NS' ? (
            <div className="text-white/70">
              <div className="text-sm">{datetime.time}</div>
              <div className="text-xs">{datetime.date}</div>
            </div>
          ) : (
            <div className="text-3xl font-black text-white">
              <span className={fixture.teams.home.winner ? 'text-green-300' : ''}>
                {fixture.goals.home ?? 0}
              </span>
              <span className="text-white/50 mx-2">-</span>
              <span className={fixture.teams.away.winner ? 'text-green-300' : ''}>
                {fixture.goals.away ?? 0}
              </span>
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="text-right">
            <h4 className={`text-lg font-bold ${fixture.teams.away.winner ? 'text-green-300' : 'text-white'}`}>
              {fixture.teams.away.name}
            </h4>
          </div>
          <img
            src={fixture.teams.away.logo}
            alt={fixture.teams.away.name}
            className="w-12 h-12 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Match Info */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-4 text-white/60 text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{fixture.venue.name}, {fixture.venue.city}</span>
          </div>
          {fixture.referee && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{fixture.referee}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Clock className="w-4 h-4" />
          <span>{datetime.time}</span>
        </div>
      </div>

      {/* Score Details for Finished Matches */}
      {fixture.status.short === 'FT' && (fixture.score.halftime.home !== null || fixture.score.penalty.home !== null) && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between text-white/60 text-sm">
            {fixture.score.halftime.home !== null && (
              <span>HT: {fixture.score.halftime.home} - {fixture.score.halftime.away}</span>
            )}
            {fixture.score.penalty.home !== null && (
              <span>Pens: {fixture.score.penalty.home} - {fixture.score.penalty.away}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}