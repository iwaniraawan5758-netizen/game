import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Copy,
  Camera,
  Layers,
  Sliders,
  Trophy,
  ArrowLeft,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { GAME_LEVELS } from '../data/gameContent';
import { LevelId } from '../types/game';
import { audio } from '../utils/audio';

interface LearningHubProps {
  onBack: () => void;
}

export const LearningHub: React.FC<LearningHubProps> = ({ onBack }) => {
  const [selectedLevelId, setSelectedLevelId] = useState<LevelId>(1);
  const activeLevel = GAME_LEVELS[selectedLevelId];

  const levelTabs = [
    { id: 1 as LevelId, title: '1. Copy, Cut & Paste', icon: Copy },
    { id: 2 as LevelId, title: '2. Screenshot & Crop', icon: Camera },
    { id: 3 as LevelId, title: '3. Hierarki Objek', icon: Layers },
    { id: 4 as LevelId, title: '4. Menu Home Ribbon', icon: Sliders },
    { id: 5 as LevelId, title: '5. Rangkuman Ujian Akhir', icon: Trophy },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-cyan-800/60 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
              MODUL PEMBELAJARAN LENGKAP
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              Pusat Pengetahuan Detektif
            </h2>
          </div>
        </div>

        <button
          onClick={() => {
            audio.playClick();
            onBack();
          }}
          className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {levelTabs.map((t) => {
          const Icon = t.icon;
          const isActive = selectedLevelId === t.id;

          return (
            <button
              key={t.id}
              onClick={() => {
                audio.playClick();
                setSelectedLevelId(t.id);
              }}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                isActive
                  ? 'bg-gradient-to-b from-cyan-900/80 to-blue-950 border-cyan-400 text-cyan-200 shadow-lg ring-1 ring-cyan-400'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate w-full">{t.title}</span>
            </button>
          );
        })}
      </div>

      {/* Material Content Card */}
      <div className="bg-slate-900/95 border border-cyan-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
            MATERI INFORMATIKA SMP KELAS VIII
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white font-display mt-0.5">
            {activeLevel.title}
          </h3>
          <p className="text-xs sm:text-sm text-cyan-200/80 mt-1">{activeLevel.objective}</p>
        </div>

        {/* Detailed Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeLevel.learnPoints.map((pt, i) => (
            <div
              key={i}
              className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm sm:text-base font-bold text-white font-display">
                  {pt.title}
                </h4>
                {pt.tag && (
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                    {pt.tag}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{pt.description}</p>
              {pt.steps && (
                <ol className="list-decimal list-inside text-xs text-slate-400 space-y-1 pt-1 font-mono">
                  {pt.steps.map((st, sidx) => (
                    <li key={sidx}>{st}</li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
