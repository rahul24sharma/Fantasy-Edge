'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Calendar, 
  Target, 
  Crown,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Award,
  Clock,
  Filter,
  Sparkles,
  Star,
  Zap,
  BarChart3,
  Activity
} from 'lucide-react';
import * as THREE from 'three';

interface Season {
  id: string;
  startDate?: string;
  endDate?: string;
  startDateFormatted?: string;
  endDateFormatted?: string;
  currentMatchday?: number;
  winner?: {
    crest: string;
    name: string;
    shortName?: string;
  };
}

interface RecentSeasonsTableProps {
  seasons: Season[];
}

export default function RecentSeasonsTable({ seasons }: RecentSeasonsTableProps) {
  const [sortBy, setSortBy] = useState<string>('season');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!threeRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(threeRef.current.offsetWidth, threeRef.current.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    threeRef.current.appendChild(renderer.domElement);

    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 50;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.6
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.002;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (threeRef.current && renderer.domElement) {
        threeRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Intersection Observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getSortedSeasons = () => {
    return [...seasons].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'season':
          aValue = parseInt(a.startDate?.split('-')[0] || '0');
          bValue = parseInt(b.startDate?.split('-')[0] || '0');
          break;
        case 'matchday':
          aValue = a.currentMatchday || 0;
          bValue = b.currentMatchday || 0;
          break;
        case 'winner':
          aValue = a.winner?.name || '';
          bValue = b.winner?.name || '';
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  };

  const tableHeaders = [
    { key: 'season', label: 'Season', icon: Calendar, gradient: 'from-blue-500 to-cyan-500' },
    { key: 'dates', label: 'Duration', icon: Clock, gradient: 'from-purple-500 to-pink-500' },
    { key: 'matchday', label: 'Matchday', icon: Target, gradient: 'from-green-500 to-emerald-500' },
    { key: 'winner', label: 'Champion', icon: Crown, gradient: 'from-yellow-500 to-orange-500' }
  ];

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden rounded-3xl mb-12 group"
      style={{
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.95)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Three.js Background */}
      <div 
        ref={threeRef}
        className="absolute inset-0 opacity-30"
        style={{ pointerEvents: 'none' }}
      />

      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900">
        {/* Interactive cursor glow */}
        <div
          className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl transition-all duration-300 ease-out pointer-events-none"
          style={{
            transform: `translate(${mousePosition.x - 192}px, ${mousePosition.y - 192}px)`,
          }}
        />
        
        {/* Floating orbs */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 blur-xl animate-pulse"
            style={{
              width: `${20 + i * 8}px`,
              height: `${20 + i * 8}px`,
              left: `${(i * 7 + 10) % 90}%`, // Fixed positioning
              top: `${(i * 11 + 5) % 80}%`,  // Fixed positioning
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        {/* Premium Header */}
        <div 
          className="flex items-center justify-between mb-8"
          style={{
            transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s'
          }}
        >
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-2xl">
                <Trophy className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Championship History
              </h2>
              <p className="text-white/80 text-lg mt-1">Premium analytics & insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30 hover:scale-105 hover:border-white/50 transition-all duration-300 group">
              <Activity className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
              <span className="text-white font-bold">{seasons.length}</span>
              <span className="text-white/70">Seasons</span>
            </div>
            
            <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30 hover:scale-105 hover:border-white/50 transition-all duration-300 group">
              <BarChart3 className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
              <span className="text-white/70">Live Data</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Premium Table Container */}
        <div 
          className="overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl"
          style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s'
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Enhanced Table Header */}
              <thead className="bg-white/10 backdrop-blur-md">
                <tr className="border-b border-white/20">
                  {tableHeaders.map((header, index) => (
                    <th
                      key={header.key}
                      className="px-8 py-6 text-left cursor-pointer group hover:bg-white/10 transition-all duration-500 relative overflow-hidden"
                      onClick={() => handleSort(header.key)}
                      style={{
                        transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
                        opacity: isVisible ? 1 : 0,
                        transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${0.1 * index}s`
                      }}
                    >
                      {/* Header hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                           style={{ background: `linear-gradient(135deg, ${header.gradient.split(' ')[1]}, ${header.gradient.split(' ')[3]})` }}>
                      </div>
                      
                      <div className="relative flex items-center gap-4">
                        <div className={`p-3 bg-gradient-to-r ${header.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <header.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-white font-bold text-lg tracking-wide group-hover:text-blue-200 transition-colors duration-300">
                            {header.label}
                          </span>
                          <div className="flex items-center gap-1 mt-1">
                            <ChevronUp 
                              className={`w-4 h-4 transition-all duration-300 ${
                                sortBy === header.key && sortOrder === 'asc' 
                                  ? 'text-blue-400 scale-125' 
                                  : 'text-white/40'
                              }`} 
                            />
                            <ChevronDown 
                              className={`w-4 h-4 transition-all duration-300 ${
                                sortBy === header.key && sortOrder === 'desc' 
                                  ? 'text-blue-400 scale-125' 
                                  : 'text-white/40'
                              }`} 
                            />
                          </div>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Enhanced Table Body */}
              <tbody className="divide-y divide-white/10">
                {getSortedSeasons().map((season, index) => (
                  <tr
                    key={season.id}
                    className="group hover:bg-gradient-to-r hover:from-blue-500/10 hover:via-purple-500/10 hover:to-pink-500/10 transition-all duration-500"
                    style={{
                      transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
                      opacity: isVisible ? 1 : 0,
                      transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${0.6 + index * 0.05}s`
                    }}
                    onMouseEnter={() => setHoveredRow(season.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    
                    {/* Season Column */}
                    <td className="px-8 py-8 relative">
                      <div className="flex items-center gap-4 group-hover:scale-105 group-hover:translate-x-2 transition-all duration-300">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                            <Calendar className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div>
                          <div className="font-black text-white text-2xl">
                            {season.startDate?.split('-')[0] || 'N/A'}/
                            {season.endDate?.split('-')[0] || 'N/A'}
                          </div>
                          <div className="text-blue-300 text-sm font-medium">Season Period</div>
                        </div>
                      </div>
                    </td>

                    {/* Dates Column */}
                    <td className="px-8 py-8 relative">
                      <div className="space-y-2">
                        <div className="text-white font-bold text-lg">
                          {season.startDateFormatted || 'N/A'}
                        </div>
                        <div className="text-white/70 text-base">
                          to {season.endDateFormatted || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-purple-300 text-sm">
                          <Clock className="w-4 h-4" />
                          Full Season
                        </div>
                      </div>
                    </td>

                    {/* Matchday Column */}
                    <td className="px-8 py-8 relative">
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30 hover:scale-110 hover:border-white/50 transition-all duration-300">
                          <Target className="w-6 h-6 text-green-400" />
                          <div>
                            <div className="text-white font-black text-xl">
                              {season.currentMatchday ?? 'N/A'}
                            </div>
                            <div className="text-green-300 text-xs">Current MD</div>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Winner Column */}
                    <td className="px-8 py-8 relative">
                      {season.winner ? (
                        <div className="flex items-center gap-6 group-hover:scale-105 group-hover:translate-x-2 transition-all duration-300">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                            <div className="relative w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/30 p-2 hover:rotate-6 hover:scale-110 transition-all duration-300">
                              <img
                                src={season.winner.crest}
                                alt={season.winner.name}
                                className="w-full h-full object-contain filter drop-shadow-lg"
                              />
                            </div>
                            {hoveredRow === season.id && (
                              <div className="absolute -top-2 -right-2 animate-bounce">
                                <div className="p-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                                  <Crown className="w-5 h-5 text-white" />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="font-black text-white text-xl group-hover:text-yellow-200 transition-colors duration-300">
                              {season.winner.shortName || season.winner.name}
                            </div>
                            <div className="flex items-center gap-2 text-yellow-300">
                              <Trophy className="w-4 h-4" />
                              <span className="font-bold">Champion</span>
                              <Sparkles className="w-4 h-4 animate-pulse" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 text-white/60">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/20 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                            <Award className="w-8 h-8" />
                          </div>
                          <div>
                            <div className="font-bold text-lg">To be determined</div>
                            <div className="text-white/40 text-sm">Season in progress</div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div 
          className="mt-8 flex items-center justify-between"
          style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.8s'
          }}
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-white/80">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Displaying {seasons.length} seasons</span>
            </div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="text-white/60">
              Sorted by <span className="text-blue-300 font-semibold">{tableHeaders.find(h => h.key === sortBy)?.label.toLowerCase()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30 hover:scale-105 hover:border-white/50 transition-all duration-300 group">
            <TrendingUp className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
            <span className="text-white font-medium">Analytics Active</span>
            <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}