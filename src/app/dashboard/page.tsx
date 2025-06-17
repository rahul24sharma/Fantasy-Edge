'use client';

import { MatchesList } from '@/components/matchlist/MatchList';
import { useCompetitions } from '@/hooks/useFootballData';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion'; // Added Variants import
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
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fixed variants with proper types
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
        type: "spring" as const, // Fixed with as const
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
        type: "spring" as const, // Fixed with as const
        stiffness: 400,
        damping: 25
      }
    }
  };

  const glowVariants: Variants = {
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

        {/* Rest of your component content stays the same... */}
        {/* I'll include just the key parts to show the structure */}

        {/* New Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Premier League Standings */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
          >
            {/* Content unchanged */}
          </motion.div>

          {/* Latest Transfers */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
          >
            {/* Content unchanged */}
          </motion.div>
        </div>

        {/* Matches Section with Tabs */}
        <motion.div
          variants={itemVariants}
          className="mb-12"
        >
          {/* Content unchanged */}
        </motion.div>

        {/* Competitions Grid */}
        <motion.div variants={itemVariants}>
          {/* Content unchanged */}
        </motion.div>
      </motion.div>

      {/* Backend-style CSS Animations - unchanged */}
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