'use client';

import { useCompetitions } from '@/hooks/useFootballData';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  Globe,
  ArrowRight,
  Star,
  Zap,
  Target,
  Users,
  ArrowUpDown,
  Award,
  Shuffle,
  TrendingUp,
  Activity,
  MapPin,
  Eye,
  ChevronRight,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface Standing {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  form: string;
  status: string;
  description: string | null;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      scored: number;
      against: number;
    };
  };
}

interface Transfer {
  player: {
    id: number;
    name: string;
    photo?: string;
  };
  update: string;
  transfer: {
    date: string;
    type: string;
    teams: {
      in: {
        id: number;
        name: string;
        logo: string;
      };
      out: {
        id: number;
        name: string;
        logo: string;
      };
    };
  } | null;
}

interface Fixture {
  id: number;
  referee?: string;
  timezone: string;
  date: string;
  timestamp: number;
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
}

// FixturesDisplay Component - Uses your working /api/fixtures API
function FixturesDisplay({ activeTab }: { activeTab: string }) {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let url = '/api/fixtures';
        const today = new Date();
        
        if (activeTab === 'recent') {
          // Try multiple recent dates to find finished matches
          const dates = [];
          for (let i = 1; i <= 7; i++) {
            const pastDate = new Date(today);
            pastDate.setDate(today.getDate() - i);
            dates.push(pastDate.toISOString().split('T')[0]);
          }
          
          // Try to get recent matches from the past week
          let allFixtures: Fixture[] = [];
          for (const date of dates.slice(0, 3)) { // Try last 3 days first
            try {
              console.log('Fetching recent fixtures for date:', date);
              const response = await fetch(`/api/fixtures?date=${date}`);
              if (response.ok) {
                const data = await response.json();
                const fixtures = data.fixtures || [];
                const finishedFixtures = fixtures.filter((f: Fixture) => 
                  f.status.short === 'FT' || f.status.short === 'AET' || f.status.short === 'PEN'
                );
                allFixtures.push(...finishedFixtures);
                if (allFixtures.length >= 4) break; // Stop when we have enough
              }
            } catch (error) {
              console.warn(`Failed to fetch fixtures for ${date}:`, error);
            }
          }
          setFixtures(allFixtures.slice(0, 4));
          return;
          
        } else if (activeTab === 'today') {
          const todayStr = today.toISOString().split('T')[0];
          url += `?date=${todayStr}`;
          
        } else if (activeTab === 'upcoming') {
          // Try multiple upcoming dates to find scheduled matches
          const dates = [];
          for (let i = 1; i <= 7; i++) {
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i);
            dates.push(futureDate.toISOString().split('T')[0]);
          }
          
          let allFixtures: Fixture[] = [];
          for (const date of dates.slice(0, 3)) { // Try next 3 days
            try {
              console.log('Fetching upcoming fixtures for date:', date);
              const response = await fetch(`/api/fixtures?date=${date}`);
              if (response.ok) {
                const data = await response.json();
                const fixtures = data.fixtures || [];
                const scheduledFixtures = fixtures.filter((f: Fixture) => 
                  f.status.short === 'NS' || f.status.short === 'TBD'
                );
                allFixtures.push(...scheduledFixtures);
                if (allFixtures.length >= 4) break; // Stop when we have enough
              }
            } catch (error) {
              console.warn(`Failed to fetch fixtures for ${date}:`, error);
            }
          }
          setFixtures(allFixtures.slice(0, 4));
          return;
        }
        
        console.log('Fetching fixtures from:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch fixtures: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fixtures data:', data);
        
        const fixturesData = data.fixtures || [];
        setFixtures(fixturesData.slice(0, 4)); // Limit to 4 for dashboard
        
      } catch (err) {
        console.error('Error fetching fixtures:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch fixtures');
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, [activeTab]);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/5 rounded-2xl p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                <div className="h-4 bg-white/10 rounded w-24"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-6 bg-white/10 rounded w-16"></div>
                <div className="flex items-center gap-3">
                  <div className="h-4 bg-white/10 rounded w-20"></div>
                  <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h4 className="text-lg font-bold text-white mb-2">Failed to Load Matches</h4>
        <p className="text-white/60 text-sm mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (fixtures.length === 0) {
    return (
      <div className="text-center py-8">
        <Target className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <h4 className="text-lg font-bold text-white mb-2">No Matches Found</h4>
        <p className="text-white/60">
          {activeTab === 'recent' && "No recent matches available"}
          {activeTab === 'today' && "No matches scheduled for today"}
          {activeTab === 'upcoming' && "No upcoming matches found"}
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NS': return 'from-blue-500 to-cyan-500';
      case '1H': case '2H': case 'HT': case 'ET': case 'LIVE': return 'from-green-500 to-emerald-500';
      case 'FT': case 'AET': case 'PEN': return 'from-gray-500 to-slate-500';
      case 'PST': case 'CANC': case 'ABD': return 'from-red-500 to-pink-500';
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
      default: return status.long;
    }
  };

  return (
    <div className="space-y-4">
      {fixtures.map((fixture, index) => (
        <motion.div
          key={fixture.id}
          className="bg-white/5 hover:bg-white/10 rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <img
                src={fixture.league.logo}
                alt={fixture.league.name}
                className="w-4 h-4 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span>{fixture.league.name}</span>
            </div>
            <div className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(fixture.status.short)} text-white text-xs font-bold rounded-full`}>
              {getStatusText(fixture)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Home Team */}
            <div className="flex items-center gap-3 flex-1">
              <img
                src={fixture.teams.home.logo}
                alt={fixture.teams.home.name}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className={`font-semibold ${fixture.teams.home.winner ? 'text-green-300' : 'text-white'} group-hover:text-blue-300 transition-colors`}>
                {fixture.teams.home.name}
              </span>
            </div>

            {/* Score */}
            <div className="text-center px-4">
              {fixture.status.short === 'NS' ? (
                <div className="text-white/60 text-sm">
                  {new Date(fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              ) : (
                <div className="text-xl font-bold text-white">
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
            <div className="flex items-center gap-3 flex-1 justify-end">
              <span className={`font-semibold ${fixture.teams.away.winner ? 'text-green-300' : 'text-white'} group-hover:text-blue-300 transition-colors`}>
                {fixture.teams.away.name}
              </span>
              <img
                src={fixture.teams.away.logo}
                alt={fixture.teams.away.name}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Venue Info */}
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-white/40">
            <MapPin className="w-3 h-3" />
            <span>{fixture.venue.name}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { competitions, loading } = useCompetitions();
  const [activeTab, setActiveTab] = useState('recent');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [standings, setStandings] = useState<Standing[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [standingsLoading, setStandingsLoading] = useState(true);
  const [transfersLoading, setTransfersLoading] = useState(true);
  
  // Get today's date for filtering recent matches
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Fetch standings
  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setStandingsLoading(true);
        
        // Try multiple endpoints and seasons
        const endpoints = [
          '/api/standings?league=39&season=2024',
          '/api/standings?league=39&season=2023', 
          '/api/fixtures?league=39', // Fallback to fixtures API
        ];
        
        for (const endpoint of endpoints) {
          try {
            console.log('Trying standings endpoint:', endpoint);
            const response = await fetch(endpoint);
            
            if (response.ok) {
              const data = await response.json();
              console.log('Standings response:', data);
              
              // Check different possible data structures
              let standingsData = null;
              if (data.standings) {
                standingsData = data.standings;
              } else if (data.response && Array.isArray(data.response)) {
                standingsData = data.response;
              } else if (data.fixtures) {
                // If using fixtures API, we'll skip standings for now
                console.log('No standings API available, skipping...');
                break;
              }
              
              if (standingsData && standingsData.length > 0) {
                console.log('Found standings data:', standingsData.slice(0, 2));
                setStandings(standingsData.slice(0, 6));
                break; // Success, stop trying other endpoints
              }
            } else {
              console.warn(`Endpoint ${endpoint} returned ${response.status}`);
            }
          } catch (endpointError) {
            console.warn(`Failed to fetch from ${endpoint}:`, endpointError);
          }
        }
        
        // If no standings found, create mock data for demo
        if (standings.length === 0) {
          console.log('No standings data found, using mock data');
          const mockStandings: Standing[] = [
            {
              rank: 1,
              team: { id: 1, name: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png' },
              points: 84,
              goalsDiff: 45,
              form: 'WWWWW',
              status: 'same',
              description: 'Champions League',
              all: { played: 32, win: 26, draw: 6, lose: 0, goals: { scored: 78, against: 33 } }
            },
            {
              rank: 2,
              team: { id: 2, name: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/50.png' },
              points: 82,
              goalsDiff: 42,
              form: 'WWWLW',
              status: 'same',
              description: 'Champions League',
              all: { played: 32, win: 25, draw: 7, lose: 0, goals: { scored: 79, against: 37 } }
            },
            {
              rank: 3,
              team: { id: 3, name: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png' },
              points: 78,
              goalsDiff: 38,
              form: 'WWDWW',
              status: 'same',
              description: 'Champions League',
              all: { played: 32, win: 24, draw: 6, lose: 2, goals: { scored: 71, against: 33 } }
            },
            {
              rank: 4,
              team: { id: 4, name: 'Chelsea', logo: 'https://media.api-sports.io/football/teams/49.png' },
              points: 65,
              goalsDiff: 18,
              form: 'WDWWL',
              status: 'same',
              description: 'Champions League',
              all: { played: 32, win: 19, draw: 8, lose: 5, goals: { scored: 58, against: 40 } }
            },
            {
              rank: 5,
              team: { id: 5, name: 'Manchester United', logo: 'https://media.api-sports.io/football/teams/33.png' },
              points: 63,
              goalsDiff: 15,
              form: 'LWWDW',
              status: 'same',
              description: 'Europa League',
              all: { played: 32, win: 18, draw: 9, lose: 5, goals: { scored: 55, against: 40 } }
            },
            {
              rank: 6,
              team: { id: 6, name: 'Tottenham', logo: 'https://media.api-sports.io/football/teams/47.png' },
              points: 61,
              goalsDiff: 12,
              form: 'DWWLW',
              status: 'same',
              description: 'Europa League',
              all: { played: 32, win: 17, draw: 10, lose: 5, goals: { scored: 52, against: 40 } }
            }
          ];
          setStandings(mockStandings);
        }
        
      } catch (error) {
        console.error('Error fetching standings:', error);
      } finally {
        setStandingsLoading(false);
      }
    };

    fetchStandings();
  }, []);

  // Fetch transfers
  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        setTransfersLoading(true);
        const response = await fetch('/api/transfers');
        if (response.ok) {
          const data = await response.json();
          setTransfers(data.transfers?.slice(0, 5) || []);
        }
      } catch (error) {
        console.error('Error fetching transfers:', error);
      } finally {
        setTransfersLoading(false);
      }
    };

    fetchTransfers();
  }, []);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardHoverVariants: Variants = {
    hover: {
      y: -8,
      scale: 1.02,
      rotateX: 5,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25
      }
    }
  };

  const getFormColor = (form: string, index: number) => {
    const match = form[index];
    switch (match) {
      case 'W': return 'bg-green-500';
      case 'D': return 'bg-yellow-500';
      case 'L': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPositionColor = (rank: number) => {
    if (rank <= 4) return 'text-green-400'; // Champions League
    if (rank <= 6) return 'text-blue-400'; // Europa League
    if (rank >= 18) return 'text-red-400'; // Relegation
    return 'text-white';
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden pt-20 md:pt-24">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-slide-right"></div>
          <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent animate-slide-right delay-1000"></div>
          <div className="absolute top-40 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-slide-right delay-2000"></div>
        </div>
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-1 h-1 bg-blue-400 rounded-full animate-float-1"></div>
          <div className="absolute top-32 right-20 w-1 h-1 bg-purple-400 rounded-full animate-float-2"></div>
          <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-float-3"></div>
        </div>
        
        <motion.div
          className="absolute w-32 h-32 bg-blue-400/2 rounded-full blur-2xl pointer-events-none"
          animate={{
            x: mousePosition.x - 64,
            y: mousePosition.y - 64,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
        />
      </div>

      <motion.div
        className="relative z-10 container mx-auto px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.div
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-6 border border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-white/90 font-medium">Live Analytics</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </motion.div>
          
          <motion.h1
            className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Football Analytics
          </motion.h1>
          
          <motion.p
            className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Experience the beautiful game through data, insights, and real-time analytics
          </motion.p>
        </motion.div>

        {/* Stats Overview Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Trophy, label: "Active Competitions", value: competitions?.length || 0, color: "from-yellow-400 to-orange-500" },
            { icon: Target, label: "Matches Today", value: "12", color: "from-green-400 to-blue-500" },
            { icon: ArrowUpDown, label: "League Standings", value: "Live", color: "from-blue-400 to-purple-500" },
            { icon: Shuffle, label: "Recent Transfers", value: `${transfers.length}`, color: "from-purple-400 to-pink-500" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="relative group"
              whileHover="hover"
              variants={cardHoverVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-75 rounded-2xl blur group-hover:blur-xl transition-all duration-300"
                   style={{ background: `linear-gradient(135deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})` }}>
              </div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Premier League Standings & Latest Transfers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Premier League Standings */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-400 to-blue-500">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Premier League</h3>
                  <p className="text-white/60 text-sm">Current Standings</p>
                </div>
              </div>
              <Link href="/standings">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>View All</span>
                  <ExternalLink className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>

            <div className="space-y-3">
              {standingsLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl animate-pulse">
                    <div className="w-8 h-8 bg-white/10 rounded"></div>
                    <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                    <div className="flex-1 h-4 bg-white/10 rounded"></div>
                    <div className="w-16 h-4 bg-white/10 rounded"></div>
                  </div>
                ))
              ) : standings.length > 0 ? (
                standings.map((team, index) => (
                  <motion.div
                    key={team.team.id}
                    className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`text-lg font-bold w-8 text-center ${getPositionColor(team.rank)}`}>
                      {team.rank}
                    </div>
                    <img
                      src={team.team.logo}
                      alt={team.team.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                        {team.team.name}
                      </div>
                      <div className="text-xs text-white/50">
                        {team.all.played} games • {team.all.win}W {team.all.draw}D {team.all.lose}L
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">{team.points}</div>
                      <div className="text-xs text-white/50">pts</div>
                    </div>
                    {team.form && (
                      <div className="flex gap-1">
                        {team.form.split('').slice(-5).map((result, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${getFormColor(team.form, team.form.length - 5 + i)}`}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50">No standings data available</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Latest Transfers */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-400 to-pink-500">
                  <Shuffle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Transfer News</h3>
                  <p className="text-white/60 text-sm">Latest Moves</p>
                </div>
              </div>
              <Link href="/transfers">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>View All</span>
                  <ExternalLink className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>

            <div className="space-y-4">
              {transfersLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl animate-pulse">
                    <div className="w-10 h-10 bg-white/10 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/10 rounded"></div>
                      <div className="h-3 bg-white/10 rounded w-2/3"></div>
                    </div>
                  </div>
                ))
              ) : transfers.length > 0 ? (
                transfers.map((transfer, index) => (
                  <motion.div
                    key={`${transfer.player.id}-${index}`}
                    className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {transfer.player.name}
                      </div>
                      <div className="text-sm text-white/60">
                        {transfer.transfer ? (
                          <div className="flex items-center gap-2">
                            <span>{transfer.transfer.teams.out?.name || 'Free Agent'}</span>
                            <ArrowRight className="w-3 h-3" />
                            <span>{transfer.transfer.teams.in?.name || 'Unknown'}</span>
                          </div>
                        ) : (
                          <span>Transfer details pending</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-white/40">
                      {new Date(transfer.update).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Shuffle className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50">No recent transfers</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Matches Section with Tabs */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-400 to-blue-500">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Live Matches</h3>
                  <p className="text-white/60 text-sm">Real-time updates</p>
                </div>
              </div>
              <Link href="/matches">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>View All</span>
                  <ExternalLink className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 bg-white/5 p-2 rounded-2xl">
              {[
                { id: 'recent', label: 'Recent', icon: Clock },
                { id: 'today', label: 'Today', icon: Calendar },
                { id: 'upcoming', label: 'Upcoming', icon: Target }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Matches Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <FixturesDisplay activeTab={activeTab} />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Competitions Grid */}
        <motion.div variants={itemVariants}>
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Active Competitions</h3>
                  <p className="text-white/60">Major football leagues and tournaments</p>
                </div>
              </div>
              <Link href="/competitions">
                <motion.button
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Explore All</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-6 animate-pulse">
                    <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-2/3 mx-auto"></div>
                  </div>
                ))}
              </div>
            ) : competitions && competitions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {competitions.slice(0, 6).map((competition, index) => (
                  <motion.div
                    key={competition.id}
                    className="group bg-white/5 hover:bg-white/10 rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors mb-2">
                        {competition.name}
                      </h4>
                      <div className="flex items-center justify-center gap-2 text-white/60 text-sm mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{competition.area?.name || 'International'}</span>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-xs text-white/50">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{competition.currentSeason?.currentMatchday || 0} MD</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-white mb-2">No Competitions Available</h4>
                <p className="text-white/60">Check back later for updated competition data</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}