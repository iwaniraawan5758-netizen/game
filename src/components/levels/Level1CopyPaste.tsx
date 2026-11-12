import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Gamepad2,
  Copy,
  Scissors,
  ClipboardPaste,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { LevelProgress, QuizQuestion } from '../../types/game';
import { GAME_LEVELS } from '../../data/gameContent';
import { RobiAssistant } from '../RobiAssistant';
import { DetectiveByte } from '../DetectiveByte';
import { audio } from '../../utils/audio';

interface Level1Props {
  progress: LevelProgress;
  onCompleteLevel: (score: number) => void;
  onBackToMap: () => void;
}

export const Level1CopyPaste: React.FC<Level1Props> = ({
  progress,
  onCompleteLevel,
  onBackToMap,
}) => {
  const [activeTab, setActiveTab] = useState<'LEARN' | 'MISSION'>('LEARN');
  const levelInfo = GAME_LEVELS[1];

  // Interactive Learn Simulation State
  const [simClipboard, setSimClipboard] = useState<string | null>(null);
  const [simSourceText, setSimSourceText] = useState('Data Nilai Siswa: 95, 88, 92');
  const [simTargetText, setSimTargetText] = useState('');
  const [simActionMessage, setSimActionMessage] = useState('Klik salah satu tombol perintah di bawah:');

  const handleSimCopy = () => {
    audio.playClick();
    setSimClipboard(simSourceText);
    setSimActionMessage('✓ Teks berhasil disalin ke Clipboard! Objek asli di Excel tetap aman.');
  };

  const handleSimCut = () => {
    audio.playClick();
    setSimClipboard(simSourceText);
    setSimSourceText('');
    setSimActionMessage('✂ Teks dipotong! Objek hilang dari Excel dan siap dipindahkan.');
  };

  const handleSimPaste = () => {
    if (!simClipboard) {
      audio.playWrong();
      setSimActionMessage('⚠ Clipboard masih kosong! Lakukan Copy atau Cut terlebih dahulu.');
      return;
    }
    audio.playCorrect();
    setSimTargetText(simClipboard);
    setSimActionMessage('★ Teks berhasil ditempelkan (Paste) ke dokumen Word!');
  };

  const handleResetSim = () => {
    audio.playClick();
    setSimSourceText('Data Nilai Siswa: 95, 88, 92');
    setSimTargetText('');
    setSimClipboard(null);
    setSimActionMessage('Simulasi di-reset. Coba alur Copy atau Cut lalu Paste!');
  };

  // --- MISSION STATE ---
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [showAnswerResult, setShowAnswerResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0); // 10 pts per question (max 50)

  // Drag / Click Matching Challenge
  interface CardPair {
    id: string;
    term: string;
    definition: string;
    color: string;
    icon: typeof Copy;
  }

  const initialCards: CardPair[] = [
    {
      id: 'COPY',
      term: 'COPY',
      definition: 'Menyalin objek tanpa menghilangkan objek aslinya dari lokasi awal.',
      color: 'from-blue-600 to-cyan-600',
      icon: Copy,
    },
    {
      id: 'CUT',
      term: 'CUT',
      definition: 'Memotong atau memindahkan objek dari lokasi asal ke clipboard.',
      color: 'from-indigo-600 to-purple-600',
      icon: Scissors,
    },
    {
      id: 'PASTE',
      term: 'PASTE',
      definition: 'Menempelkan objek yang sudah disalin atau dipotong ke posisi kursor.',
      color: 'from-emerald-600 to-teal-600',
      icon: ClipboardPaste,
    },
  ];

  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // definitionId -> term
  const [matchingCompleted, setMatchingCompleted] = useState(false);
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

  // Pair Matching Logic
  const handleTermClick = (term: string) => {
    audio.playClick();
    setSelectedTerm(term);
  };

  const handleDefinitionClick = (definitionId: string) => {
    if (!selectedTerm) {
      audio.playWrong();
      return;
    }

    if (selectedTerm === definitionId) {
      // Correct match!
      audio.playCorrect();
      const newMatches = { ...matches, [definitionId]: selectedTerm };
      setMatches(newMatches);
      setSelectedTerm(null);

      if (Object.keys(newMatches).length === 3) {
        audio.playLevelUnlock();
        setMatchingCompleted(true);
        setInteractiveScore(50);
      }
    } else {
      audio.playWrong();
    }
  };

  const isQuizFinished = Object.keys(selectedAnswers).length === levelInfo.questions.length;
  const isMissionFinished = isQuizFinished && matchingCompleted;
  const totalMissionScore = quizScore + interactiveScore;

  const handleFinishMission = () => {
    audio.playVictory();
    onCompleteLevel(totalMissionScore);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-900 border border-cyan-800/60 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              LEVEL 01 // LABORATORIUM
            </span>
            <span className="text-xs text-slate-400">· 100 Poin Maksimal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
            {levelInfo.title}
          </h2>
          <p className="text-xs sm:text-sm text-cyan-200/80 mt-1 max-w-xl">
            {levelInfo.objective}
          </p>
        </div>

        {/* Tab Switcher: Belajar Dulu vs Coba Misi */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-950/80 rounded-2xl border border-cyan-800/50">
          <button
            onClick={() => {
              audio.playClick();
              setActiveTab('LEARN');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'LEARN'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
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
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
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
          {/* Interactive Simulation Console */}
          <div className="bg-slate-900/90 border border-cyan-800/60 rounded-3xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white font-display">
                  Simulasi Praktik: Memindahkan Data Excel ke Word
                </h3>
              </div>
              <button
                onClick={handleResetSim}
                className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Two Simulated Windows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              {/* Excel Window */}
              <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4 shadow-inner">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-3">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Microsoft Excel (Aplikasi Sumber)</span>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 min-h-[90px] flex items-center justify-center">
                  {simSourceText ? (
                    <div className="bg-emerald-950/60 border border-emerald-500/40 px-3 py-2 rounded-lg text-emerald-200 text-sm font-mono flex items-center gap-2 animate-pulse">
                      <span>{simSourceText}</span>
                    </div>
                  ) : (
                    <span className="text-slate-500 text-xs italic">
                      [Teks telah dipotong (Cut) ke Clipboard]
                    </span>
                  )}
                </div>
              </div>

              {/* Word Window */}
              <div className="bg-slate-950 border border-blue-500/40 rounded-2xl p-4 shadow-inner">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-3">
                  <FileText className="w-4 h-4" />
                  <span>Microsoft Word (Aplikasi Tujuan)</span>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 min-h-[90px] flex items-center justify-center">
                  {simTargetText ? (
                    <div className="bg-blue-950/60 border border-blue-500/40 px-3 py-2 rounded-lg text-blue-200 text-sm font-mono flex items-center gap-2">
                      <span>{simTargetText}</span>
                    </div>
                  ) : (
                    <span className="text-slate-500 text-xs italic">
                      [Lembar Word masih kosong. Lakukan Paste]
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Control Ribbon */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleSimCopy}
                disabled={!simSourceText}
                className="px-4 py-2.5 rounded-xl bg-blue-600/90 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Copy className="w-4 h-4" />
                <span>1. COPY (Salin Teks)</span>
              </button>

              <button
                onClick={handleSimCut}
                disabled={!simSourceText}
                className="px-4 py-2.5 rounded-xl bg-purple-600/90 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Scissors className="w-4 h-4" />
                <span>Atau CUT (Potong Teks)</span>
              </button>

              <button
                onClick={handleSimPaste}
                disabled={!simClipboard}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all disabled:opacity-50 shadow-md shadow-emerald-500/20"
              >
                <ClipboardPaste className="w-4 h-4" />
                <span>2. PASTE (Tempel ke Word)</span>
              </button>
            </div>

            {/* Live Action Feedback */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-cyan-800/40 text-center text-xs font-mono text-cyan-300">
              {simActionMessage}
            </div>
          </div>

          {/* Theory Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {levelInfo.learnPoints.slice(0, 3).map((point, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 shadow-lg transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-base font-bold text-white font-display">{point.title}</h4>
                  {point.tag && (
                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-md border border-cyan-500/30">
                      {point.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">{point.description}</p>
                {point.example && (
                  <div className="bg-slate-950/70 p-2.5 rounded-xl text-[11px] text-slate-400 border border-slate-800">
                    <strong className="text-cyan-300 block mb-0.5">Contoh:</strong>
                    {point.example}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Robi Helper Tip */}
          <RobiAssistant
            hint="Ingat trik detektif: COPY mempertahankan objek asli, sedangkan CUT memotong dan memindahkan objek secara utuh. Shortcut penting: Ctrl + C (Copy), Ctrl + X (Cut), Ctrl + V (Paste)!"
          />

          {/* Ready to challenge button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                audio.playClick();
                setActiveTab('MISSION');
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25"
            >
              <span>SAYA SUDAH PAHAM, MULAI MISI!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 2: COBA MISI ================= */}
      {activeTab === 'MISSION' && (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800">
            <span>
              Bagian 1: Soal Pilihan Ganda ({Math.min(currentQIndex + 1, levelInfo.questions.length)} dari 5)
            </span>
            <span className="font-mono text-cyan-300 font-bold">
              Skor Terkumpul: {totalMissionScore} / 100 Poin
            </span>
          </div>

          {/* Section A: Multiple Choice Questions */}
          {!isQuizFinished && (
            <div className="bg-slate-900/95 border border-cyan-800/60 rounded-3xl p-6 shadow-2xl space-y-4">
              {(() => {
                const q = levelInfo.questions[currentQIndex];
                const selected = selectedAnswers[q.id];

                return (
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
                      <HelpCircle className="w-4 h-4" />
                      <span>PERTANYAAN 0{currentQIndex + 1}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white font-display mb-4">
                      {q.question}
                    </h3>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {q.options.map((opt) => {
                        const isChosen = selected === opt.key;
                        const isCorrect = opt.key === q.correctAnswer;

                        let style =
                          'bg-slate-950/80 border-slate-800 hover:border-cyan-500/50 text-slate-200';
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
                            <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-bold font-mono text-cyan-300 shrink-0">
                              {opt.key}
                            </span>
                            <span className="flex-1 pt-0.5">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback Explanation */}
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
                            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2"
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

          {/* Section B: Matching Cards Challenge (50 pts) */}
          {isQuizFinished && !matchingCompleted && (
            <div className="bg-slate-900/95 border border-cyan-800/60 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                    BAGIAN 2 // TANTANGAN INTERAKTIF
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white font-display">
                    Pasangkan Kartu Perintah dengan Pengertian yang Tepat!
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Klik satu kartu Perintah (kiri), lalu klik Kotak Pengertian yang cocok (kanan).
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-yellow-400 font-mono font-bold">+50 Poin</span>
                </div>
              </div>

              {/* Matching Area */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left: Term Cards */}
                <div className="md:col-span-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Pilih Kartu Perintah:
                  </h4>
                  {initialCards.map((c) => {
                    const isMatched = Object.values(matches).includes(c.term);
                    const isSelected = selectedTerm === c.term;

                    return (
                      <button
                        key={c.id}
                        onClick={() => handleTermClick(c.term)}
                        disabled={isMatched}
                        className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          isMatched
                            ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300 opacity-60'
                            : isSelected
                            ? 'bg-cyan-950 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400'
                            : 'bg-slate-950 border-slate-800 hover:border-cyan-500/50 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <c.icon className="w-5 h-5 text-cyan-400" />
                          <span className="font-bold font-mono tracking-wider">{c.term}</span>
                        </div>
                        {isMatched ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : isSelected ? (
                          <span className="text-[10px] text-cyan-300 font-bold uppercase animate-pulse">
                            Dipilih
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                {/* Right: Definition Dropzones */}
                <div className="md:col-span-7 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Kotak Pengertian:
                  </h4>
                  {initialCards.map((c) => {
                    const matchedTerm = matches[c.id];

                    return (
                      <button
                        key={c.id}
                        onClick={() => handleDefinitionClick(c.id)}
                        disabled={!!matchedTerm}
                        className={`w-full p-4 rounded-2xl border text-left transition-all ${
                          matchedTerm
                            ? 'bg-emerald-950/70 border-emerald-400 text-white'
                            : 'bg-slate-950/80 border-slate-800 hover:border-cyan-400/60 text-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-xs sm:text-sm leading-relaxed">{c.definition}</p>
                          {matchedTerm ? (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold font-mono shrink-0">
                              ✓ {matchedTerm}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 border border-slate-800 px-2 py-0.5 rounded shrink-0">
                              Klik pasangkan
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Mission Complete Summary Card */}
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
                Misi Laboratorium Copy Paste Selesai!
              </h3>

              <p className="text-slate-300 text-sm max-w-md mx-auto">
                Luar biasa, Detektif! Kamu berhasil menuntaskan seluruh kuis dan tantangan pasangan kartu dengan skor maksimal!
              </p>

              <div className="inline-flex items-center gap-4 bg-slate-950/80 border border-emerald-500/30 px-6 py-3 rounded-2xl">
                <div>
                  <span className="text-xs text-slate-400 block">Total Skor Level 1</span>
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
                  <span>SIMPAN PROGRES & BUKA LEVEL 2</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Bottom Back Button */}
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
