import React from 'react';
import { motion } from 'motion/react';
import {
  HelpCircle,
  Play,
  BookOpen,
  Lock,
  CheckCircle2,
  Star,
  Award,
  ArrowLeft,
} from 'lucide-react';
import { audio } from '../utils/audio';

interface GameGuideProps {
  onBack: () => void;
}

export const GameGuide: React.FC<GameGuideProps> = ({ onBack }) => {
  const guideSteps = [
    {
      step: '01',
      title: 'Cara Memulai Permainan',
      icon: Play,
      desc: 'Klik tombol "MULAI PETUALANGAN" pada menu utama, lalu masukkan nama lengkap dan kelasmu pada formulir pendaftaran detektif.',
    },
    {
      step: '02',
      title: 'Cara Membaca Materi (Belajar Dulu)',
      icon: BookOpen,
      desc: 'Setiap level memiliki tab "BELAJAR DULU". Pelajari rangkuman, amati contoh interaktif, dan dengarkan petunjuk dari Robot Robi sebelum mencoba misi tantangan.',
    },
    {
      step: '03',
      title: 'Cara Membuka Level Baru',
      icon: Lock,
      desc: 'Permainan dimulai dari Level 1 (Laboratorium Copy Paste). Setelah menyelesaikan kuis dan simulasi di suatu level, level berikutnya otomatis terbuka di peta petualangan.',
    },
    {
      step: '04',
      title: 'Cara Menjawab Soal & Tantangan',
      icon: CheckCircle2,
      desc: 'Pada kuis pilihan ganda, klik opsi jawaban yang menurutmu benar. Pada tantangan simulasi, lakukan instruksi detektif seperti memasangkan kartu, menangkap cuplikan layar, menyusun kartu hierarki, atau mengatur pita menu Home.',
    },
    {
      step: '05',
      title: 'Cara Mendapatkan Poin',
      icon: Award,
      desc: 'Setiap jawaban kuis benar bernilai 10 poin. Tantangan praktik interaktif bernilai hingga 50 poin tambahan. Setiap level memiliki nilai maksimal 100 poin (Total 500 poin untuk 5 level).',
    },
    {
      step: '06',
      title: 'Cara Mengumpulkan Bintang',
      icon: Star,
      desc: 'Bintang dihitung berdasarkan skor tiap level: Skor 90–100 meraih 3 Bintang (★★★), skor 70–89 meraih 2 Bintang (★★☆), skor 50–69 meraih 1 Bintang (★☆☆).',
    },
    {
      step: '07',
      title: 'Cara Melihat & Mencetak Hasil',
      icon: HelpCircle,
      desc: 'Setelah menaklukkan Kastil Final Boss, kamu akan menerima Sertifikat Resmi Digital Academy lengkap dengan predikat dan rekap nilai. Tekan tombol "Cetak Hasil / Simpan PDF" untuk menyimpan berkas laporan.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-amber-800/60 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-amber-400 font-bold uppercase">
              BUKU PETUNJUK RESMI
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              Panduan Bermain & Bertualang
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

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guideSteps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 font-mono font-bold text-xs">
                {s.step}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-bold text-white font-display flex items-center gap-2">
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span>{s.title}</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
