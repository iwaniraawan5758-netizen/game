import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Gamepad2,
  Sliders,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Palette,
  RotateCcw,
  Type,
  Heading1,
  Heading2,
  Check,
} from 'lucide-react';
import { LevelProgress } from '../../types/game';
import { GAME_LEVELS } from '../../data/gameContent';
import { RobiAssistant } from '../RobiAssistant';
import { audio } from '../../utils/audio';

interface Level4Props {
  progress: LevelProgress;
  onCompleteLevel: (score: number) => void;
  onBackToMap: () => void;
}

export const Level4MenuHome: React.FC<Level4Props> = ({
  progress,
  onCompleteLevel,
  onBackToMap,
}) => {
  const [activeTab, setActiveTab] = useState<'LEARN' | 'MISSION'>('LEARN');
  const levelInfo = GAME_LEVELS[4];

  // Learn ribbon demo state
  const [demoSelectedTab, setDemoSelectedTab] = useState<'CLIPBOARD' | 'FONT' | 'PARAGRAPH' | 'STYLES'>('FONT');

  // --- MISSION STATE ---
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [showAnswerResult, setShowAnswerResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0); // max 50

  // Live Interactive Word Processor Simulator State
  // Target:
  // 1. Bold = true
  // 2. Color = 'blue'
  // 3. Align = 'center'
  // 4. FontSize >= 20
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textColor, setTextColor] = useState<'default' | 'blue' | 'red' | 'emerald'>('default');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [fontSize, setFontSize] = useState<number>(14);
  const [headingStyle, setHeadingStyle] = useState<'Normal' | 'Heading 1' | 'Heading 2'>('Normal');

  const [simTasksCompleted, setSimTasksCompleted] = useState(false);
  const [interactiveScore, setInteractiveScore] = useState(0);

  const checkSimulationGoals = (
    boldVal: boolean,
    colorVal: string,
    alignVal: string,
    sizeVal: number
  ) => {
    const boldMet = boldVal;
    const colorMet = colorVal === 'blue';
    const alignMet = alignVal === 'center';
    const sizeMet = sizeVal >= 18;

    if (boldMet && colorMet && alignMet && sizeMet && !simTasksCompleted) {
      audio.playLevelUnlock();
      setSimTasksCompleted(true);
      setInteractiveScore(50);
    }
  };

  const handleToggleBold = () => {
    audio.playClick();
    const next = !isBold;
    setIsBold(next);
    checkSimulationGoals(next, textColor, alignment, fontSize);
  };

  const handleToggleItalic = () => {
    audio.playClick();
    setIsItalic(!isItalic);
  };

  const handleToggleUnderline = () => {
    audio.playClick();
    setIsUnderline(!isUnderline);
  };

  const handleColorChange = (color: 'default' | 'blue' | 'red' | 'emerald') => {
    audio.playClick();
    setTextColor(color);
    checkSimulationGoals(isBold, color, alignment, fontSize);
  };

  const handleAlignmentChange = (align: 'left' | 'center' | 'right' | 'justify') => {
    audio.playClick();
    setAlignment(align);
    checkSimulationGoals(isBold, textColor, align, fontSize);
  };

  const handleFontSizeChange = (delta: number) => {
    audio.playClick();
    const next = Math.max(10, Math.min(32, fontSize + delta));
    setFontSize(next);
    checkSimulationGoals(isBold, textColor, alignment, next);
  };

  const handleResetSim = () => {
    audio.playClick();
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    setTextColor('default');
    setAlignment('left');
    setFontSize(14);
    setHeadingStyle('Normal');
    setSimTasksCompleted(false);
    setInteractiveScore(0);
  };

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

  const isQuizFinished = Object.keys(selectedAnswers).length === levelInfo.questions.length;
  const isMissionFinished = isQuizFinished && simTasksCompleted;
  const totalMissionScore = quizScore + interactiveScore;

  const handleFinishMission = () => {
    audio.playVictory();
    onCompleteLevel(totalMissionScore);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-slate-900 border border-teal-800/60 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">
              LEVEL 04 // PUSAT KENDALI MENU HOME
            </span>
            <span className="text-xs text-slate-400">· 100 Poin Maksimal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
            {levelInfo.title}
          </h2>
          <p className="text-xs sm:text-sm text-teal-200/80 mt-1 max-w-xl">
            {levelInfo.objective}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-950/80 rounded-2xl border border-teal-800/50">
          <button
            onClick={() => {
              audio.playClick();
              setActiveTab('LEARN');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'LEARN'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md'
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
                ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md'
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
          {/* Simulated Microsoft Word Ribbon Exploration */}
          <div className="bg-slate-900/95 border border-teal-800/60 rounded-3xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between gap-2 mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-teal-400" />
                <h3 className="text-lg font-bold text-white font-display">
                  Eksplorasi Pita Perintah (Ribbon) Menu Home
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Klik kelompok untuk melihat fungsi</span>
            </div>

            {/* Ribbon Group Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {(['CLIPBOARD', 'FONT', 'PARAGRAPH', 'STYLES'] as const).map((group) => (
                <button
                  key={group}
                  onClick={() => {
                    audio.playClick();
                    setDemoSelectedTab(group);
                  }}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all ${
                    demoSelectedTab === group
                      ? 'bg-teal-950 border-teal-400 text-teal-200 shadow-md ring-1 ring-teal-400'
                      : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  Kelompok {group}
                </button>
              ))}
            </div>

            {/* Group Detail Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 min-h-[160px]">
              {demoSelectedTab === 'CLIPBOARD' && (
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-teal-300">1. Kelompok Clipboard</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Menampung perintah pemindahan objek: <strong>Cut (Ctrl + X)</strong> untuk memotong,{' '}
                    <strong>Copy (Ctrl + C)</strong> untuk menyalin, dan <strong>Paste (Ctrl + V)</strong> untuk menempelkan.
                    Dilengkapi fitur <em>Format Painter</em> untuk menduplikasi gaya huruf dari satu teks ke teks lain tanpa mengetik ulang.
                  </p>
                </div>
              )}

              {demoSelectedTab === 'FONT' && (
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-teal-300">2. Kelompok Font</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Pusat penataan tipografi teks: mengubah jenis font (Calibri, Times New Roman, Arial), ukuran huruf (Font Size),
                    warna huruf (Font Color), penanda stabilo (Text Highlight), serta format aksen seperti <strong>Bold (B)</strong>,{' '}
                    <em>Italic (I)</em>, dan <u>Underline (U)</u>.
                  </p>
                </div>
              )}

              {demoSelectedTab === 'PARAGRAPH' && (
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-teal-300">3. Kelompok Paragraph</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Mengatur tatanan paragraf: Perataan (Align Left, Center, Align Right, Justify), penomoran angka (Numbering),
                    simbol butir (Bullets), spasi antaris (Line Spacing), serta indentasi batas kiri-kanan.
                  </p>
                </div>
              )}

              {demoSelectedTab === 'STYLES' && (
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-teal-300">4. Kelompok Styles</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Koleksi format gaya cepat terstandarisasi seperti <strong>Normal</strong> (teks isi), <strong>Heading 1</strong> (judul bab utama),
                    dan <strong>Heading 2</strong> (sub-bab). Sangat krusial agar Microsoft Word dapat membuat <em>Daftar Isi Otomatis</em> dengan cepat!
                  </p>
                </div>
              )}
            </div>
          </div>

          <RobiAssistant
            hint="Perhatikan: Fitur Bold (ikon B) digunakan untuk menebalkan teks. Kelompok Font mengatur huruf, sedangkan Kelompok Paragraph mengatur susunan perataan teks (kiri, tengah, kanan, justify)!"
          />

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                audio.playClick();
                setActiveTab('MISSION');
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-teal-500/25"
            >
              <span>SIAP SIMULASI KENDALI, MULAI MISI!</span>
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
            <span className="font-mono text-teal-300 font-bold">
              Skor Terkumpul: {totalMissionScore} / 100 Poin
            </span>
          </div>

          {/* Section A: 5 Questions */}
          {!isQuizFinished && (
            <div className="bg-slate-900/95 border border-teal-800/60 rounded-3xl p-6 shadow-2xl space-y-4">
              {(() => {
                const q = levelInfo.questions[currentQIndex];
                const selected = selectedAnswers[q.id];

                return (
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-2">
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
                          'bg-slate-950/80 border-slate-800 hover:border-teal-500/50 text-slate-200';
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
                            <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-bold font-mono text-teal-300 shrink-0">
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
                            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2"
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

          {/* Section B: Live Interactive Word Processor Simulator (50 pts) */}
          {isQuizFinished && !simTasksCompleted && (
            <div className="bg-slate-900/95 border border-teal-800/60 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono text-teal-400 font-bold uppercase">
                    BAGIAN 2 // SIMULASI PRAKTIK FORMAT DOKUMEN
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white font-display">
                    Atur Format Teks Paragraf di Bawah Ini!
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Gunakan tombol kontrol di pita ribbon untuk memenuhi 4 syarat detektif:
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-yellow-400 font-mono font-bold">+50 Poin</span>
                </div>
              </div>

              {/* Mission Objectives Checklist */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div
                  className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                    isBold
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Check className={`w-4 h-4 ${isBold ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>1. Buat Tebal (Bold)</span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                    textColor === 'blue'
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Check className={`w-4 h-4 ${textColor === 'blue' ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>2. Warna Huruf Biru</span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                    alignment === 'center'
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Check className={`w-4 h-4 ${alignment === 'center' ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>3. Atur Rata Tengah</span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                    fontSize >= 18
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Check className={`w-4 h-4 ${fontSize >= 18 ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>4. Perbesar Huruf (≥18px)</span>
                </div>
              </div>

              {/* Simulated MS Word Ribbon Bar */}
              <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-3 shadow-inner space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-400 font-mono">PITA MENU HOME</span>
                  </div>
                  <button
                    onClick={handleResetSim}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Format
                  </button>
                </div>

                {/* Toolbar Buttons Row */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Font Format: Bold, Italic, Underline */}
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                    <button
                      onClick={handleToggleBold}
                      className={`p-2 rounded-lg font-bold text-xs transition-colors ${
                        isBold ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                      title="Bold (Tebal)"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleToggleItalic}
                      className={`p-2 rounded-lg italic text-xs transition-colors ${
                        isItalic ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                      title="Italic (Miring)"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleToggleUnderline}
                      className={`p-2 rounded-lg underline text-xs transition-colors ${
                        isUnderline ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                      title="Underline (Garis Bawah)"
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Font Size (+/-) */}
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                    <button
                      onClick={() => handleFontSizeChange(-2)}
                      className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                    >
                      A-
                    </button>
                    <span className="px-2 text-xs font-mono font-bold text-cyan-300">
                      {fontSize}px
                    </span>
                    <button
                      onClick={() => handleFontSizeChange(2)}
                      className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                    >
                      A+
                    </button>
                  </div>

                  {/* Color Selector */}
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                    <span className="text-[10px] text-slate-400 pl-1">Warna:</span>
                    <button
                      onClick={() => handleColorChange('default')}
                      className={`w-5 h-5 rounded-full bg-slate-100 border ${
                        textColor === 'default' ? 'ring-2 ring-white scale-110' : ''
                      }`}
                      title="Putih / Default"
                    />
                    <button
                      onClick={() => handleColorChange('blue')}
                      className={`w-5 h-5 rounded-full bg-cyan-400 border border-cyan-200 ${
                        textColor === 'blue' ? 'ring-2 ring-cyan-400 scale-110' : ''
                      }`}
                      title="Biru"
                    />
                    <button
                      onClick={() => handleColorChange('red')}
                      className={`w-5 h-5 rounded-full bg-rose-500 border border-rose-200 ${
                        textColor === 'red' ? 'ring-2 ring-rose-400 scale-110' : ''
                      }`}
                      title="Merah"
                    />
                  </div>

                  {/* Alignment buttons */}
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                    <button
                      onClick={() => handleAlignmentChange('left')}
                      className={`p-2 rounded-lg transition-colors ${
                        alignment === 'left' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                      title="Rata Kiri"
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleAlignmentChange('center')}
                      className={`p-2 rounded-lg transition-colors ${
                        alignment === 'center' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                      title="Rata Tengah"
                    >
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleAlignmentChange('right')}
                      className={`p-2 rounded-lg transition-colors ${
                        alignment === 'right' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                      title="Rata Kanan"
                    >
                      <AlignRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Simulated Document Sheet Preview */}
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 min-h-[140px] flex items-center justify-center">
                  <p
                    style={{
                      fontSize: `${fontSize}px`,
                      textAlign: alignment,
                    }}
                    className={`transition-all duration-200 w-full leading-relaxed ${
                      isBold ? 'font-black' : 'font-normal'
                    } ${isItalic ? 'italic' : ''} ${isUnderline ? 'underline' : ''} ${
                      textColor === 'blue'
                        ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                        : textColor === 'red'
                        ? 'text-rose-400'
                        : 'text-white'
                    }`}
                  >
                    INFORMATIKA ADALAH ILMU YANG MEMPELAJARI PENGOLAHAN INFORMASI.
                  </p>
                </div>
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
                Misi Pusat Kendali Menu Home Selesai!
              </h3>

              <p className="text-slate-300 text-sm max-w-md mx-auto">
                Luar biasa! Kamu telah menguasai kelompok Font, Paragraph, Clipboard, dan Styles. Pintu Kastil Final Boss kini terbuka!
              </p>

              <div className="inline-flex items-center gap-4 bg-slate-950/80 border border-emerald-500/30 px-6 py-3 rounded-2xl">
                <div>
                  <span className="text-xs text-slate-400 block">Total Skor Level 4</span>
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
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-purple-500/25 animate-pulse"
                >
                  <span>MASUKI KASTIL FINAL BOSS</span>
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
