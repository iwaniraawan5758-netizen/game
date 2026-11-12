import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Gamepad2,
  Camera,
  Crop,
  Layers,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Monitor,
  Scissors,
  FileText,
  MousePointerClick,
} from 'lucide-react';
import { LevelProgress } from '../../types/game';
import { GAME_LEVELS } from '../../data/gameContent';
import { RobiAssistant } from '../RobiAssistant';
import { audio } from '../../utils/audio';

interface Level2Props {
  progress: LevelProgress;
  onCompleteLevel: (score: number) => void;
  onBackToMap: () => void;
}

export const Level2Screenshot: React.FC<Level2Props> = ({
  progress,
  onCompleteLevel,
  onBackToMap,
}) => {
  const [activeTab, setActiveTab] = useState<'LEARN' | 'MISSION'>('LEARN');
  const levelInfo = GAME_LEVELS[2];

  // --- MISSION STATE ---
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [showAnswerResult, setShowAnswerResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0); // max 50

  // Interactive Screen Capture Simulator State
  const [selectedCaptureTarget, setSelectedCaptureTarget] = useState<string | null>(null);
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [capturedSnippet, setCapturedSnippet] = useState<{
    id: string;
    title: string;
    description: string;
  } | null>(null);
  const [isPastedInWord, setIsPastedInWord] = useState(false);
  const [interactiveScore, setInteractiveScore] = useState(0); // max 50

  const handleSelectAnswer = (optKey: 'A' | 'B' | 'C' | 'D') => {
    if (showAnswerResult) return;
    const currentQ = levelInfo.questions[currentQIndex];
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optKey }));
    setShowAnswerResult(true);

    if (optKey === currentQ.correctAnswer) {
      audio.playCorrect();
      setQuizScore((prev) => prev + 10);
    } else {
      audio.playWrong();
    }
  };

  const handleNextQuestion = () => {
    audio.playClick();
    setShowAnswerResult(false);
    if (currentQIndex < levelInfo.questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    }
  };

  // Interactive Desktop Snip Logic
  const handleCaptureTarget = (targetId: string, title: string, desc: string) => {
    audio.playShutter();
    setIsFlashActive(true);
    setSelectedCaptureTarget(targetId);

    setTimeout(() => {
      setIsFlashActive(false);
      setCapturedSnippet({ id: targetId, title, description: desc });
    }, 250);
  };

  const handlePasteSnippet = () => {
    if (!capturedSnippet) return;
    audio.playCorrect();
    setIsPastedInWord(true);
    setInteractiveScore(50);
  };

  const isQuizFinished = Object.keys(selectedAnswers).length === levelInfo.questions.length;
  const isMissionFinished = isQuizFinished && isPastedInWord;
  const totalMissionScore = quizScore + interactiveScore;

  const handleFinishMission = () => {
    audio.playVictory();
    onCompleteLevel(totalMissionScore);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-950/80 via-slate-900 to-slate-900 border border-sky-800/60 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
              LEVEL 02 // KOTA SCREENSHOT
            </span>
            <span className="text-xs text-slate-400">· 100 Poin Maksimal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
            {levelInfo.title}
          </h2>
          <p className="text-xs sm:text-sm text-sky-200/80 mt-1 max-w-xl">
            {levelInfo.objective}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-950/80 rounded-2xl border border-sky-800/50">
          <button
            onClick={() => {
              audio.playClick();
              setActiveTab('LEARN');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'LEARN'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>BELAJAR DULU</span>
          </button>
          <button
            onClick={() => {
              audio.playClick();
              setActiveTab('MISSION');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'MISSION'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>COBA MISI</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: BELAJAR DULU ================= */}
      {activeTab === 'LEARN' && (
        <div className="space-y-6">
          {/* Visual Showcase: Keyboard, Monitor & Snipping Tool */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-3">
                <Monitor className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white font-display mb-1">
                Tombol PrtSc (Print Screen)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Menangkap satu layar penuh sekaligus secara instan ke dalam Clipboard. Sangat cocok jika kamu ingin menyimpan seluruh tampilan tanpa terkecuali.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-sky-700/50 rounded-2xl p-5 shadow-lg ring-1 ring-sky-500/20">
              <div className="w-10 h-10 rounded-xl bg-sky-900/60 border border-sky-400/50 flex items-center justify-center text-sky-300 mb-3">
                <Scissors className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <h4 className="text-base font-bold text-white font-display">
                  Snipping Tool Windows
                </h4>
                <span className="text-[10px] bg-sky-950 text-sky-300 font-mono px-2 py-0.5 rounded border border-sky-500/30">
                  Win + Shift + S
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fitur bawaan Windows paling fleksibel! Kamu bisa memilih area kotak persegi tertentu tanpa mengotori dokumen dengan bagian layar lain.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                <Crop className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white font-display mb-1">
                Fitur Crop Gambar
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Jika sudah terlanjur ditempel di Microsoft Word, gunakan tombol Crop pada tab Picture Format untuk memangkas sisi tepi yang tidak diinginkan.
              </p>
            </div>
          </div>

          {/* Interactive Keyboard Shortcut Visualizer */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-2">
              KOMBINASI TOMBOL SAKTI PENANGKAP LAYAR
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3 my-3">
              <div className="px-5 py-3 rounded-2xl bg-slate-950 border-2 border-cyan-500/40 text-cyan-300 font-mono font-black text-lg shadow-lg">
                ⊞ Windows
              </div>
              <span className="text-2xl text-slate-600 font-black">+</span>
              <div className="px-5 py-3 rounded-2xl bg-slate-950 border-2 border-cyan-500/40 text-cyan-300 font-mono font-black text-lg shadow-lg">
                ⇧ Shift
              </div>
              <span className="text-2xl text-slate-600 font-black">+</span>
              <div className="px-5 py-3 rounded-2xl bg-slate-950 border-2 border-cyan-500/40 text-cyan-300 font-mono font-black text-lg shadow-lg">
                S
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Saat ditekan bersamaan di Windows, layar meredup dan kursor berubah menjadi tanda bidik untuk memilih area tangkapan.
            </p>
          </div>

          <RobiAssistant
            hint="Setelah kamu mengambil gambar menggunakan Windows + Shift + S atau PrtSc, gambar langsung tersimpan di Clipboard. Buka Microsoft Word lalu tekan Ctrl + V untuk menampilkannya!"
          />

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                audio.playClick();
                setActiveTab('MISSION');
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-sky-500/25"
            >
              <span>SIAP INVESTIGASI, MULAI MISI!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 2: COBA MISI ================= */}
      {activeTab === 'MISSION' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800">
            <span>
              Bagian 1: Soal Pilihan Ganda ({Math.min(currentQIndex + 1, levelInfo.questions.length)} dari 5)
            </span>
            <span className="font-mono text-sky-300 font-bold">
              Skor Terkumpul: {totalMissionScore} / 100 Poin
            </span>
          </div>

          {/* Section A: 5 Questions */}
          {!isQuizFinished && (
            <div className="bg-slate-900/95 border border-sky-800/60 rounded-3xl p-6 shadow-2xl space-y-4">
              {(() => {
                const q = levelInfo.questions[currentQIndex];
                const selected = selectedAnswers[q.id];

                return (
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-2">
                      <HelpCircle className="w-4 h-4" />
                      <span>PERTANYAAN 0{currentQIndex + 1}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white font-display mb-4">
                      {q.question}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {q.options.map((opt) => {
                        const isChosen = selected === opt.key;
                        const isCorrect = opt.key === q.correctAnswer;

                        let style =
                          'bg-slate-950/80 border-slate-800 hover:border-sky-500/50 text-slate-200';
                        if (showAnswerResult) {
                          if (isCorrect) {
                            style =
                              'bg-emerald-950/80 border-emerald-400 text-white font-semibold ring-2 ring-emerald-500/30';
                          } else if (isChosen && !isCorrect) {
                            style = 'bg-rose-950/80 border-rose-400 text-rose-200';
                          } else {
                            style = 'bg-slate-950/40 border-slate-900 text-slate-600';
                          }
                        }

                        return (
                          <button
                            key={opt.key}
                            onClick={() => handleSelectAnswer(opt.key)}
                            disabled={showAnswerResult}
                            className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-3 transition-all ${style}`}
                          >
                            <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-bold font-mono text-sky-300 shrink-0">
                              {opt.key}
                            </span>
                            <span className="flex-1 pt-0.5">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {showAnswerResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <RobiAssistant
                          type={selected === q.correctAnswer ? 'success' : 'error'}
                          explanation={q.explanation}
                        />

                        <div className="flex justify-end pt-2">
                          <button
                            onClick={handleNextQuestion}
                            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2"
                          >
                            <span>Lanjut Soal Berikutnya</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Section B: Interactive Screen Capture Simulation (50 pts) */}
          {isQuizFinished && !isPastedInWord && (
            <div className="bg-slate-900/95 border border-sky-800/60 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono text-sky-400 font-bold uppercase">
                    BAGIAN 2 // SIMULASI LAYAR KOMPUTER
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white font-display">
                    Pilih Bagian Layar yang Ingin Kamu Tangkap (Snipping)!
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Detektif, sistem mendeteksi 3 area data di desktop. Klik area yang ingin kamu potong!
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-yellow-400 font-mono font-bold">+50 Poin</span>
                </div>
              </div>

              {/* Simulated Desktop Monitor Screen */}
              <div className="relative rounded-2xl border-2 border-slate-700 bg-slate-950 p-4 shadow-2xl overflow-hidden min-h-[300px]">
                {/* Camera Flash Overlay */}
                {isFlashActive && (
                  <div className="absolute inset-0 bg-white z-50 animate-ping opacity-90" />
                )}

                {/* Desktop Top Taskbar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                  <span>DESKTOP MONITOR // AGEN DIGITAL ACADEMY</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>ONLINE</span>
                  </div>
                </div>

                {/* 3 Interactive Windows to Snip */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
                  {/* Target 1: Secret Chart */}
                  <button
                    onClick={() =>
                      handleCaptureTarget(
                        'chart',
                        'Grafik Pertumbuhan Digital',
                        'Data statistik kenaikan performa sistem Digital Academy'
                      )
                    }
                    className={`p-3.5 rounded-xl border text-left transition-all relative group ${
                      selectedCaptureTarget === 'chart'
                        ? 'bg-sky-950/70 border-sky-400 ring-2 ring-sky-400'
                        : 'bg-slate-900/90 border-slate-800 hover:border-sky-400/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-sky-400 mb-2">
                      <span className="font-bold">1. Grafik Keuangan</span>
                      <MousePointerClick className="w-3.5 h-3.5 group-hover:scale-125 transition-transform" />
                    </div>
                    <div className="h-20 bg-slate-950 rounded-lg p-2 flex items-end gap-1.5 justify-around border border-slate-800">
                      <div className="w-4 bg-cyan-500 h-10 rounded-t" />
                      <div className="w-4 bg-sky-500 h-14 rounded-t" />
                      <div className="w-4 bg-blue-500 h-16 rounded-t" />
                      <div className="w-4 bg-emerald-500 h-12 rounded-t" />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      Klik untuk menangkap area grafik ini
                    </span>
                  </button>

                  {/* Target 2: Secret Code Table */}
                  <button
                    onClick={() =>
                      handleCaptureTarget(
                        'table',
                        'Tabel Sandi Rahasia',
                        'Matriks kunci pengolahan kata tingkat lanjut'
                      )
                    }
                    className={`p-3.5 rounded-xl border text-left transition-all relative group ${
                      selectedCaptureTarget === 'table'
                        ? 'bg-sky-950/70 border-sky-400 ring-2 ring-sky-400'
                        : 'bg-slate-900/90 border-slate-800 hover:border-sky-400/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-sky-400 mb-2">
                      <span className="font-bold">2. Tabel Arsip Dokumen</span>
                      <MousePointerClick className="w-3.5 h-3.5 group-hover:scale-125 transition-transform" />
                    </div>
                    <div className="h-20 bg-slate-950 rounded-lg p-2 flex flex-col justify-around border border-slate-800 text-[10px] font-mono text-cyan-300">
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span>DOC_01</span>
                        <span>REVISI_OK</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span>TABLE_02</span>
                        <span>TERVALIDASI</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IMG_03</span>
                        <span>DISIMPAN</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      Klik untuk menangkap area tabel ini
                    </span>
                  </button>

                  {/* Target 3: Detective Academy Badge */}
                  <button
                    onClick={() =>
                      handleCaptureTarget(
                        'badge',
                        'Lencana Digital Academy',
                        'Simbol otorisasi resmi inspektorat teknologi informasi'
                      )
                    }
                    className={`p-3.5 rounded-xl border text-left transition-all relative group ${
                      selectedCaptureTarget === 'badge'
                        ? 'bg-sky-950/70 border-sky-400 ring-2 ring-sky-400'
                        : 'bg-slate-900/90 border-slate-800 hover:border-sky-400/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-sky-400 mb-2">
                      <span className="font-bold">3. Lencana Otoritas</span>
                      <MousePointerClick className="w-3.5 h-3.5 group-hover:scale-125 transition-transform" />
                    </div>
                    <div className="h-20 bg-slate-950 rounded-lg p-2 flex items-center justify-center border border-slate-800">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      Klik untuk menangkap area lencana ini
                    </span>
                  </button>
                </div>

                {/* Paste Area in Simulated Microsoft Word */}
                {capturedSnippet && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-slate-900 border border-sky-500/50 flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-sky-950 border border-sky-400 flex items-center justify-center text-sky-300 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="text-left text-xs">
                        <span className="text-emerald-400 font-bold block">
                          ✓ Gambar Tersimpan di Clipboard!
                        </span>
                        <p className="text-slate-300">
                          Siap ditempelkan ke Laporan Dokumen Word:{' '}
                          <strong className="text-white">{capturedSnippet.title}</strong>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handlePasteSnippet}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 whitespace-nowrap"
                    >
                      <span>PASTE (Ctrl + V) KE LAPORAN</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Level Complete Summary */}
          {isMissionFinished && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-r from-emerald-950/90 to-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>

              <h3 className="text-2xl font-black text-white font-display">
                Misi Kota Screenshot Selesai!
              </h3>

              <p className="text-slate-300 text-sm max-w-md mx-auto">
                Hebat! Kamu berhasil menguasai penangkapan layar dengan PrtSc dan Snipping Tool serta menempelkan buktinya ke dokumen!
              </p>

              <div className="inline-flex items-center gap-4 bg-slate-950/80 border border-emerald-500/30 px-6 py-3 rounded-2xl">
                <div>
                  <span className="text-xs text-slate-400 block">Total Skor Level 2</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {totalMissionScore} / 100
                  </span>
                </div>
                <div className="border-l border-slate-800 pl-4">
                  <span className="text-xs text-slate-400 block">Bintang Diperoleh</span>
                  <span className="text-xl font-bold text-yellow-400">
                    {totalMissionScore >= 90 ? '★★★' : totalMissionScore >= 70 ? '★★☆' : '★☆☆'}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <button
                  onClick={handleFinishMission}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25"
                >
                  <span>SIMPAN PROGRES & BUKA LEVEL 3</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          <div className="flex justify-start">
            <button
              onClick={() => {
                audio.playClick();
                onBackToMap();
              }}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Kembali ke Peta Petualangan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
