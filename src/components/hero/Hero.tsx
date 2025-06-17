'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Sphere, 
  Box, 
  Cylinder,
  Text,
  Environment,
  Float,
  Sparkles,
  Stars,
  Cloud
} from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Animated Football with realistic texture and spin
function AnimatedFootball({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null); // Fixed: Added proper TypeScript type
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.02;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      if (hovered) {
        meshRef.current.scale.setScalar(1.1 + Math.sin(state.clock.elapsedTime * 3) * 0.05);
      }
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
      <Sphere
        ref={meshRef}
        args={[0.15, 32, 32]}
        position={position}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.3}
          metalness={0.1}
        />
        {/* Football pattern lines */}
        <Cylinder args={[0.151, 0.151, 0.02, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#000000" />
        </Cylinder>
        <Cylinder args={[0.151, 0.151, 0.02, 32]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#000000" />
        </Cylinder>
      </Sphere>
    </Float>
  );
}

// Dynamic Football Field
function FootballField() {
  const fieldRef = useRef<THREE.Group>(null); // Fixed: Added proper TypeScript type
  
  return (
    <group ref={fieldRef} position={[0, -2, 0]}>
      {/* Main field */}
      <Box args={[8, 0.1, 12]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#2d5016" roughness={0.8} />
      </Box>
      
      {/* Field lines */}
      <Box args={[8.2, 0.11, 0.1]} position={[0, 0.01, 6]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <Box args={[8.2, 0.11, 0.1]} position={[0, 0.01, -6]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <Box args={[0.1, 0.11, 12.2]} position={[4, 0.01, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <Box args={[0.1, 0.11, 12.2]} position={[-4, 0.01, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      
      {/* Center circle */}
      <Cylinder args={[1.5, 1.5, 0.11, 32]} position={[0, 0.01, 0]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
      </Cylinder>
      
      {/* Goals */}
      <group position={[0, 0.5, 6.5]}>
        <Box args={[2, 1, 0.1]}>
          <meshStandardMaterial color="#ffffff" />
        </Box>
        <Box args={[0.1, 1, 0.5]} position={[-1, 0, -0.25]}>
          <meshStandardMaterial color="#ffffff" />
        </Box>
        <Box args={[0.1, 1, 0.5]} position={[1, 0, -0.25]}>
          <meshStandardMaterial color="#ffffff" />
        </Box>
      </group>
      
      <group position={[0, 0.5, -6.5]}>
        <Box args={[2, 1, 0.1]}>
          <meshStandardMaterial color="#ffffff" />
        </Box>
        <Box args={[0.1, 1, 0.5]} position={[-1, 0, 0.25]}>
          <meshStandardMaterial color="#ffffff" />
        </Box>
        <Box args={[0.1, 1, 0.5]} position={[1, 0, 0.25]}>
          <meshStandardMaterial color="#ffffff" />
        </Box>
      </group>
    </group>
  );
}

// Animated Player Figures
function PlayerFigure({ position, color, delay = 0 }: { 
  position: [number, number, number]; 
  color: string; 
  delay?: number; 
}) {
  const playerRef = useRef<THREE.Group>(null); // Fixed: Added proper TypeScript type
  
  useFrame((state) => {
    if (playerRef.current) {
      playerRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * 1.5 + delay) * 0.3;
      playerRef.current.rotation.y = Math.sin(state.clock.elapsedTime + delay) * 0.1;
    }
  });
  
  return (
    <group ref={playerRef} position={position}>
      {/* Body */}
      <Cylinder args={[0.08, 0.1, 0.3]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color={color} />
      </Cylinder>
      {/* Head */}
      <Sphere args={[0.06]} position={[0, 0.36, 0]}>
        <meshStandardMaterial color="#ffdbac" />
      </Sphere>
      {/* Arms */}
      <Cylinder args={[0.03, 0.03, 0.2]} position={[-0.12, 0.2, 0]} rotation={[0, 0, Math.PI/6]}>
        <meshStandardMaterial color={color} />
      </Cylinder>
      <Cylinder args={[0.03, 0.03, 0.2]} position={[0.12, 0.2, 0]} rotation={[0, 0, -Math.PI/6]}>
        <meshStandardMaterial color={color} />
      </Cylinder>
      {/* Legs */}
      <Cylinder args={[0.04, 0.04, 0.25]} position={[-0.05, -0.12, 0]}>
        <meshStandardMaterial color="#000033" />
      </Cylinder>
      <Cylinder args={[0.04, 0.04, 0.25]} position={[0.05, -0.12, 0]}>
        <meshStandardMaterial color="#000033" />
      </Cylinder>
    </group>
  );
}

// Particle Goal Effect
function GoalExplosion({ trigger }: { trigger: boolean }) {
  const particlesRef = useRef<THREE.Group>(null); // Fixed: Added proper TypeScript type
  const [particles] = useState(() => {
    const temp = [];
    for (let i = 0; i < 50; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 2,
          Math.random() * 2,
          (Math.random() - 0.5) * 2
        ] as [number, number, number],
        velocity: [
          (Math.random() - 0.5) * 0.1,
          Math.random() * 0.1,
          (Math.random() - 0.5) * 0.1
        ],
        life: Math.random()
      });
    }
    return temp;
  });
  
  useFrame(() => {
    if (trigger && particlesRef.current) {
      particles.forEach((particle) => {
        particle.position[0] += particle.velocity[0];
        particle.position[1] += particle.velocity[1];
        particle.position[2] += particle.velocity[2];
        particle.life -= 0.01;
        
        if (particle.life <= 0) {
          particle.position = [0, 1, 6];
          particle.life = 1;
        }
      });
    }
  });
  
  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <Sphere key={i} args={[0.02]} position={particle.position}>
          <meshStandardMaterial 
            color="#ffff00" 
            emissive="#ffff00"
            emissiveIntensity={particle.life}
            transparent
            opacity={particle.life}
          />
        </Sphere>
      ))}
    </group>
  );
}

// Stadium Lights
function StadiumLights() {
  return (
    <>
      <spotLight
        position={[-5, 8, 5]}
        angle={0.6}
        penumbra={0.5}
        intensity={1}
        castShadow
        color="#ffffff"
      />
      <spotLight
        position={[5, 8, 5]}
        angle={0.6}
        penumbra={0.5}
        intensity={1}
        castShadow
        color="#ffffff"
      />
      <spotLight
        position={[-5, 8, -5]}
        angle={0.6}
        penumbra={0.5}
        intensity={1}
        castShadow
        color="#ffffff"
      />
      <spotLight
        position={[5, 8, -5]}
        angle={0.6}
        penumbra={0.5}
        intensity={1}
        castShadow
        color="#ffffff"
      />
    </>
  );
}

// Main 3D Scene
function FootballScene() {
  const [goalScored, setGoalScored] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setGoalScored(true);
      setTimeout(() => setGoalScored(false), 2000);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <>
      <StadiumLights />
      <ambientLight intensity={0.3} />
      
      {/* Stadium atmosphere */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Cloud opacity={0.1} speed={0.4} scale={[10, 1.5, 10]} segments={20} />
      
      {/* Football Field */}
      <FootballField />
      
      {/* Animated Players */}
      <PlayerFigure position={[-2, -1.7, 2]} color="#ff0000" delay={0} />
      <PlayerFigure position={[1, -1.7, 1]} color="#0000ff" delay={1} />
      <PlayerFigure position={[-1, -1.7, -2]} color="#ff0000" delay={2} />
      <PlayerFigure position={[2, -1.7, -1]} color="#0000ff" delay={3} />
      
      {/* Multiple floating footballs */}
      <AnimatedFootball position={[0, 1, 3]} />
      <AnimatedFootball position={[-2, 2, 0]} />
      <AnimatedFootball position={[3, 1.5, -2]} />
      
      {/* Sparkle effects */}
      <Sparkles count={100} scale={[10, 10, 10]} size={2} speed={0.4} color="#00ff00" />
      
      {/* Goal explosion effect */}
      <GoalExplosion trigger={goalScored} />
      
      {/* 3D Text */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Text
          position={[0, 3, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          FOOTBALL ANALYTICS
        </Text>
      </Float>
      
      <Environment preset="night" />
    </>
  );
}

// Camera Animation Controller
function CameraController() {
  const { camera } = useThree();
  
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.5;
    camera.position.x = Math.sin(t) * 2;
    camera.position.y = 2 + Math.sin(t * 0.5) * 0.5;
    camera.position.z = 8 + Math.cos(t) * 1;
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => { // Fixed: Added proper TypeScript type
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-green-900/20 to-black pt-20 md:pt-24">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <div
              key={i}
              className="border border-green-400/20 animate-pulse"
              style={{
                animationDelay: `${i * 10}ms`,
                animationDuration: '3s'
              }}
            />
          ))}
        </div>
      </div>
      
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-10">
        <Canvas
          shadows
          camera={{ position: [0, 2, 8], fov: 75 }}
          style={{ background: 'transparent' }}
        >
          <CameraController />
          <FootballScene />
        </Canvas>
      </div>
      
      {/* Hero Content Overlay */}
      <div className="relative z-20 flex items-center justify-between h-full px-6 md:px-12">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <span className="bg-gradient-to-r from-white via-green-100 to-emerald-200 bg-clip-text text-transparent">
              Next-Gen
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-300 bg-clip-text text-transparent">
              Football
            </span>
            <br />
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
              Analytics
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 font-medium leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Experience football like never before with immersive 3D analytics,
            real-time player tracking, and AI-powered insights.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
              <button className="relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-400/25 text-lg">
                Enter the Field →
              </button>
            </div>
            
            <button className="px-8 py-4 bg-transparent border-2 border-white/20 hover:border-green-400/60 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-white/5 text-lg">
              Watch Demo
            </button>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            className="flex gap-8 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            <div className="text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                1M+
              </div>
              <div className="text-gray-400 text-sm">Matches Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                50K+
              </div>
              <div className="text-gray-400 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                99.9%
              </div>
              <div className="text-gray-400 text-sm">Accuracy</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Floating elements */}
      <motion.div
        className="absolute top-20 right-20 w-2 h-2 bg-green-400 rounded-full opacity-60"
        animate={{
          x: mousePosition.x * 20,
          y: mousePosition.y * 20,
        }}
        transition={{ type: "spring", stiffness: 50 }}
      />
      <motion.div
        className="absolute bottom-40 left-20 w-3 h-3 bg-blue-400 rounded-full opacity-40"
        animate={{
          x: mousePosition.x * -15,
          y: mousePosition.y * -15,
        }}
        transition={{ type: "spring", stiffness: 30 }}
      />
    </section>
  );
}