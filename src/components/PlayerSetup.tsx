import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, UserCheck, School, Users, ShieldAlert } from 'lucide-react';
import { DetectiveByte } from './DetectiveByte';
import { PlayerProfile } from '../types/game';
import { audio } from '../utils/audio';

interface PlayerSetupProps {
  onSaveProfile: (profile: PlayerProfile) => void;
  onBack: () => void;
  existingProfile?: PlayerProfile | null;
}

export const PlayerSetup: React.FC<PlayerSetupProps> = ({
  onSaveProfile,
  onBack,
  existingProfile,
}) => {
  const [name, setName] = useState(existingProfile?.name || '');
  const [grade, setGrade] = useState(existingProfile?.grade || 'VIII-A');
  const [groupNumber, setGroupNumber] = useState(existingProfile?.groupNumber || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      audio.playWrong();
      setError('Harap masukkan nama lengkap atau panggilanmu terlebih dahulu!');
      return;
    }

    audio.playLevelUnlock();
    onSaveProfile({
      name: name.trim(),
      grade: grade.trim(),
      groupNumber: groupNumber.trim() || undefined,
      startedAt: existingProfile?.startedAt || new Date().toLocaleString('id-ID'),
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-8 bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(#0369a11a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Detective Byte Column */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <DetectiveByte
            size="md"
            mood="walking"
            speechText="Halo, calon detektif! Siapa namamu? Mari kita mulai petualangan digital ini!"
          />
        </div>

        {/* Identity Form Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-7 bg-slate-900/90 border border-cyan-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md"
        >
          <div className="mb-6">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
              REGISTRASI AGEN DIGITAL
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Identitas Detektif
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Data ini akan dicantumkan pada sertifikat dan rekap nilai akhir misi.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Player Name Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                Nama Pemain / Siswa *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Contoh: Raditya Pratama"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm outline-none transition-all"
              />
            </div>

            {/* Grade Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <School className="w-4 h-4 text-cyan-400" />
                  Kelas (SMP VIII) *
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-sm outline-none transition-all"
                >
                  <option value="VIII-A">Kelas VIII-A</option>
                  <option value="VIII-B">Kelas VIII-B</option>
                  <option value="VIII-C">Kelas VIII-C</option>
                  <option value="VIII-D">Kelas VIII-D</option>
                  <option value="VIII-E">Kelas VIII-E</option>
                  <option value="VIII-F">Kelas VIII-F</option>
                  <option value="VIII-G">Kelas VIII-G</option>
                </select>
              </div>

              {/* Group Number (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-cyan-400" />
                  No. Kelompok (Opsional)
                </label>
                <input
                  type="text"
                  value={groupNumber}
                  onChange={(e) => setGroupNumber(e.target.value)}
                  placeholder="Contoh: Kelompok 3"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  onBack();
                }}
                className="px-5 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>KEMBALI</span>
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all"
              >
                <span>MULAI MISI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
