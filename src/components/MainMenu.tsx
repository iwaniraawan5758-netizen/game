import React from 'react';
import { motion } from 'motion/react';
import {
  Play,
  BookOpen,
  HelpCircle,
  Settings,
  Info,
  Users,
  Compass,
  Sparkles,
} from 'lucide-react';
import { DetectiveByte } from './DetectiveByte';
import { TeacherFlameBadge } from './TeacherFlameBadge';
import { audio } from '../utils/audio';

interface MainMenuProps {
  onStartAdventure: () => void;
  onOpenGuide: () => void;
  onOpenLearningHub: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onOpenTeacherDashboard: () => void;
  hasExistingPlayer: boolean;
  playerName?: string;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartAdventure,
  onOpenGuide,
  onOpenLearningHub,
  onOpenSettings,
  onOpenAbout,
  onOpenTeacherDashboard,
  hasExistingPlayer,
  playerName,
}) => {
  const handleClick = (action: () => void) => {
    audio.playClick();
    action();
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-8 overflow-hidden bg-slate-950">
      {/* Animated Cyber Grid & Tech Floating Particles */}
      <div className="absolute inset-0 bg-[radial-gradient(#0284c718_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Character & Mascot Showcase */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 flex flex-col items-center justify-center"
        >
          <DetectiveByte
            size="lg"
            mood="idle"
            speechText={
              hasExistingPlayer && playerName
                ? `Halo lagi, Agen ${playerName}! Siap melanjutkan misi kita di Digital Academy?`
                : 'Halo, calon detektif! Mari kita jelajahi aplikasi perkantoran dan pecahkan rahasia digital!'
            }
          />
        </motion.div>

        {/* Right Column: Title, Tagline & Main Menu Buttons */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          {/* Badge & Title */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>INFORMATIKA SMP KELAS VIII</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight leading-tight">
            MISI DETEKTIF <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">DIGITAL</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium mt-1 mb-4 max-w-xl">
            Belajar Teknologi, Pecahkan Misi, Jadi Detektif Digital!
          </p>

          {/* Teacher Flame Badge with Slanted Informatics Font & Fire Effect */}
          <div className="mb-6 w-full flex justify-center lg:justify-start">
            <TeacherFlameBadge size="md" showLabel={true} />
          </div>

          {/* Menu Actions Grid */}
          <div className="w-full max-w-md space-y-3">
            {/* Primary Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleClick(onStartAdventure)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base sm:text-lg shadow-xl shadow-cyan-500/25 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Play className="w-5 h-5 fill-white text-white" />
                </div>
                <div className="text-left">
                  <div className="leading-tight">
                    {hasExistingPlayer ? 'LANJUTKAN PETUALANGAN' : 'MULAI PETUALANGAN'}
                  </div>
                  <span className="text-xs text-cyan-100 font-normal">
                    {hasExistingPlayer ? `Lanjutkan sebagai ${playerName}` : 'Mulai dari Misi 1'}
                  </span>
                </div>
              </div>
              <Compass className="w-5 h-5 text-cyan-100 group-hover:rotate-45 transition-transform" />
            </motion.button>

            {/* Secondary Buttons Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => handleClick(onOpenGuide)}
                className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 text-slate-200 text-sm font-semibold flex items-center gap-2.5 transition-all shadow-sm"
              >
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">Panduan Game</span>
              </button>

              <button
                onClick={() => handleClick(onOpenLearningHub)}
                className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 text-slate-200 text-sm font-semibold flex items-center gap-2.5 transition-all shadow-sm"
              >
                <BookOpen className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="truncate">Materi Belajar</span>
              </button>

              <button
                onClick={() => handleClick(onOpenSettings)}
                className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 text-slate-200 text-sm font-semibold flex items-center gap-2.5 transition-all shadow-sm"
              >
                <Settings className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">Pengaturan</span>
              </button>

              <button
                onClick={() => handleClick(onOpenAbout)}
                className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 text-slate-200 text-sm font-semibold flex items-center gap-2.5 transition-all shadow-sm"
              >
                <Info className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="truncate">Tentang Game</span>
              </button>
            </div>

            {/* Teacher Dashboard Access */}
            <button
              onClick={() => handleClick(onOpenTeacherDashboard)}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-indigo-950/40 hover:bg-indigo-950/70 border border-indigo-800/40 text-indigo-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Akses Khusus Guru: Rekap Nilai Siswa & Ekspor CSV</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
