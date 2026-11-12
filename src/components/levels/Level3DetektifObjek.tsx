import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Gamepad2,
  Layers,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  MoveUp,
  MoveDown,
  RotateCcw,
  FileCode,
  Layout,
  AlignLeft,
  Type,
  Table as TableIcon,
  Shapes,
} from 'lucide-react';
import { LevelProgress } from '../../types/game';
import { GAME_LEVELS } from '../../data/gameContent';
import { RobiAssistant } from '../RobiAssistant';
import { DetectiveByte } from '../DetectiveByte';
import { audio } from '../../utils/audio';

interface Level3Props {
  progress: LevelProgress;
  onCompleteLevel: (score: number) => void;
  onBackToMap: () => void;
}

export const Level3DetektifObjek: React.FC<Level3Props> = ({
  progress,
  onCompleteLevel,
  onBackToMap,
}) => {
  const [activeTab, setActiveTab] = useState<'LEARN' | 'MISSION'>('LEARN');
  const levelInfo = GAME_LEVELS[3];

  // --- MISSION STATE ---
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [showAnswerResult, setShowAnswerResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0); // max 50

  // Hierarchy Reordering Challenge State
  // Correct order from largest to smallest:
  // FILE -> PAGE -> PARAGRAPH -> LINE -> WORD -> CHARACTER
  const CORRECT_ORDER = ['FILE', 'PAGE', 'PARAGRAPH', 'LINE', 'WORD', 'CHARACTER'];

  // Initial scrambled order
  const [cardsOrder, setCardsOrder] = useState<string[]>([
    'WORD',
    'CHARACTER',
    'PAGE',
    'FILE',
    'LINE',
    'PARAGRAPH',
  ]);

  const [orderVerified, setOrderVerified] = useState(false);
  const [orderError, setOrderError] = useState(false);
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

  // Reorder actions: Move Up & Move Down
  const handleMoveUp = (index: number) => {
    if (index === 0 || orderVerified) return;
    audio.playClick();
    setOrderError(false);
    const newArr = [...cardsOrder];
    const temp = newArr[index - 1];
    newArr[index - 1] = newArr[index];
    newArr[index] = temp;
    setCardsOrder(newArr);
  };

  const handleMoveDown = (index: number) => {
    if (index === cardsOrder.length - 1 || orderVerified) return;
    audio.playClick();
    setOrderError(false);
    const newArr = [...cardsOrder];
    const temp = newArr[index + 1];
    newArr[index + 1] = newArr[index];
    newArr[index] = temp;
    setCardsOrder(newArr);
  };

  const handleCheckOrder = () => {
    const isCorrect = cardsOrder.every((card, idx) => card === CORRECT_ORDER[idx]);

    if (isCorrect) {
      audio.playLevelUnlock();
      setOrderVerified(true);
      setOrderError(false);
      setInteractiveScore(50);
    } else {
      audio.playWrong();
      setOrderError(true);
    }
  };

  const handleResetOrder = () => {
    audio.playClick();
    setCardsOrder(['WORD', 'CHARACTER', 'PAGE', 'FILE', 'LINE', 'PARAGRAPH']);
    setOrderVerified(false);
    setOrderError(false);
  };

  const isQuizFinished = Object.keys(selectedAnswers).length === levelInfo.questions.length;
  const isMissionFinished = isQuizFinished && orderVerified;
  const totalMissionScore = quizScore + interactiveScore;

  const handleFinishMission = () => {
    audio.playVictory();
    onCompleteLevel(totalMissionScore);
  };

  const cardMetadata: Record<string, { desc: string; icon: typeof Layout }> = {
    FILE: { desc: 'Unit terbesar: berkas dokumen lengkap (.docx)', icon: FileCode },
    PAGE: { desc: 'Satu lembar halaman kerja virtual/fisik', icon: Layout },
    PARAGRAPH: { desc: 'Kumpulan baris yang diakhiri Enter', icon: AlignLeft },
    LINE: { desc: 'Satu baris mendatar tulisan', icon: AlignLeft },
    WORD: { desc: 'Satu kata yang dipisahkan spasi', icon: Type },
    CHARACTER: { desc: 'Unit terkecil: huruf, angka, atau simbol', icon: Type },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-800/60 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
              LEVEL 03 // MARKAS DETEKTIF OBJEK
            </span>
            <span className="text-xs text-slate-400">· 100 Poin Maksimal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
            {levelInfo.title}
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200/80 mt-1 max-w-xl">
            {levelInfo.objective}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-950/80 rounded-2xl border border-indigo-800/50">
          <button
            onClick={() => {
              audio.playClick();
              setActiveTab('LEARN');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'LEARN'
                ? 'bg-gradient-to-r from-indigo-500 to-cyan-600 text-white shadow-md'
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
                ? 'bg-gradient-to-r from-indigo-500 to-cyan-600 text-white shadow-md'
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
          {/* Animated Interactive Hierarchy Tree */}
          <div className="bg-slate-900/95 border border-indigo-800/60 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white font-display">
                Diagram Hierarki Objek Pengolah Kata (Terbesar ke Terkecil)
              </h3>
            </div>

            <div className="flex flex-col items-center gap-2 my-4">
              {[
                { name: 'FILE (Dokumen Keseluruhan)', level: 'Tingkat 1 - Terbesar', color: 'from-blue-600 to-indigo-600' },
                { name: 'PAGE (Halaman Kerja)', level: 'Tingkat 2', color: 'from-indigo-600 to-purple-600' },
                { name: 'PARAGRAPH (Kumpulan Baris berakhiran Enter)', level: 'Tingkat 3', color: 'from-purple-600 to-pink-600' },
                { name: 'LINE (Baris Mendatar)', level: 'Tingkat 4', color: 'from-pink-600 to-rose-600' },
                { name: 'WORD (Kata yang dipisahkan Spasi)', level: 'Tingkat 5', color: 'from-rose-600 to-amber-600' },
                { name: 'CHARACTER (Huruf/Angka/Simbol Tunggal)', level: 'Tingkat 6 - Terkecil', color: 'from-amber-600 to-emerald-600' },
              ].map((h, i) => (
                <div key={i} className="flex flex-col items-center w-full max-w-md">
                  <div className={`w-full py-2.5 px-4 rounded-xl bg-gradient-to-r ${h.color} text-white shadow-md flex items-center justify-between text-xs sm:text-sm font-bold`}>
                    <span>{h.name}</span>
                    <span className="text-[10px] font-mono text-white/80 bg-black/20 px-2 py-0.5 rounded">
                      {h.level}
                    </span>
                  </div>
                  {i < 5 && (
                    <div className="w-0.5 h-3 bg-indigo-500/50 my-0.5" />
                  )}
                </div>
              ))}
            </div>

            {/* Extra insertable objects: Table & Shape */}
            <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-start gap-3">
                <TableIcon className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-bold">TABLE (Tabel)</strong>
                  <span className="text-slate-400">
                    Objek data terstruktur yang tersusun dari pertemuan baris (rows) dan kolom (columns) membentuk sel.
                  </span>
                </div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-start gap-3">
                <Shapes className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-bold">SHAPE (Bentuk Geometris)</strong>
                  <span className="text-slate-400">
                    Bentuk grafis dua dimensi seperti persegi, lingkaran, panah, bintang, atau kotak teks yang dapat disisipkan.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <RobiAssistant
            hint="Kunci menghafal hierarki: FILE memuat PAGE, PAGE memuat PARAGRAPH, PARAGRAPH memuat LINE, LINE memuat WORD, dan WORD tersusun atas CHARACTER!"
          />

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                audio.playClick();
                setActiveTab('MISSION');
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-400 hover:to-cyan-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              <span>SIAP SUSUN HIERARKI, MULAI MISI!</span>
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
            <span className="font-mono text-indigo-300 font-bold">
              Skor Terkumpul: {totalMissionScore} / 100 Poin
            </span>
          </div>

          {/* Section A: 5 Questions */}
          {!isQuizFinished && (
            <div className="bg-slate-900/95 border border-indigo-800/60 rounded-3xl p-6 shadow-2xl space-y-4">
              {(() => {
                const q = levelInfo.questions[currentQIndex];
                const selected = selectedAnswers[q.id];

                return (
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-2">
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
                          'bg-slate-950/80 border-slate-800 hover:border-indigo-500/50 text-slate-200';
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
                            <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-bold font-mono text-indigo-300 shrink-0">
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
                            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2"
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

          {/* Section B: Hierarchy Arranging Puzzle (50 pts) */}
          {isQuizFinished && !orderVerified && (
            <div className="bg-slate-900/95 border border-indigo-800/60 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono text-indigo-400 font-bold uppercase">
                    BAGIAN 2 // TEKA-TEKI HIERARKI OBJEK
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white font-display">
                    Urutkan 6 Kartu Objek dari Terbesar ke Terkecil!
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Gunakan tombol Naik (▲) dan Turun (▼) pada setiap kartu untuk mengatur urutan yang tepat.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-yellow-400 font-mono font-bold">+50 Poin</span>
                </div>
              </div>

              {orderError && (
                <RobiAssistant
                  type="error"
                  explanation="Urutan kartu masih belum tepat, Detektif! Petunjuk: Puncak paling atas adalah FILE (dokumen penuh), lalu PAGE, PARAGRAPH, LINE, WORD, dan unit paling dasar adalah CHARACTER (huruf/simbol)."
                />
              )}

              {/* Cards List to Reorder */}
              <div className="space-y-2.5 max-w-xl mx-auto">
                {cardsOrder.map((cardKey, index) => {
                  const meta = cardMetadata[cardKey];
                  const Icon = meta.icon;

                  return (
                    <motion.div
                      key={cardKey}
                      layout
                      className="p-3 sm:p-3.5 rounded-2xl bg-slate-950 border border-indigo-500/40 shadow-md flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-indigo-950 text-indigo-300 font-bold text-xs font-mono flex items-center justify-center border border-indigo-500/30">
                          {index + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-cyan-400" />
                            <strong className="text-sm font-bold text-white font-mono">
                              {cardKey}
                            </strong>
                          </div>
                          <span className="text-[11px] text-slate-400 block">{meta.desc}</span>
                        </div>
                      </div>

                      {/* Move Up and Down Action Controls */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-700 text-slate-300 transition-colors"
                          title="Pindahkan ke Atas"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === cardsOrder.length - 1}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-700 text-slate-300 transition-colors"
                          title="Pindahkan ke Bawah"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Verify & Reset Controls */}
              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  onClick={handleResetOrder}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Acak Ulang</span>
                </button>

                <button
                  onClick={handleCheckOrder}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/25"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PERIKSA SUSUNAN HIERARKI</span>
                </button>
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
                Misi Markas Detektif Objek Selesai!
              </h3>

              <div className="max-w-xs mx-auto my-2">
                <DetectiveByte mood="jump" size="sm" showBadge={false} />
              </div>

              <p className="text-slate-300 text-sm max-w-md mx-auto">
                Sempurna! Seluruh objek dokumen telah tersusun rapi dari FILE hingga CHARACTER. Detektif Byte melompat gembira!
              </p>

              <div className="inline-flex items-center gap-4 bg-slate-950/80 border border-emerald-500/30 px-6 py-3 rounded-2xl">
                <div>
                  <span className="text-xs text-slate-400 block">Total Skor Level 3</span>
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
                  <span>SIMPAN PROGRES & BUKA LEVEL 4</span>
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
