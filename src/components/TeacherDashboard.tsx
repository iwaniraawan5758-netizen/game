import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Download,
  Trash2,
  PlusCircle,
  ArrowLeft,
  Star,
  CheckCircle2,
  Clock,
  Info,
  Award,
} from 'lucide-react';
import { PlayerRecord } from '../types/game';
import { exportRecordsToCSV, clearAllGameData } from '../utils/storage';
import { TeacherFlameBadge } from './TeacherFlameBadge';
import { audio } from '../utils/audio';

interface TeacherDashboardProps {
  records: PlayerRecord[];
  onRefreshRecords: () => void;
  onAddNewPlayer: () => void;
  onBack: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  records,
  onRefreshRecords,
  onAddNewPlayer,
  onBack,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleDownloadCSV = () => {
    audio.playClick();
    exportRecordsToCSV(records);
  };

  const handleClearAll = () => {
    audio.playWrong();
    clearAllGameData();
    setShowClearConfirm(false);
    onRefreshRecords();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-indigo-800/60 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase">
                PANEL PENILAIAN INFORMATIKA SMP KELAS VIII
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              Dashboard Guru & Rekap Nilai
            </h2>
            <div className="mt-2">
              <TeacherFlameBadge size="sm" showLabel={true} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>UNDUH REKAP CSV</span>
          </button>

          <button
            onClick={() => {
              audio.playClick();
              onAddNewPlayer();
            }}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>SISWA / SESI BARU</span>
          </button>

          <button
            onClick={() => {
              audio.playClick();
              setShowClearConfirm(true);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-rose-900/60 hover:bg-rose-950/40 text-rose-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Data</span>
          </button>
        </div>
      </div>

      {/* Teacher Guidance Notice */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block font-bold mb-0.5">
            Petunjuk Penyimpanan Data Lokal:
          </strong>
          Seluruh progres dan nilai siswa disimpan langsung di penyimpanan lokal peramban (
          <code className="text-cyan-300">browser localStorage</code>) pada perangkat/komputer ini.
          Jika beberapa siswa bergantian menggunakan komputer yang sama di lab sekolah, gunakan tombol
          <strong className="text-cyan-300"> "SISWA / SESI BARU"</strong> agar riwayat pemain sebelumnya
          tetap tercatat rapi dan dapat diekspor bersamaan ke format Microsoft Excel / CSV.
        </div>
      </div>

      {/* Confirmation Modal for Clearing Data */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="max-w-md w-full bg-slate-900 border border-rose-500/50 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-950 border border-rose-500/40 mx-auto flex items-center justify-center text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">
              Hapus Seluruh Data Rekap Nilai?
            </h3>
            <p className="text-xs text-slate-300">
              Tindakan ini akan mengosongkan seluruh riwayat skor siswa yang tersimpan di browser ini. Tindakan tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Ya, Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Records Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <span>Daftar Riwayat Siswa ({records.length})</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Tersimpan Otomatis</span>
        </div>

        {records.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                  <th className="py-3 px-4">No</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4">L1</th>
                  <th className="py-3 px-4">L2</th>
                  <th className="py-3 px-4">L3</th>
                  <th className="py-3 px-4">L4</th>
                  <th className="py-3 px-4">L5</th>
                  <th className="py-3 px-4">Total Skor</th>
                  <th className="py-3 px-4">Bintang</th>
                  <th className="py-3 px-4">Predikat</th>
                  <th className="py-3 px-4">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-300">
                {records.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                      {r.name}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono">{r.grade}</td>
                    <td className="py-3 px-4 font-mono">{r.levels[1]?.score ?? 0}</td>
                    <td className="py-3 px-4 font-mono">{r.levels[2]?.score ?? 0}</td>
                    <td className="py-3 px-4 font-mono">{r.levels[3]?.score ?? 0}</td>
                    <td className="py-3 px-4 font-mono">{r.levels[4]?.score ?? 0}</td>
                    <td className="py-3 px-4 font-mono">{r.levels[5]?.score ?? 0}</td>
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                      {r.totalScore}
                    </td>
                    <td className="py-3 px-4 font-mono text-yellow-400 whitespace-nowrap">
                      ★ {r.totalStars}
                    </td>
                    <td className="py-3 px-4 font-medium text-amber-300 whitespace-nowrap">
                      {r.predicate}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {r.completedAt || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Users className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-medium">Belum ada riwayat siswa yang tercatat.</p>
            <p className="text-xs">
              Mulai petualangan dan selesaikan misi agar data nilai muncul otomatis di tabel ini.
            </p>
          </div>
        )}
      </div>

      {/* Back button */}
      <div>
        <button
          onClick={() => {
            audio.playClick();
            onBack();
          }}
          className="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Menu Utama</span>
        </button>
      </div>
    </div>
  );
};
