'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Teams', href: '/teams' },
    { name: 'Players', href: '/players' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Matches', href: '/matches' },
  ];

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [menuOpen]);

  const handleSignOut = async () => {
    try {
      console.log('Signing out...'); // Debug log
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  if (!mounted) {
    return (
      <nav className="fixed w-full top-0 z-50 bg-slate-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-green-100 to-green-200">
                Fantasy
              </span>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-300">
                Edge
              </span>
            </Link>
            <button className="lg:hidden p-3">
              <Menu size={24} className="text-white" />
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-700 ease-out ${
        scrolled ? 'bg-slate-900/95 backdrop-blur-sm' : ''
      }`}
    >
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-400/60 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center lg:grid lg:grid-cols-3 lg:justify-items-center">
          {/* Logo */}
          {/* <div className="relative group lg:justify-self-start">
            <div className="absolute -inset-2 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500 pointer-events-none"></div>
            <Link
              href="/"
              className="relative z-10 flex items-center space-x-3 px-4 py-2 rounded-lg bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-green-400/20 hover:border-green-400/40 transition-all duration-300"
            >
              <span className="text-2xl font-black bg-gradient-to-r from-white via-green-100 to-green-200 bg-clip-text text-transparent tracking-tight">
                Fantasy
              </span>
              <span className="text-2xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-green-300 bg-clip-text text-transparent">
                Edge
              </span>
            </Link>
          </div> */}
             <div className="relative group lg:justify-self-start">
      {/* Animated orbital rings */}
      <div className="absolute -inset-8 opacity-0 group-hover:opacity-100 transition-all duration-1000 pointer-events-none">
        <div className="absolute inset-0 border border-green-400/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
        <div className="absolute inset-2 border border-emerald-400/20 rounded-full animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}></div>
        <div className="absolute inset-4 border border-green-300/10 rounded-full animate-spin" style={{ animationDuration: '16s' }}></div>
      </div>

      {/* Dynamic energy field */}
      <div className="absolute -inset-6 bg-gradient-conic from-green-400/0 via-emerald-500/30 via-green-400/20 via-emerald-300/40 to-green-400/0 rounded-full blur-xl opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-700 pointer-events-none"></div>
      
      {/* Main glow effect */}
      <div className="absolute -inset-4 bg-gradient-radial from-green-400/20 via-emerald-500/10 to-transparent rounded-2xl blur-2xl opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500 pointer-events-none"></div>

      <Link
        href="/"
        className="relative z-20 flex items-center space-x-1 px-6 py-3 rounded-2xl backdrop-blur-xl border border-white/10 hover:border-green-400/30 transition-all duration-500 group-hover:scale-105 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 50%, rgba(15, 23, 42, 0.9) 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(34, 197, 94, 0.1)'
        }}
      >
        {/* Animated background mesh */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 via-transparent to-emerald-400/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </div>

        {/* Crystal-like decorative element */}
        <div className="relative">
          <div className="w-3 h-8 bg-gradient-to-b from-green-400 via-emerald-500 to-green-600 transform rotate-45 rounded-sm opacity-80 group-hover:opacity-100 group-hover:rotate-[50deg] transition-all duration-500" 
               style={{ 
                 clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                 filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))'
               }}>
          </div>
          <div className="absolute inset-0 w-3 h-8 bg-gradient-to-t from-white/40 via-transparent to-transparent transform rotate-45 rounded-sm group-hover:rotate-[50deg] transition-all duration-500" 
               style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }}>
          </div>
        </div>

        {/* Typography with advanced effects */}
        <div className="flex items-baseline space-x-1">
          {/* Fantasy */}
          <div className="relative">
            <span 
              className="text-2xl font-black tracking-tight relative z-10 group-hover:text-white transition-colors duration-300"
              style={{
                fontFamily: '"Playfair Display", "Cinzel", serif',
                background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 30%, #dcfce7 60%, #bbf7d0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
                letterSpacing: '0.02em'
              }}
            >
              𝔉𝔞𝔫𝔱𝔞𝔰𝔶
            </span>
            {/* Subtle underline animation */}
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-700"></div>
          </div>

          {/* Elegant separator */}
          <div className="flex flex-col items-center justify-center h-8 mx-2">
            <div className="w-px h-6 bg-gradient-to-b from-transparent via-green-400/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-1 h-1 bg-green-400 rounded-full mt-1 opacity-60 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300"></div>
          </div>

          {/* Edge */}
          <div className="relative">
            <span 
              className="text-2xl font-black tracking-wide relative z-10"
              style={{
                fontFamily: '"Orbitron", "Exo 2", monospace',
                background: 'linear-gradient(135deg, #22c55e 0%, #10b981 25%, #059669 50%, #047857 75%, #065f46 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 15px rgba(34, 197, 94, 0.5)',
                letterSpacing: '0.05em',
                transform: 'perspective(100px) rotateX(5deg)'
              }}
            >
              ΞDGΞ
            </span>
            {/* Holographic effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span 
                className="text-2xl font-black tracking-wide blur-sm"
                style={{
                  fontFamily: '"Orbitron", "Exo 2", monospace',
                  background: 'linear-gradient(45deg, #22c55e, #10b981, #22c55e)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '0.05em'
                }}
              >
                ΞDGΞ
              </span>
            </div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute top-2 left-8 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-3 right-6 w-0.5 h-0.5 bg-emerald-300 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-4 right-8 w-1.5 h-1.5 bg-green-300/60 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        {/* Edge highlight */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
             style={{ 
               background: 'linear-gradient(135deg, transparent 0%, rgba(34, 197, 94, 0.1) 50%, transparent 100%)',
               border: '1px solid transparent',
               backgroundClip: 'padding-box'
             }}>
        </div>
      </Link>

      {/* Ambient glow dots */}
      <div className="absolute -top-2 -left-2 w-2 h-2 bg-green-400/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500" style={{ animationDelay: '0.2s' }}></div>
      <div className="absolute -bottom-2 -right-2 w-1.5 h-1.5 bg-emerald-400/50 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500" style={{ animationDelay: '0.8s' }}></div>
      <div className="absolute top-0 -right-1 w-1 h-1 bg-green-300/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500" style={{ animationDelay: '1.2s' }}></div>
    </div>
  

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center space-x-0">
            {navLinks.map((link, index) => (
              <div key={link.name} className="relative group">
                <Link
                  href={link.href}
                  className="relative px-4 py-2 text-base font-bold text-white/90 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/5 flex items-center space-x-1 group tracking-wide font-mono"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    fontFamily: '"Orbitron", "Rajdhani", "Exo 2", monospace',
                    textShadow: "0 0 10px rgba(34, 197, 94, 0.3)",
                  }}
                >
                  <span className="relative z-10 uppercase tracking-wider font-extrabold text-shadow-sm">
                    {link.name}
                  </span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/0 via-green-400/0 to-green-400/0 group-hover:from-green-400/10 group-hover:via-green-400/20 group-hover:to-green-400/10 transition-all duration-500 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full group-hover:left-0 transition-all duration-500 rounded-full pointer-events-none"></div>
                </Link>
              </div>
            ))}
          </div>

          {/* Auth Buttons - FIXED */}
          <div className="hidden lg:flex lg:justify-self-end items-center gap-x-3">
            {/* Background glow effect */}
            <div className="absolute -inset-1 bg-black rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300 animate-pulse pointer-events-none"></div>
            
            {user ? (
              <button
                onClick={handleSignOut}
                className="relative z-20 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-400/25 uppercase tracking-wider cursor-pointer"
                style={{
                  fontFamily: '"Orbitron", "Rajdhani", "Exo 2", monospace',
                  textShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                }}
              >
                LOGOUT
              </button>
            ) : (
              <Link 
                href="/login" 
                className="relative z-20 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-400/25 uppercase tracking-wider cursor-pointer"
                style={{
                  fontFamily: '"Orbitron", "Rajdhani", "Exo 2", monospace',
                  textShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                }}
              >
                LOGIN
              </Link>
            )}

            <Link
              href="/pro"
              className="relative z-20 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-400/25 uppercase tracking-wider cursor-pointer"
              style={{
                fontFamily: '"Orbitron", "Rajdhani", "Exo 2", monospace',
                textShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
              }}
            >
              Get Pro
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden relative z-20 p-3 rounded-xl bg-gradient-to-r from-slate-800/60 to-slate-700/60 border border-green-400/20 hover:border-green-400/40 transition-all duration-300 group cursor-pointer"
          >
            {menuOpen ? (
              <X size={24} className="text-white group-hover:text-green-400 transition-colors duration-300" />
            ) : (
              <Menu size={24} className="text-white group-hover:text-green-400 transition-colors duration-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
          menuOpen ? "max-h-[100vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gradient-to-b from-slate-900/95 to-black/95 backdrop-blur-xl border-t border-green-400/20">
          <div className="max-w-7xl mx-auto px-6 py-6 space-y-2">
            {navLinks.map((link, index) => (
              <div
                key={link.name}
                className={`transition-all duration-300 ${
                  menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Link
                  href={link.href}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-green-400/10 hover:to-emerald-400/10 transition-all duration-300 border border-transparent hover:border-green-400/20"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="font-bold uppercase tracking-normal">
                    {link.name}
                  </span>
                  <ChevronDown size={16} className="text-green-400/60" />
                </Link>
              </div>
            ))}

            <div className={`pt-4 transition-all duration-500 ${
              menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}>
              {user ? (
                <button
                  onClick={() => {
                    handleSignOut();
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-400/25 uppercase tracking-wider cursor-pointer"
                >
                  LOGOUT
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-400/25 uppercase tracking-wider text-center cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                >
                  LOGIN
                </Link>
              )}

              <Link
                href="/pro"
                className="block w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-400/25 uppercase tracking-wider text-center mt-3 cursor-pointer"
                onClick={() => setMenuOpen(false)}
              >
                Get Pro Access
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-96 h-20 bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-green-400/20 blur-3xl opacity-30 pointer-events-none"></div>
    </nav>
  );
};

export default Navbar;