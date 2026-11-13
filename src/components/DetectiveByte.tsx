
import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Search, Laptop, ShieldCheck } from 'lucide-react';
import { CharacterMood } from '../types/game';

// IMPORT GAMBAR KARAKTER
import detectiveHero from '../assets/images/detective_byte_hero_1794457671342.jpg';

interface DetectiveByteProps {
  mood?: CharacterMood;
  speechText?: string;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

export const DetectiveByte: React.FC<DetectiveByteProps> = ({
  mood = 'idle',
  speechText,
  size = 'md',
  showBadge = true,
}) => {
  // Animation variants according to mood
  const moodVariants = {
    idle: {
      y: [0, -6, 0],
      rotate: [0, 0.5, -0.5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
    walking: {
      x: [-5, 5, -5],
      y: [0, -4, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
    jump: {
      y: [0, -28, 0],
      scale: [1, 1.08, 1],
      transition: {
        duration: 0.6,
        repeat: 2,
        ease: 'easeOut' as const,
      },
    },
    victory: {
      y: [0, -12, 0],
      rotate: [0, -3, 3, 0],
      scale: [1, 1.06, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
    shocked: {
      x: [-6, 6, -6, 6, 0],
      scale: [1, 0.96, 1],
      transition: {
        duration: 0.4,
        repeat: 1,
      },
    },
  };

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-44 h-44 md:w-52 md:h-52',
    lg: 'w-64 h-64 md:w-76 md:h-76',
  };

  return (
    <div className="relative flex flex-col items-center">

      {/* Speech Bubble */}
      {speechText && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative mb-3 max-w-sm rounded-2xl bg-gradient-to-r from-slate-900 to-sky-950/90 border border-cyan-500/40 p-3.5 shadow-xl shadow-cyan-950/30 text-slate-100 text-sm leading-relaxed z-20 backdrop-blur-md"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1 font-display">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              Detektif Byte
            </span>
            <span className="text-[10px] text-cyan-200/60 font-mono">
              Agen Utama
            </span>
          </div>

          <p className="text-slate-200 text-xs md:text-sm font-medium">
            {speechText}
          </p>

          {/* Bubble Tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-sky-950 rotate-45 border-r border-b border-cyan-500/40" />
        </motion.div>
      )}

      {/* Main Character Sprite Frame */}
      <motion.div
        variants={moodVariants}
        animate={mood}
        className={`relative ${sizeClasses[size]} rounded-3xl p-1 bg-gradient-to-b from-cyan-400/80 via-blue-600/40 to-slate-900/90 shadow-2xl shadow-cyan-500/20 group`}
      >

        {/* Glowing Aura */}
        <div className="absolute -inset-1 rounded-3xl bg-cyan-400/20 blur-md -z-10 group-hover:bg-cyan-400/30 transition-all duration-300" />

        {/* Character Image Container */}
        <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-slate-950 border border-cyan-400/30 flex items-center justify-center">

          <img
            src={detectiveHero}
            alt="Detektif Byte"
            className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
            draggable={false}
          />

          {/* Holographic Scan Line */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent pointer-events-none opacity-40 animate-pulse" />

          {/* Status Badge */}
          {showBadge && (
            <div className="absolute bottom-1.5 inset-x-2 flex items-center justify-between px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 text-[10px] text-cyan-300 font-mono">
              <span className="flex items-center gap-1">
                <Laptop className="w-3 h-3 text-cyan-400" />
                BYTE
              </span>

              <span className="text-emerald-400 flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" />
                SIAGA
              </span>
            </div>
          )}
        </div>

        {/* Floating Sparks on Victory */}
        {mood === 'victory' && (
          <>
            <motion.div
              animate={{ y: [-10, -25], opacity: [0, 1, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: 0.1,
              }}
              className="absolute -top-3 -right-2 text-yellow-300"
            >
              <Sparkles className="w-5 h-5 drop-shadow" />
            </motion.div>

            <motion.div
              animate={{ y: [-8, -22], opacity: [0, 1, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: 0.4,
              }}
              className="absolute -top-2 -left-2 text-cyan-300"
            >
              <Sparkles className="w-4 h-4 drop-shadow" />
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};
