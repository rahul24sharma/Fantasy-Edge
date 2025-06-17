// app/dashboard/teams/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Users,
  Trophy,
  MapPin,
  Calendar,
  Target,
  ArrowRight,
  Activity,
  BarChart3,
  Eye,
  Heart,
  Share2,
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface Team {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
  crest: string;
  address?: string;
  website?: string;
  founded?: number;
  venue?: string;
  area: {
    id: number;
    name: string;
    code: string;
    flag: string;
  };
  primaryCompetition?: {
    id: string;
    name: string;
  };
  coach?: {
    id: number;
    name: string;
    nationality: string;
  };
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [competitions, setCompetitions] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch teams from API
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching teams from API...');
        
        const response = await fetch('/api/teams?limit=100');
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Teams data received:', data);
        
        setTeams(data.teams || []);
        setFilteredTeams(data.teams || []);
        setCompetitions(data.competitions || []);
        setCountries(data.countries || []);
        
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch teams');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = teams;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(team =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.shortName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.tla?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Competition filter
    if (selectedCompetition !== 'all') {
      filtered = filtered.filter(team => 
        team.primaryCompetition?.name === selectedCompetition
      );
    }

    // Country filter
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(team => 
        team.area.name === selectedCountry
      );
    }

    setFilteredTeams(filtered);
  }, [searchQuery, selectedCompetition, selectedCountry, teams]);

  const toggleFavorite = (teamId: number) => {
    setFavorites(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const retryFetch = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20 md:pt-24">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Loading Teams</h2>
          <p className="text-white/70">Fetching data from Football API...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Teams</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={retryFetch}
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
      {/* Backend-style Animated Background */}
      <div className="absolute inset-0">
        {/* Matrix-like grid lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-slide-right"></div>
          <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent animate-slide-right delay-1000"></div>
          <div className="absolute top-40 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-slide-right delay-2000"></div>
          <div className="absolute top-60 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent animate-slide-right delay-3000"></div>
          <div className="absolute bottom-40 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-slide-right delay-4000"></div>
          <div className="absolute bottom-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent animate-slide-right delay-5000"></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-1 h-1 bg-blue-400 rounded-full animate-float-1"></div>
          <div className="absolute top-32 right-20 w-1 h-1 bg-purple-400 rounded-full animate-float-2"></div>
          <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-float-3"></div>
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-float-1"></div>
          <div className="absolute bottom-40 right-10 w-1 h-1 bg-blue-400 rounded-full animate-float-2"></div>
          <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-purple-400 rounded-full animate-float-3"></div>
          <div className="absolute bottom-60 left-2/3 w-1 h-1 bg-blue-400 rounded-full animate-float-1"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-float-2"></div>
        </div>
        
        {/* Scan lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-blue-500/5 to-transparent animate-scan"></div>
        </div>
        
        {/* Interactive cursor glow */}
        <div
          className="absolute w-32 h-32 bg-blue-400/2 rounded-full blur-2xl pointer-events-none transition-all duration-500"
          style={{
            transform: `translate(${mousePosition.x - 64}px, ${mousePosition.y - 64}px)`,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-6 border border-white/20">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-white/90 font-medium">Live Football Teams</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Football Teams
          </h1>
          
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Explore {teams.length} teams from top leagues worldwide with real-time data
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedCompetition}
                onChange={(e) => setSelectedCompetition(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 transition-all duration-300"
              >
                <option value="all">All Competitions</option>
                {competitions.map(comp => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
              </select>

              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 transition-all duration-300"
              >
                <option value="all">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex bg-white/10 rounded-2xl p-1 border border-white/20">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                List
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
            <div className="text-white/70">
              Showing <span className="text-white font-bold">{filteredTeams.length}</span> of <span className="text-blue-300">{teams.length}</span> teams
              {searchQuery && (
                <span> matching "<span className="text-blue-300">{searchQuery}</span>"</span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-green-400" />
              <span className="text-white/70 text-sm">Live API Data</span>
            </div>
          </div>
        </div>

        {/* Teams Grid/List */}
        {filteredTeams.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
              : 'space-y-6'
          }`}>
            {filteredTeams.map((team, index) => (
              <TeamCard
                key={team.id}
                team={team}
                index={index}
                isFavorite={favorites.includes(team.id)}
                onToggleFavorite={() => toggleFavorite(team.id)}
                onSelect={() => setSelectedTeam(team)}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Target className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Teams Found</h3>
            <p className="text-white/70 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCompetition('all');
                setSelectedCountry('all');
              }}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Team Detail Modal */}
      {selectedTeam && (
        <TeamDetailModal
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
        />
      )}

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
        
        .team-card-animate {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .team-card-animate-0 { animation-delay: 0s; }
        .team-card-animate-1 { animation-delay: 0.05s; }
        .team-card-animate-2 { animation-delay: 0.1s; }
        .team-card-animate-3 { animation-delay: 0.15s; }
        .team-card-animate-4 { animation-delay: 0.2s; }
        .team-card-animate-5 { animation-delay: 0.25s; }
        .team-card-animate-6 { animation-delay: 0.3s; }
        .team-card-animate-7 { animation-delay: 0.35s; }
        .team-card-animate-8 { animation-delay: 0.4s; }
        .team-card-animate-9 { animation-delay: 0.45s; }
        .team-card-animate-10 { animation-delay: 0.5s; }
        .team-card-animate-11 { animation-delay: 0.55s; }
        .team-card-animate-12 { animation-delay: 0.6s; }
        .team-card-animate-13 { animation-delay: 0.65s; }
        .team-card-animate-14 { animation-delay: 0.7s; }
        .team-card-animate-15 { animation-delay: 0.75s; }
        .team-card-animate-16 { animation-delay: 0.8s; }
        .team-card-animate-17 { animation-delay: 0.85s; }
        .team-card-animate-18 { animation-delay: 0.9s; }
        .team-card-animate-19 { animation-delay: 0.95s; }
        .team-card-animate-20 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}

interface TeamCardProps {
  team: Team;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelect: () => void;
  viewMode: 'grid' | 'list';
}

function TeamCard({ team, index, isFavorite, onToggleFavorite, onSelect, viewMode }: TeamCardProps) {
  const [imageError, setImageError] = useState(false);

  if (viewMode === 'list') {
    return (
      <div 
        className={`group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-500 cursor-pointer team-card-animate team-card-animate-${Math.min(index, 20)}`}
        onClick={onSelect}
      >
        <div className="flex items-center gap-6">
          <div className="relative">
            {!imageError ? (
              <img
                src={team.crest}
                alt={team.name}
                className="w-16 h-16 object-contain rounded-xl border border-white/20 bg-white/10 p-2"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-16 h-16 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
                <Users className="w-8 h-8 text-white/40" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">
                {team.name}
              </h3>
              {team.tla && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded">
                  {team.tla}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <div className="flex items-center gap-1">
                <img src={team.area.flag} alt={team.area.name} className="w-4 h-4 rounded" />
                <span>{team.area.name}</span>
              </div>
              {team.primaryCompetition && (
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  <span>{team.primaryCompetition.name}</span>
                </div>
              )}
              {team.founded && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Est. {team.founded}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isFavorite 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-red-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            
            <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer team-card-animate team-card-animate-${Math.min(index, 20)}`}
      onClick={onSelect}
    >
      {/* Team Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          {!imageError ? (
            <img
              src={team.crest}
              alt={team.name}
              className="w-20 h-20 object-contain rounded-2xl border border-white/20 bg-white/10 p-3 group-hover:scale-110 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-20 h-20 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="w-10 h-10 text-white/40" />
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`p-3 rounded-2xl transition-all duration-300 ${
            isFavorite 
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:scale-110' 
              : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-red-400 hover:scale-110'
          }`}
        >
          <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Team Info */}
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300 mb-1">
            {team.name}
          </h3>
          {team.shortName && team.shortName !== team.name && (
            <p className="text-white/60">{team.shortName}</p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white/70">
            <img src={team.area.flag} alt={team.area.name} className="w-5 h-5 rounded" />
            <span className="text-sm">{team.area.name}</span>
          </div>

          {team.primaryCompetition && (
            <div className="flex items-center gap-2 text-white/70">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">{team.primaryCompetition.name}</span>
            </div>
          )}

          {team.founded && (
            <div className="flex items-center gap-2 text-white/70">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span className="text-sm">Founded {team.founded}</span>
            </div>
          )}

          {team.venue && (
            <div className="flex items-center gap-2 text-white/70">
              <MapPin className="w-5 h-5 text-green-400" />
              <span className="text-sm">{team.venue}</span>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-1 text-white/60 text-xs">
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </div>
          <div className="flex items-center gap-1 text-white/60 text-xs">
            <Activity className="w-4 h-4" />
            <span>Live Stats</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TeamDetailModalProps {
  team: Team;
  onClose: () => void;
}

function TeamDetailModal({ team, onClose }: TeamDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Team Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Team Header */}
          <div className="flex items-center gap-6">
            <img
              src={team.crest}
              alt={team.name}
              className="w-24 h-24 object-contain rounded-2xl border border-white/20 bg-white/10 p-3"
            />
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{team.name}</h3>
              <div className="flex items-center gap-3 text-white/70">
                <img src={team.area.flag} alt={team.area.name} className="w-5 h-5 rounded" />
                <span>{team.area.name}</span>
                {team.tla && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded">
                    {team.tla}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Team Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.founded && (
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="text-white/70 text-sm">Founded</span>
                </div>
                <span className="text-white font-bold">{team.founded}</span>
              </div>
            )}

            {team.venue && (
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <span className="text-white/70 text-sm">Stadium</span>
                </div>
                <span className="text-white font-bold">{team.venue}</span>
              </div>
            )}

            {team.primaryCompetition && (
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/70 text-sm">Competition</span>
                </div>
                <span className="text-white font-bold">{team.primaryCompetition.name}</span>
              </div>
            )}

            {team.coach && (
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-white/70 text-sm">Coach</span>
                </div>
                <span className="text-white font-bold">{team.coach.name}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {team.website && (
              <a
                href={team.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-300"
              >
                <ExternalLink className="w-4 h-4" />
                Official Website
              </a>
            )}
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors duration-300">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}