import React from 'react';
import { motion } from 'motion/react';
import {
  Settings,
  Volume2,
  VolumeX,
  Music,
  RotateCcw,
  X,
  CheckCircle2,
  Shield,
} from 'lucide-react';
import { audio } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white font-display">Pengaturan Permainan</h3>
          </div>
          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Toggles */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-3">
              <Music className="w-5 h-5 text-cyan-400" />
              <div>
                <strong className="text-sm font-semibold text-white block">Musik Latar</strong>
                <span className="text-[11px] text-slate-400">Musik petualangan teknologi synthesizer</span>
              </div>
            </div>
            <button
              onClick={() => {
                audio.playClick();
                onToggleMusic();
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                musicEnabled
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {musicEnabled ? 'AKTIF' : 'NONAKTIF'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-cyan-400" />
              <div>
                <strong className="text-sm font-semibold text-white block">Efek Suara (SFX)</strong>
                <span className="text-[11px] text-slate-400">Suara klik, benar, salah, dan laser</span>
              </div>
            </div>
            <button
              onClick={() => {
                audio.playClick();
                onToggleSound();
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                soundEnabled
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {soundEnabled ? 'AKTIF' : 'NONAKTIF'}
            </button>
          </div>
        </div>

        {/* Reset Current Progress */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              if (confirm('Ulangi progres petualangan dari Level 1? Data riwayat rekap guru tetap aman.')) {
                audio.playWrong();
                onResetProgress();
                onClose();
              }
            }}
            className="w-full py-3 px-4 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mulai Ulang Progres Petualangan</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
