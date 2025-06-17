'use client';

import { motion } from 'framer-motion';
import { Calendar, Trophy, RefreshCw, Award, Clock } from 'lucide-react';

interface CurrentSeasonCardProps {
  currentSeason: {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number;
    winner: null | {
      id: number;
      name: string;
      shortName: string;
      tla: string;
      crest: string;
    };
  };
  lastUpdatedFormatted: string;
}

export default function CurrentSeasonCard({ 
  currentSeason, 
  lastUpdatedFormatted 
}: CurrentSeasonCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl mb-8">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
        {/* Interactive glow effect */}
        <motion.div
          className="absolute w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0, -100, 0],
            y: [0, 100, 0, -100, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col">
          {/* Header */}
          <motion.div className="mb-6">
            <motion.div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-4 border border-white/20"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white/90 text-lg font-medium">Current Season</span>
            </motion.div>
          </motion.div>

          {/* Season Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Start Date Card */}
            <motion.div
              className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 group relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <p className="text-sm text-white/70 flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Start Date
                </p>
                <p className="text-white font-medium text-lg">
                  {new Date(currentSeason.startDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </motion.div>

            {/* End Date Card */}
            <motion.div
              className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 group relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <p className="text-sm text-white/70 flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  End Date
                </p>
                <p className="text-white font-medium text-lg">
                  {new Date(currentSeason.endDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </motion.div>

            {/* Matchday Card */}
            <motion.div
              className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 group relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <p className="text-sm text-white/70 flex items-center gap-2 mb-2">
                  <RefreshCw className="w-5 h-5 text-yellow-400" />
                  Current Matchday
                </p>
                <p className="text-white font-medium text-lg">{currentSeason.currentMatchday}</p>
              </div>
            </motion.div>
          </div>

          {/* Last Updated */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 self-start"
            whileHover={{ scale: 1.03 }}
          >
            <Clock className="w-4 h-4 text-white/70" />
            <span className="text-white/70 text-sm">Last updated: {lastUpdatedFormatted}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
    </div>
  );
}