import React from 'react';
import { motion } from 'motion/react';
import {
  Trophy,
  Star,
  Printer,
  RotateCcw,
  BookOpen,
  Home,
  Award,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { LevelId, LevelProgress, PlayerProfile } from '../types/game';
import { calculatePredicate } from '../utils/storage';
import { DetectiveByte } from './DetectiveByte';
import { RobiAssistant } from './RobiAssistant';
import { TeacherFlameBadge } from './TeacherFlameBadge';
import { audio } from '../utils/audio';

interface VictoryModalProps {
  player: PlayerProfile;
  levels: Record<LevelId, LevelProgress>;
  totalScore: number;
  totalStars: number;
  onPlayAgain: () => void;
  onOpenLearningHub: () => void;
  onBackToMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  player,
  levels,
  totalScore,
  totalStars,
  onPlayAgain,
  onOpenLearningHub,
  onBackToMenu,
}) => {
  const predicate = calculatePredicate(totalScore);

  const handlePrint = () => {
    audio.playClick();
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Printable Certificate Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="print-card relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-yellow-500/60 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden"
      >
        {/* Floating Confetti and Gold Sparkles Background */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center space-y-6">
          {/* Trophy Header */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-yellow-500 to-amber-600 p-0.5 shadow-2xl shadow-yellow-500/30 flex items-center justify-center mb-3">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                <Trophy className="w-10 h-10 text-yellow-400 animate-bounce" />
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest block mb-1">
              SERTIFIKAT KELULUSAN RESMI // DIGITAL ACADEMY
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-display">
              SELAMAT, MISI BERHASIL DISELESAIKAN!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-1">
              Diberikan kepada detektif muda berprestasi yang telah berhasil menuntaskan seluruh tantangan aplikasi perkantoran dengan gemilang.
            </p>
          </div>

          {/* Character Celebration Row */}
          <div className="no-print flex justify-center py-1">
            <DetectiveByte mood="victory" size="md" showBadge={true} />
          </div>

          {/* Official Student Report Badge */}
          <div className="bg-slate-950/80 border border-yellow-500/40 rounded-2xl p-5 sm:p-6 text-left max-w-2xl mx-auto shadow-inner">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">NAMA PEMAIN</span>
                <strong className="text-white text-sm font-display">{player.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">KELAS</span>
                <strong className="text-white text-sm">{player.grade}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">TOTAL SKOR</span>
                <strong className="text-cyan-400 text-sm font-mono font-bold">
                  {totalScore} / 500 Poin
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">TOTAL BINTANG</span>
                <strong className="text-yellow-400 text-sm font-mono font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  {totalStars} / 15
                </strong>
              </div>
            </div>

            {/* Level Score Breakdown Table */}
            <div className="py-4 border-b border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Rincian Skor Per Level Misi:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {[1, 2, 3, 4, 5].map((lvl) => {
                  const p = levels[lvl as LevelId];
                  return (
                    <div
                      key={lvl}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-center"
                    >
                      <span className="text-[10px] text-slate-400 block">Level {lvl}</span>
                      <strong className="text-cyan-300 font-mono text-xs block">
                        {p?.score || 0} Poin
                      </strong>
                      <span className="text-yellow-400 text-[10px]">
                        {'★'.repeat(p?.stars || 0)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Predicate Banner */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-slate-400 block uppercase">
                  PREDIKAT DETEKTIF DIGITAL
                </span>
                <span className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 font-display">
                  {predicate}
                </span>
              </div>
              <div className="text-right text-[11px] text-slate-500 font-mono">
                Tanggal: {new Date().toLocaleDateString('id-ID')}
              </div>
            </div>

            {/* Teacher Endorsement Signature Block */}
            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-slate-400 block uppercase mb-1">
                  Mengetahui & Memvalidasi:
                </span>
                <TeacherFlameBadge size="sm" showLabel={true} />
              </div>
              <div className="text-center sm:text-right">
                <span className="text-[11px] text-slate-400 block">Verifikasi Pendidik</span>
                <div className="text-xs font-mono italic text-amber-300 font-bold border-b border-dashed border-amber-500/40 pb-1 mt-1 inline-block">
                  Digital Academy SMP VIII Verified ✓
                </div>
              </div>
            </div>
          </div>

          <div className="no-print">
            <RobiAssistant
              type="success"
              explanation={`Luar biasa, Agen ${player.name}! Kamu dianugerahi predikat "${predicate}". Guru pengajar Informasimu dapat mencetak sertifikat ini sebagai bukti penilaian praktikum.`}
            />
          </div>

          {/* Action Buttons (Hidden on Print) */}
          <div className="no-print pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-yellow-500/25 transition-transform hover:scale-105"
            >
              <Printer className="w-4 h-4" />
              <span>CETAK HASIL / SIMPAN PDF</span>
            </button>

            <button
              onClick={() => {
                audio.playClick();
                onPlayAgain();
              }}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>MAIN LAGI</span>
            </button>

            <button
              onClick={() => {
                audio.playClick();
                onOpenLearningHub();
              }}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors border border-slate-700"
            >
              <BookOpen className="w-4 h-4" />
              <span>LIHAT MATERI</span>
            </button>

            <button
              onClick={() => {
                audio.playClick();
                onBackToMenu();
              }}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors border border-slate-800"
            >
              <Home className="w-4 h-4" />
              <span>KEMBALI KE MENU</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
