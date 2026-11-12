import React from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  Star,
  CheckCircle2,
  Play,
  Award,
  ChevronRight,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { LevelId, LevelProgress, PlayerProfile } from '../types/game';
import { GAME_LEVELS } from '../data/gameContent';
import { audio } from '../utils/audio';

interface AdventureMapProps {
  player: PlayerProfile;
  levels: Record<LevelId, LevelProgress>;
  totalScore: number;
  totalStars: number;
  onSelectLevel: (levelId: LevelId) => void;
  onOpenVictory: () => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({
  player,
  levels,
  totalScore,
  totalStars,
  onSelectLevel,
  onOpenVictory,
}) => {
  const completedCount = (Object.values(levels) as LevelProgress[]).filter((l) => l.completed).length;
  const allCompleted = completedCount === 5;

  const missionNodes: {
    id: LevelId;
    icon: string;
    description: string;
    posX: string; // percentage
    posY: string; // percentage
  }[] = [
    {
      id: 1,
      icon: '🧪',
      description: 'Copy, Cut, Paste & Pemindahan Objek',
      posX: '14%',
      posY: '75%',
    },
    {
      id: 2,
      icon: '📸',
      description: 'Screenshot, PrtSc & Snipping Tool',
      posX: '36%',
      posY: '45%',
    },
    {
      id: 3,
      icon: '🔍',
      description: 'Anatomi & Hierarki Objek Dokumen',
      posX: '78%',
      posY: '72%',
    },
    {
      id: 4,
      icon: '🎛️',
      description: 'Pusat Kendali Menu Home & Ribbon',
      posX: '58%',
      posY: '30%',
    },
    {
      id: 5,
      icon: '👑',
      description: 'Ujian Akhir: Kastil Cyber Boss',
      posX: '84%',
      posY: '18%',
    },
  ];

  const handleNodeClick = (levelId: LevelId) => {
    const lvl = levels[levelId];
    if (!lvl.unlocked) {
      audio.playWrong();
      return;
    }
    audio.playClick();
    onSelectLevel(levelId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top HUD Card */}
      <div className="bg-slate-900/90 border border-cyan-800/50 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-cyan-400/40 shrink-0">
            <img
              src="/src/assets/images/detective_byte_hero_1794457671342.jpg"
              alt="Detektif Byte"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                AGEN DETEKTIF
              </span>
              <span className="text-[10px] text-slate-400">({player.grade})</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-display">
              {player.name}
            </h2>
          </div>
        </div>

        {/* Meters */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-center">
            <span className="text-[11px] text-slate-400 uppercase font-medium block">Total Skor</span>
            <div className="flex items-center justify-center gap-1 text-cyan-300 font-bold text-lg font-mono">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>{totalScore}</span>
              <span className="text-xs text-slate-500 font-normal">/ 500</span>
            </div>
          </div>

          <div className="text-center">
            <span className="text-[11px] text-slate-400 uppercase font-medium block">Bintang</span>
            <div className="flex items-center justify-center gap-1 text-yellow-400 font-bold text-lg font-mono">
              <Star className="w-4 h-4 fill-yellow-400" />
              <span>{totalStars}</span>
              <span className="text-xs text-slate-500 font-normal">/ 15</span>
            </div>
          </div>

          <div className="text-center">
            <span className="text-[11px] text-slate-400 uppercase font-medium block">Misi Selesai</span>
            <div className="flex items-center justify-center gap-1 text-emerald-400 font-bold text-lg font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>{completedCount} / 5</span>
            </div>
          </div>

          {allCompleted && (
            <button
              onClick={onOpenVictory}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-yellow-500/20 transition-all"
            >
              <Trophy className="w-4 h-4" />
              <span>Sertifikat</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div className="relative w-full rounded-3xl overflow-hidden border-2 border-cyan-900/60 shadow-2xl bg-slate-950 aspect-[16/9] min-h-[420px] max-h-[640px]">
        {/* Generated World Map Illustration */}
        <img
          src="/src/assets/images/digital_academy_map_1794457671544.jpg"
          alt="Digital Academy Map"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-75"
        />

        {/* Ambient Dark Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

        {/* Title Overlay */}
        <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-cyan-500/30 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Peta Petualangan Digital Academy
            </div>
            <div className="text-[10px] text-slate-400">
              Pilih lokasi misi yang telah terbuka untuk mulai belajar dan investigasi
            </div>
          </div>
        </div>

        {/* Mission Nodes Pinpoints */}
        {missionNodes.map((node) => {
          const lvlInfo = GAME_LEVELS[node.id];
          const progress = levels[node.id];
          const isUnlocked = progress.unlocked;
          const isCompleted = progress.completed;
          const isCurrentActive = isUnlocked && !isCompleted;

          return (
            <div
              key={node.id}
              style={{ left: node.posX, top: node.posY }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
            >
              {/* Pulsing ring for active current level */}
              {isCurrentActive && (
                <div className="absolute -inset-3 rounded-full bg-cyan-400/30 animate-ping pointer-events-none" />
              )}

              {/* Node Button */}
              <motion.button
                whileHover={isUnlocked ? { scale: 1.15 } : {}}
                whileTap={isUnlocked ? { scale: 0.92 } : {}}
                onClick={() => handleNodeClick(node.id)}
                disabled={!isUnlocked}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center shadow-xl transition-all ${
                  isCompleted
                    ? 'bg-gradient-to-br from-emerald-600 to-teal-800 border-2 border-emerald-300 text-white shadow-emerald-500/30'
                    : isCurrentActive
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 border-2 border-cyan-200 text-white shadow-cyan-400/50 ring-4 ring-cyan-400/30'
                    : 'bg-slate-900/90 border-2 border-slate-700 text-slate-500 opacity-80 cursor-not-allowed'
                }`}
              >
                {/* Node icon or lock */}
                <div className="text-xl sm:text-2xl leading-none">
                  {isUnlocked ? node.icon : <Lock className="w-5 h-5 text-slate-500" />}
                </div>

                {/* Level number badge */}
                <div
                  className={`absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center font-mono ${
                    isCompleted
                      ? 'bg-emerald-400 text-slate-950'
                      : isCurrentActive
                      ? 'bg-cyan-300 text-slate-950 animate-bounce'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {node.id}
                </div>

                {/* Stars earned badge */}
                {isCompleted && (
                  <div className="absolute -bottom-2 inset-x-0 flex items-center justify-center gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= progress.stars
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </motion.button>

              {/* Tooltip on Hover / Permanent label for active */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap z-30 transition-all pointer-events-none ${
                  isCurrentActive
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 group-hover:opacity-100 translate-y-1'
                }`}
              >
                <div className="bg-slate-950/95 border border-cyan-500/50 px-2.5 py-1.5 rounded-xl shadow-2xl text-center">
                  <div className="text-xs font-bold text-white font-display">
                    Level {node.id}: {lvlInfo.title}
                  </div>
                  <div className="text-[10px] text-cyan-300 flex items-center justify-center gap-1 font-mono">
                    {isCompleted ? (
                      <span className="text-emerald-400">
                        Selesai · Skor: {progress.score}/100
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-cyan-300 font-bold">Misi Terbuka · Klik Main</span>
                    ) : (
                      <span className="text-slate-400">Selesaikan Level {node.id - 1} Dulu</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mission Level Cards List (Accessible overview & direct play) */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-200 font-display flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Daftar 5 Misi Detektif Digital
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {([1, 2, 3, 4, 5] as LevelId[]).map((lvlId) => {
            const info = GAME_LEVELS[lvlId];
            const prog = levels[lvlId];
            const isUnlocked = prog.unlocked;
            const isCompleted = prog.completed;

            return (
              <div
                key={lvlId}
                onClick={() => handleNodeClick(lvlId)}
                className={`rounded-2xl p-4 border transition-all ${
                  isUnlocked
                    ? 'bg-slate-900/80 hover:bg-slate-800/90 border-cyan-800/50 hover:border-cyan-400/70 cursor-pointer shadow-md'
                    : 'bg-slate-950/60 border-slate-900 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-xs font-bold font-mono flex items-center justify-center">
                      0{lvlId}
                    </span>
                    <h4 className="text-sm font-bold text-white font-display">{info.title}</h4>
                  </div>
                  <div>
                    {isCompleted ? (
                      <div className="flex items-center gap-0.5 text-yellow-400">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= prog.stars ? 'fill-yellow-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    ) : isUnlocked ? (
                      <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                        TERBUKA
                      </span>
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{info.objective}</p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400 text-[11px]">
                    {isCompleted ? `Skor: ${prog.score} Poin` : 'Maks: 100 Poin'}
                  </span>
                  {isUnlocked && (
                    <span className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-xs">
                      {isCompleted ? 'Main Lagi' : 'Mulai Misi'} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
