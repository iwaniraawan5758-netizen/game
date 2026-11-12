import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, ArrowRight, Zap, Play } from 'lucide-react';
import { TeacherFlameBadge } from './TeacherFlameBadge';
import { audio } from '../utils/audio';

interface IntroCinematicProps {
  onStart: () => void;
  onSkip: () => void;
}

export const IntroCinematic: React.FC<IntroCinematicProps> = ({ onStart, onSkip }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Step progression for cinematic feel
    const t1 = setTimeout(() => setStep(1), 700); // Logo zoom & title
    const t2 = setTimeout(() => setStep(2), 2200); // Detective Byte entrance
    const t3 = setTimeout(() => setStep(3), 3600); // Story dispatch
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleStartMission = () => {
    audio.playLevelUnlock();
    audio.startMusic();
    onStart();
  };

  const handleSkip = () => {
    audio.playClick();
    audio.startMusic();
    onSkip();
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-8 overflow-hidden bg-radial from-slate-900 via-slate-950 to-black">
      {/* Background Cyber Grid & Floating Lights */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#082f4915_1px,transparent_1px),linear-gradient(to_bottom,#082f4915_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Skip button top right */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs text-slate-400 hover:text-white transition-colors z-30"
      >
        Lewati Intro
      </button>

      <div className="relative z-10 max-w-3xl w-full flex flex-col items-center text-center">
        {/* Phase 1: Academy Logo & Alert */}
        <AnimatePresence>
          {step >= 1 && (
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="mb-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-semibold mb-3">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>PESAN RAHASIA DARI DIGITAL ACADEMY</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 font-display tracking-tight leading-tight">
                MISI DETEKTIF DIGITAL
              </h1>
              <p className="text-sm sm:text-base font-medium text-cyan-200/80 mt-1">
                Petualangan Menjelajahi Aplikasi Perkantoran
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 2: Character Entrance & Briefing */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-4 w-full">
          {step >= 2 && (
            <motion.div
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, type: 'spring' }}
              className="md:col-span-5 flex flex-col items-center"
            >
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/20 bg-slate-900">
                <img
                  src="/src/assets/images/detective_byte_hero_1794457671342.jpg"
                  alt="Detektif Byte"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 py-1 text-[11px] text-cyan-300 font-mono text-center border-t border-cyan-500/30">
                  AGEN BYTE // SIAGA MISI
                </div>
              </div>
            </motion.div>
          )}

          {step >= 3 && (
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="md:col-span-7 text-left bg-slate-900/90 border border-cyan-800/60 rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center gap-2 mb-2 text-cyan-400 text-xs font-bold font-mono">
                <Zap className="w-3.5 h-3.5" /> BRIEFING MISI UTAMA
              </div>
              <p className="text-sm md:text-base text-slate-200 leading-relaxed space-y-2">
                <strong className="text-cyan-300 font-semibold block mb-1">
                  Selamat datang, Agen Digital!
                </strong>
                Pusat teknologi <span className="text-sky-300 font-medium">Digital Academy</span> sedang
                mengalami gangguan darurat. Dokumen hilang, tabel berpindah tempat, gambar tidak tersusun,
                dan sistem pengolahan dokumen perkantoran menjadi berantakan!
              </p>
              <p className="text-xs md:text-sm text-slate-400 mt-2">
                Kamu adalah detektif terpilih untuk menguasai <strong className="text-white">Copy, Cut, Paste</strong>,
                menangkap layar dengan <strong className="text-white">Screenshot & Snipping Tool</strong>, membedah objek dokumen,
                hingga menaklukkan <strong className="text-white">Kastil Final Boss</strong>!
              </p>

              <div className="mt-4 pt-3 border-t border-cyan-800/40 flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] text-cyan-300 font-mono">Pendidik & Pembimbing:</span>
                <TeacherFlameBadge size="sm" showLabel={false} />
              </div>
            </motion.div>
          )}
        </div>

        {/* Phase 3: Start Mission CTA */}
        {step >= 3 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex flex-col sm:flex-row items-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              animate={{ boxShadow: ['0 0 0 0 rgba(6,182,212,0.4)', '0 0 0 16px rgba(6,182,212,0)'] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              onClick={handleStartMission}
              className="px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/25 flex items-center gap-3 text-base sm:text-lg group"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>MULAI MISI SEKARANG</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
