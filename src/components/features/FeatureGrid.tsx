'use client';

import React, { useState } from 'react';
import { BarChart3, Users, CalendarDays, Search } from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Live Match Stats',
    description: 'Real-time scorelines, possession, xG, and more.',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    hoverGradient: 'from-emerald-300 via-teal-400 to-cyan-500',
  },
  {
    icon: Users,
    title: 'Player Insights',
    description: 'Track player form, ratings, and individual contributions.',
    gradient: 'from-purple-400 via-violet-500 to-indigo-600',
    hoverGradient: 'from-purple-300 via-violet-400 to-indigo-500',
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Search by team, player, league, or match date.',
    gradient: 'from-orange-400 via-red-500 to-pink-600',
    hoverGradient: 'from-orange-300 via-red-400 to-pink-500',
  },
  {
    icon: CalendarDays,
    title: 'Match Schedule',
    description: 'Upcoming fixtures, league tables, and timezones.',
    gradient: 'from-blue-400 via-indigo-500 to-purple-600',
    hoverGradient: 'from-blue-300 via-indigo-400 to-purple-500',
  },
];

export default function FeatureGrid() {
  // Fixed: Properly typed state to allow both number and null
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen px-6 py-20">
      {/* Animated background elements */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80  rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div> */}

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center p-1 mb-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full backdrop-blur-sm border border-white/10">
            <span className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
              Platform Features
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Elegantly Crafted
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Football Analytics
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Experience the future of football analysis with our sophisticated suite of tools designed for the modern game.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const isHovered = hoveredIndex === idx;
            
            return (
              <div
                key={idx}
                className="group relative"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Glow effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-500`}></div>
                
                {/* Main card */}
                <div className="relative p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 group-hover:bg-white/10 group-hover:scale-105 group-hover:shadow-2xl">
                  {/* Icon container */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${isHovered ? feature.hoverGradient : feature.gradient} p-0.5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      <div className="w-full h-full bg-slate-900/50 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    {/* Floating particles */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-ping"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:animate-ping delay-300"></div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 group-hover:bg-clip-text transition-all duration-500">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover line effect */}
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${feature.gradient} transition-all duration-500 ${isHovered ? 'w-full' : 'w-0'}`}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom decorative element */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Crafted with precision</span>
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}