'use client';

import { MatchesList } from '@/components/matchlist/MatchList';
import { useCompetitions } from '@/hooks/useFootballData';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getTodaysMatches, getLiveMatches } from '../api/footballdata';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Globe,
  Play,
  Pause,
  ArrowRight,
  Star,
  Zap,
  Target
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Analytics() {
  const { competitions, loading } = useCompetitions();
  const [activeTab, setActiveTab] = useState('recent');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Get today's date for filtering recent matches
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { icon: Trophy, label: "Active Competitions", value: competitions?.length || 0, color: "from-yellow-400 to-orange-500" },
            { icon: Target, label: "Matches Today", value: "12", color: "from-green-400 to-blue-500" },
            { icon: TrendingUp, label: "Live Analytics", value: "∞", color: "from-purple-400 to-pink-500" }
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