import React from 'react';
import { motion } from 'motion/react';
import { Info, X, Shield, Sparkles, Laptop, BookOpen } from 'lucide-react';
import { TeacherFlameBadge } from './TeacherFlameBadge';
import { audio } from '../utils/audio';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white font-display">Tentang Permainan</h3>
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

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-800/40">
            <h4 className="text-sm font-bold text-cyan-300 font-display">
              MISI DETEKTIF DIGITAL
            </h4>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Tagline: Belajar Teknologi, Pecahkan Misi, Jadi Detektif Digital!
            </p>
          </div>

          <div className="py-1">
            <TeacherFlameBadge size="sm" showLabel={true} />
          </div>

          <p>
            Game edukasi interaktif animasi ini dirancang khusus untuk pembelajaran mata pelajaran{' '}
            <strong className="text-white">Informatika SMP Kelas VIII</strong> pada elemen{' '}
            <strong className="text-white">Teknologi Informasi dan Komunikasi (TIK)</strong>.
          </p>

          <p>
            Materi mencakup konsep esensial aplikasi perkantoran:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1 font-mono text-[11px]">
            <li>Operasi Copy, Cut, dan Paste antardokumen.</li>
            <li>Screenshot layar dengan tombol PrtSc, Snipping Tool, dan Crop.</li>
            <li>Anatomi dan hierarki objek dokumen pengolah kata.</li>
            <li>Fitur pita perintah (Ribbon) Menu Home: Clipboard, Font, Paragraph, Styles.</li>
            <li>Simulasi evaluasi akhir bertema pertarungan Cyber Guardian Boss.</li>
          </ul>

          <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-800">
            Dapat dimainkan langsung di peramban tanpa instalasi atau login tambahan. Didesain ramah untuk kegiatan belajar mengajar di laboratorium komputer sekolah.
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
};
