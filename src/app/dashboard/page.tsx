'use client';

import { MatchesList } from '@/components/matchlist/MatchList';
import { useCompetitions } from '@/hooks/useFootballData';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
      for: number;
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
        const response = await fetch('/api/standings?league=39&season=2023');
        if (response.ok) {
          const data = await response.json();
          setStandings(data.standings?.slice(0, 6) || []); // Top 6 for dashboard
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
          setTransfers(data.transfers?.slice(0, 5) || []); // Latest 5 for dashboard
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
    return () => window.removeEventListener('mousemoveup', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      rotateX: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(59, 130, 246, 0.3)",
        "0 0 40px rgba(59, 130, 246, 0.6)",
        "0 0 20px rgba(59, 130, 246, 0.3)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
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
        
        {/* Interactive cursor glow - enhanced with framer motion */}
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
        <motion.div
          variants={itemVariants}
          className="text-center mb-16"
        >
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
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
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

        {/* New Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Premier League Standings */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Premier League</h2>
              </div>
              <Link href="/standings" className="text-blue-400 hover:text-blue-300 transition-colors">
                View All
              </Link>
            </div>

            {standingsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 animate-pulse">
                    <div className="w-8 h-8 bg-white/20 rounded"></div>
                    <div className="w-8 h-8 bg-white/20 rounded"></div>
                    <div className="flex-1 h-4 bg-white/20 rounded"></div>
                    <div className="w-12 h-4 bg-white/20 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {standings.map((team, index) => (
                  <motion.div
                    key={team.team.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${getPositionColor(team.rank)}`}>
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
                      <h3 className="text-white font-medium">{team.team.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {team.form?.split('').slice(-5).map((result, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${getFormColor(team.form, team.form.length - 5 + i)}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">{team.points}</div>
                      <div className="text-white/60 text-sm">{team.goalsDiff > 0 ? '+' : ''}{team.goalsDiff}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Latest Transfers */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Shuffle className="w-8 h-8 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Latest Transfers</h2>
              </div>
              <Link href="/transfers" className="text-purple-400 hover:text-purple-300 transition-colors">
                View All
              </Link>
            </div>

            {transfersLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 animate-pulse">
                    <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-white/20 rounded mb-2"></div>
                      <div className="h-3 bg-white/10 rounded w-2/3"></div>
                    </div>
                    <div className="w-16 h-6 bg-white/20 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {transfers.map((transfer, index) => (
                  <motion.div
                    key={transfer.player.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                      {transfer.player.photo ? (
                        <img 
                          src={transfer.player.photo} 
                          alt={transfer.player.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="w-6 h-6 text-white/40" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{transfer.player.name}</h3>
                      {transfer.transfer && (
                        <div className="flex items-center gap-2 mt-1">
                          <img 
                            src={transfer.transfer.teams.out.logo} 
                            alt={transfer.transfer.teams.out.name}
                            className="w-4 h-4 object-contain"
                          />
                          <ArrowRight className="w-3 h-3 text-white/40" />
                          <img 
                            src={transfer.transfer.teams.in.logo} 
                            alt={transfer.transfer.teams.in.name}
                            className="w-4 h-4 object-contain"
                          />
                        </div>
                      )}
                    </div>
                    {transfer.transfer && (
                      <div className="text-right">
                        <div className="text-green-400 font-bold text-sm">{transfer.transfer.type}</div>
                        <div className="text-white/60 text-xs">
                          {new Date(transfer.transfer.date).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Matches Section with Tabs */}
        <motion.div
          variants={itemVariants}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Match Center</h2>
            
            {/* Tab Switcher */}
            <div className="flex bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
              {[
                { id: 'recent', label: 'Recent', icon: Clock },
                { id: 'upcoming', label: 'Upcoming', icon: Calendar }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white text-slate-900 shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
            >
              {activeTab === 'recent' ? (
                <MatchesList
                  dateFrom={weekAgo}
                  dateTo={today}
                  status="FINISHED"
                />
              ) : (
                <MatchesList
                  dateFrom={today}
                  status="SCHEDULED"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Competitions Grid */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3 mb-8">
            <Globe className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-bold text-white">Global Competitions</h2>
            <motion.div
              className="ml-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium"
              variants={glowVariants}
              animate="animate"
            >
              <Star className="w-4 h-4 inline mr-2" />
              Premium Access
            </motion.div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                >
                  <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-4"></div>
                  <div className="h-4 bg-white/20 rounded mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-2/3 mx-auto"></div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              variants={containerVariants}
            >
              {competitions?.map((competition, index) => (
                <motion.div
                  key={competition.id}
                  variants={itemVariants}
                  whileHover="hover"
                  custom={index}
                >
                  <Link href={`/dashboard/competitions/${competition.id}`}>
                    <motion.div
                      className="group relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 cursor-pointer overflow-hidden"
                      variants={cardHoverVariants}
                    >
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        <motion.div
                          className="relative mb-4"
                          whileHover={{ rotate: 5, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="w-16 h-16 mx-auto relative">
                            <motion.img
                              src={competition.emblem}
                              alt=""
                              className="w-full h-full object-contain filter drop-shadow-lg"
                              loading="lazy"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full group-hover:from-blue-400/30 transition-all duration-300"></div>
                          </div>
                        </motion.div>
                        
                        <h3 className="font-bold text-white text-center mb-2 group-hover:text-blue-200 transition-colors duration-300">
                          {competition.name}
                        </h3>
                        
                        <p className="text-sm text-white/70 text-center group-hover:text-white/90 transition-colors duration-300">
                          {competition.area?.name}
                        </p>
                        
                        <motion.div
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100"
                          initial={{ x: 10 }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowRight className="w-5 h-5 text-white" />
                        </motion.div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Backend-style CSS Animations */}
      <style jsx global>{`
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
      `}</style>
    </div>
  );
}