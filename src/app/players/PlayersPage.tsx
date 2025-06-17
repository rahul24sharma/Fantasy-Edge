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
  User,
  Loader2,
  AlertCircle,
  RefreshCw,
  Flag,
  Zap,
  Star,
  Award,
  Globe,
  Clock,
  TrendingUp
} from 'lucide-react';

interface Player {
  id: number;
  name: string;
  position?: string;
  dateOfBirth: string;
  nationality: string;
  team?: {
    id: number;
    name: string;
    shortName?: string;
    crest: string;
  } | null;
  photo?: string;
  cutout?: string;
  status?: string;
  gender?: string;
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [selectedNationality, setSelectedNationality] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [positions, setPositions] = useState<string[]>([]);
  const [nationalities, setNationalities] = useState<string[]>([]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch players from API
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching players from API...');
        
        const response = await fetch('/api/players?limit=200');
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Players data received:', data);
        
        setPlayers(data.players || []);
        setFilteredPlayers(data.players || []);
        setPositions(data.positions || []);
        setNationalities(data.nationalities || []);
        
      } catch (err) {
        console.error('Error fetching players:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch players');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
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
    let filtered = players;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.nationality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.team?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Position filter
    if (selectedPosition !== 'all') {
      filtered = filtered.filter(player => {
        if (!player.position) return false;
        
        const pos = player.position.toUpperCase();
        switch (selectedPosition.toLowerCase()) {
          case 'goalkeeper':
            return pos.includes('GOALKEEPER') || pos.includes('GK');
          case 'defender':
            return pos.includes('DEFENCE') || pos.includes('DEFENDER') || 
                   pos.includes('BACK') || pos.includes('CB') || pos.includes('LB') || pos.includes('RB');
          case 'midfielder':
            return pos.includes('MIDFIELD') || pos.includes('MIDFIELDER') ||
                   pos.includes('CM') || pos.includes('DM') || pos.includes('AM');
          case 'forward':
            return pos.includes('OFFENCE') || pos.includes('FORWARD') || pos.includes('STRIKER') ||
                   pos.includes('WINGER') || pos.includes('LW') || pos.includes('RW') || pos.includes('CF');
          default:
            return pos.includes(selectedPosition.toUpperCase());
        }
      });
    }

    // Nationality filter
    if (selectedNationality !== 'all') {
      filtered = filtered.filter(player => 
        player.nationality === selectedNationality
      );
    }

    setFilteredPlayers(filtered);
  }, [searchQuery, selectedPosition, selectedNationality, players]);

  const toggleFavorite = (playerId: number) => {
    setFavorites(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const getPlayerAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getPositionColor = (position: string) => {
    if (!position) return 'from-gray-500 to-gray-600';
    
    const pos = position.toUpperCase();
    if (pos.includes('GOALKEEPER') || pos.includes('GK')) return 'from-yellow-500 to-orange-500';
    if (pos.includes('DEFENCE') || pos.includes('DEFENDER') || pos.includes('BACK')) return 'from-blue-500 to-cyan-500';
    if (pos.includes('MIDFIELD') || pos.includes('MIDFIELDER')) return 'from-green-500 to-emerald-500';
    if (pos.includes('OFFENCE') || pos.includes('FORWARD') || pos.includes('STRIKER') || pos.includes('WINGER')) return 'from-red-500 to-pink-500';
    return 'from-purple-500 to-indigo-500';
  };

  const retryFetch = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Loading Players</h2>
          <p className="text-white/70">Fetching player data from top teams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Players</h2>
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
        </div>
        
        {/* Scan lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-blue-500/5 to-transparent animate-scan"></div>
        </div>
        
        {/* Minimal cursor glow */}
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
            <User className="w-5 h-5 text-blue-400" />
            <span className="text-white/90 font-medium">Elite Football Players</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Player Database
          </h1>
          
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Discover {players.length}+ professional players from top clubs worldwide
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
                placeholder="Search players, teams, nationality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 transition-all duration-300"
              >
                <option value="all">All Positions</option>
                <option value="goalkeeper">Goalkeeper</option>
                <option value="defender">Defender</option>
                <option value="midfielder">Midfielder</option>
                <option value="forward">Forward</option>
              </select>

              <select
                value={selectedNationality}
                onChange={(e) => setSelectedNationality(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 transition-all duration-300"
              >
                <option value="all">All Countries</option>
                {nationalities.slice(0, 20).map(nationality => (
                  <option key={nationality} value={nationality}>{nationality}</option>
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
              Showing <span className="text-white font-bold">{filteredPlayers.length}</span> of <span className="text-blue-300">{players.length}</span> players
              {searchQuery && (
                <span> matching "<span className="text-blue-300">{searchQuery}</span>"</span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-green-400" />
              <span className="text-white/70 text-sm">Live Player Data</span>
            </div>
          </div>
        </div>

        {/* Players Grid/List */}
        {filteredPlayers.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          }`}>
            {filteredPlayers.map((player, index) => (
              <PlayerCard
                key={player.id}
                player={player}
                index={index}
                isFavorite={favorites.includes(player.id)}
                onToggleFavorite={() => toggleFavorite(player.id)}
                onSelect={() => setSelectedPlayer(player)}
                viewMode={viewMode}
                getPlayerAge={getPlayerAge}
                getPositionColor={getPositionColor}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Target className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Players Found</h3>
            <p className="text-white/70 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedPosition('all');
                setSelectedNationality('all');
              }}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <PlayerDetailModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          getPlayerAge={getPlayerAge}
          getPositionColor={getPositionColor}
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
        
        .player-card-animate {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .player-card-animate-0 { animation-delay: 0s; }
        .player-card-animate-1 { animation-delay: 0.03s; }
        .player-card-animate-2 { animation-delay: 0.06s; }
        .player-card-animate-3 { animation-delay: 0.09s; }
        .player-card-animate-4 { animation-delay: 0.12s; }
        .player-card-animate-5 { animation-delay: 0.15s; }
        .player-card-animate-6 { animation-delay: 0.18s; }
        .player-card-animate-7 { animation-delay: 0.21s; }
        .player-card-animate-8 { animation-delay: 0.24s; }
        .player-card-animate-9 { animation-delay: 0.27s; }
        .player-card-animate-10 { animation-delay: 0.3s; }
        .player-card-animate-11 { animation-delay: 0.33s; }
        .player-card-animate-12 { animation-delay: 0.36s; }
        .player-card-animate-13 { animation-delay: 0.39s; }
        .player-card-animate-14 { animation-delay: 0.42s; }
        .player-card-animate-15 { animation-delay: 0.45s; }
        .player-card-animate-16 { animation-delay: 0.48s; }
        .player-card-animate-17 { animation-delay: 0.51s; }
        .player-card-animate-18 { animation-delay: 0.54s; }
        .player-card-animate-19 { animation-delay: 0.57s; }
        .player-card-animate-20 { animation-delay: 0.6s; }
      `}</style>
    </div>
  );
}

interface PlayerCardProps {
  player: Player;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelect: () => void;
  viewMode: 'grid' | 'list';
  getPlayerAge: (dateOfBirth: string) => number;
  getPositionColor: (position: string) => string;
}

function PlayerCard({ player, index, isFavorite, onToggleFavorite, onSelect, viewMode, getPlayerAge, getPositionColor }: PlayerCardProps) {
  const [imageError, setImageError] = useState(false);

  if (viewMode === 'list') {
    return (
      <div 
        className={`group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-500 cursor-pointer player-card-animate player-card-animate-${Math.min(index, 20)}`}
        onClick={onSelect}
      >
        <div className="flex items-center gap-6">
          <div className="relative">
            {!imageError && player.photo ? (
              <img
                src={player.photo}
                alt={player.name}
                className="w-16 h-16 object-cover rounded-2xl border-2 border-white/20 bg-white/10"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                {player.name.charAt(0)}
              </div>
            )}
            {player.team && (
              <img
                src={player.team.crest}
                alt={player.team.name}
                className="absolute -bottom-2 -right-2 w-6 h-6 object-contain rounded-full border-2 border-white bg-white/90"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">
                {player.name}
              </h3>
              {player.position && (
                <span className={`px-3 py-1 bg-gradient-to-r ${getPositionColor(player.position)} text-white text-xs font-bold rounded-full`}>
                  {player.position}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <div className="flex items-center gap-1">
                <Flag className="w-4 h-4" />
                <span>{player.nationality}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{getPlayerAge(player.dateOfBirth)} years</span>
              </div>
              {player.team && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{player.team.shortName || player.team.name}</span>
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
      className={`group bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer player-card-animate player-card-animate-${Math.min(index, 20)}`}
      onClick={onSelect}
    >
      {/* Player Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          {!imageError && player.photo ? (
            <img
              src={player.photo}
              alt={player.name}
              className="w-20 h-20 object-cover rounded-2xl border-2 border-white/20 bg-white/10 group-hover:scale-110 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-300">
              {player.name.charAt(0)}
            </div>
          )}
          {player.team && (
            <img
              src={player.team.crest}
              alt={player.team.name}
              className="absolute -bottom-2 -right-2 w-8 h-8 object-contain rounded-full border-2 border-white bg-white/90"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
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

      {/* Player Info */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300 mb-1">
            {player.name}
          </h3>
          {player.position && (
            <span className={`inline-block px-3 py-1 bg-gradient-to-r ${getPositionColor(player.position)} text-white text-xs font-bold rounded-full`}>
              {player.position}
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white/70">
            <Flag className="w-5 h-5 text-blue-400" />
            <span className="text-sm">{player.nationality}</span>
          </div>

          <div className="flex items-center gap-2 text-white/70">
            <Calendar className="w-5 h-5 text-green-400" />
            <span className="text-sm">{getPlayerAge(player.dateOfBirth)} years old</span>
          </div>

          {player.team && (
            <div className="flex items-center gap-2 text-white/70">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-sm">{player.team.shortName || player.team.name}</span>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-1 text-white/60 text-xs">
            <Eye className="w-4 h-4" />
            <span>View Profile</span>
          </div>
          <div className="flex items-center gap-1 text-white/60 text-xs">
            <Activity className="w-4 h-4" />
            <span>Player Stats</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PlayerDetailModalProps {
  player: Player;
  onClose: () => void;
  getPlayerAge: (dateOfBirth: string) => number;
  getPositionColor: (position: string) => string;
}

function PlayerDetailModal({ player, onClose, getPlayerAge, getPositionColor }: PlayerDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Player Profile</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Player Header */}
          <div className="flex items-center gap-6">
            <div className="relative">
              {player.photo ? (
                <img
                  src={player.photo}
                  alt={player.name}
                  className="w-24 h-24 object-cover rounded-3xl border-2 border-white/20"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center text-white font-black text-3xl">
                  {player.name.charAt(0)}
                </div>
              )}
              {player.team && (
                <img
                  src={player.team.crest}
                  alt={player.team.name}
                  className="absolute -bottom-2 -right-2 w-10 h-10 object-contain rounded-full border-2 border-white bg-white/90"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">{player.name}</h3>
              <div className="flex items-center gap-3">
                {player.position && (
                  <span className={`px-4 py-2 bg-gradient-to-r ${getPositionColor(player.position)} text-white text-sm font-bold rounded-full`}>
                    {player.position}
                  </span>
                )}
                {player.status && (
                  <span className={`px-3 py-1 ${player.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'} text-sm font-bold rounded-full`}>
                    {player.status}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Player Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Flag className="w-5 h-5 text-blue-400" />
                <span className="text-white/70 text-sm">Nationality</span>
              </div>
              <span className="text-white font-bold">{player.nationality}</span>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-green-400" />
                <span className="text-white/70 text-sm">Age</span>
              </div>
              <span className="text-white font-bold">{getPlayerAge(player.dateOfBirth)} years old</span>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <span className="text-white/70 text-sm">Date of Birth</span>
              </div>
              <span className="text-white font-bold">{new Date(player.dateOfBirth).toLocaleDateString()}</span>
            </div>

            {player.team && (
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/70 text-sm">Current Team</span>
                </div>
                <div className="flex items-center gap-2">
                  <img 
                    src={player.team.crest} 
                    alt={player.team.name} 
                    className="w-6 h-6" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="text-white font-bold">{player.team.name}</span>
                </div>
              </div>
            )}

            {player.status && (
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  <span className="text-white/70 text-sm">Status</span>
                </div>
                <span className={`font-bold ${player.status === 'Active' ? 'text-green-300' : 'text-gray-300'}`}>
                  {player.status}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-300">
              <TrendingUp className="w-4 h-4" />
              View Stats
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors duration-300">
              <Share2 className="w-4 h-4" />
              Share Player
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}