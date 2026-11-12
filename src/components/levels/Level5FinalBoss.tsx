import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Flame,
  Zap,
  Clock,
  Heart,
  Shield,
  HelpCircle,
  ArrowRight,
  Trophy,
  Sparkles,
  Bot,
} from 'lucide-react';
import { LevelProgress, QuizQuestion } from '../../types/game';
import { GAME_LEVELS } from '../../data/gameContent';
import { DetectiveByte } from '../DetectiveByte';
import { RobiAssistant } from '../RobiAssistant';
import { audio } from '../../utils/audio';

interface Level5Props {
  progress: LevelProgress;
  onCompleteBossLevel: (score: number) => void;
  onBackToMap: () => void;
}

export const Level5FinalBoss: React.FC<Level5Props> = ({
  progress,
  onCompleteBossLevel,
  onBackToMap,
}) => {
  const levelInfo = GAME_LEVELS[5];
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [bossHp, setBossHp] = useState(100); // 100%
  const [bossState, setBossState] = useState<'idle' | 'hit' | 'defend' | 'defeated'>('idle');
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  // 20-second Countdown Timer
  const [timeLeft, setTimeLeft] = useState(20);
  const [timerActive, setTimerActive] = useState(true);

  // Laser Attack animation beam
  const [isFiringLaser, setIsFiringLaser] = useState(false);

  useEffect(() => {
    if (!timerActive || isAnswered || bossState === 'defeated') return;

    if (timeLeft <= 0) {
      // Timeout: automatically wrong
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timerActive, isAnswered, bossState]);

  const handleTimeout = () => {
    setIsAnswered(true);
    setTimerActive(false);
    audio.playWrong();
    setBossState('defend');
  };

  const handleSelectAnswer = (optKey: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswered) return;
    setIsAnswered(true);
    setTimerActive(false);
    setSelectedAnswer(optKey);

    const q = levelInfo.questions[currentQIndex];
    if (optKey === q.correctAnswer) {
      // Laser attack!
      audio.playBossHit();
      setIsFiringLaser(true);
      setBossState('hit');
      setScore((prev) => prev + 10);
      setBossHp((prev) => Math.max(0, prev - 10));

      setTimeout(() => {
        setIsFiringLaser(false);
        setBossState('idle');
      }, 700);
    } else {
      audio.playWrong();
      setBossState('defend');
      setTimeout(() => {
        setBossState('idle');
      }, 800);
    }
  };

  const handleNextQuestion = () => {
    audio.playClick();
    if (currentQIndex < levelInfo.questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(20);
      setTimerActive(true);
      setBossState('idle');
    } else {
      // Boss battle finished!
      setBossState('defeated');
      audio.playVictory();
    }
  };

  const handleFinishBossFight = () => {
    onCompleteBossLevel(score);
  };

  const currentQ = levelInfo.questions[currentQIndex];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Arena HUD */}
      <div className="bg-slate-900/90 border border-purple-800/60 rounded-3xl p-5 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">
              ARENA KASTIL FINAL BOSS
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              Pertarungan Robot Penjaga Digital
            </h2>
          </div>
        </div>

        {/* Boss HP Bar */}
        <div className="w-full sm:w-72">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-rose-400 flex items-center gap-1 font-mono">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              CYBER GUARDIAN BOSS
            </span>
            <span className="font-mono font-bold text-white">{bossHp}% HP</span>
          </div>
          <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden border border-rose-900/50 p-0.5">
            <motion.div
              animate={{ width: `${bossHp}%` }}
              transition={{ duration: 0.4 }}
              className={`h-full rounded-full ${
                bossHp > 50
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : bossHp > 20
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-rose-600 to-red-500 animate-pulse'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Main Arena Stage */}
      {bossState !== 'defeated' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left / Top: Boss Visual Sprite & Status */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-2 border-purple-500/50 bg-slate-950 shadow-2xl group">
              {/* Laser Attack Effect */}
              {isFiringLaser && (
                <div className="absolute inset-0 z-30 bg-cyan-400/40 flex items-center justify-center animate-ping" />
              )}

              {/* Boss Hit Vibration */}
              <motion.img
                animate={
                  bossState === 'hit'
                    ? { x: [-10, 10, -10, 10, 0], filter: ['brightness(2)', 'brightness(1)'] }
                    : bossState === 'defend'
                    ? { scale: [1, 1.05, 1] }
                    : { y: [0, -6, 0] }
                }
                transition={{ duration: 0.5, repeat: bossState === 'idle' ? Infinity : 0 }}
                src="/src/assets/images/cyber_boss_robot_1794457671025.jpg"
                alt="Cyber Guardian Boss"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />

              {/* Boss Shield Overlay on Wrong Answer */}
              {bossState === 'defend' && (
                <div className="absolute inset-0 bg-purple-900/50 backdrop-blur-xs flex items-center justify-center z-20">
                  <div className="flex flex-col items-center gap-1 text-purple-200">
                    <Shield className="w-12 h-12 text-purple-300 animate-bounce" />
                    <span className="text-xs font-mono font-bold">PERISAI BOSS BERTAHAN!</span>
                  </div>
                </div>
              )}

              {/* Status bar */}
              <div className="absolute bottom-2 inset-x-3 bg-slate-950/80 backdrop-blur-md rounded-xl p-1.5 border border-purple-500/30 text-[11px] text-center text-purple-300 font-mono">
                {bossHp > 0 ? `MODUS TEMPUR // DAYA: ${bossHp}%` : 'SISTEM BOSS MATI!'}
              </div>
            </div>

            {/* Detective Byte Support */}
            <div className="mt-4 flex items-center gap-3 bg-slate-900/80 border border-cyan-800/40 px-4 py-2 rounded-2xl">
              <span className="text-xs text-cyan-300 font-semibold font-mono">
                Skor Serangan: {score} / 100 Poin
              </span>
            </div>
          </div>

          {/* Right / Bottom: 20s Timed Challenge Card */}
          <div className="lg:col-span-7 bg-slate-900/95 border border-purple-800/60 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
            {/* Question Header & Countdown */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold">
                <HelpCircle className="w-4 h-4" />
                <span>TANTANGAN AKHIR {currentQIndex + 1} / 10</span>
              </div>

              {/* 20-Second Countdown Timer Badge */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs font-bold ${
                  timeLeft <= 5
                    ? 'bg-rose-950 border border-rose-500 text-rose-300 animate-ping'
                    : 'bg-slate-950 border border-slate-800 text-amber-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>WAKTU: {timeLeft}s</span>
              </div>
            </div>

            {/* Question Text */}
            <h3 className="text-lg sm:text-xl font-bold text-white font-display leading-snug">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQ.options.map((opt) => {
                const isChosen = selectedAnswer === opt.key;
                const isCorrect = opt.key === currentQ.correctAnswer;

                let style =
                  'bg-slate-950/80 border-slate-800 hover:border-purple-500/50 text-slate-200';
                if (isAnswered) {
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
                    disabled={isAnswered}
                    className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-3 transition-all ${style}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-bold font-mono text-purple-300 shrink-0">
                      {opt.key}
                    </span>
                    <span className="flex-1 pt-0.5">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Post-answer feedback */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-2 space-y-3"
              >
                <RobiAssistant
                  type={selectedAnswer === currentQ.correctAnswer ? 'success' : 'error'}
                  explanation={
                    selectedAnswer === currentQ.correctAnswer
                      ? `Tembakan energi tepat sasaran! Robot Boss kehilangan 10% daya. ${currentQ.explanation}`
                      : timeLeft <= 0
                      ? `Waktu habis! ${currentQ.explanation}`
                      : `Jawaban kurang tepat. Perisai Boss menyerap serangan! ${currentQ.explanation}`
                  }
                />

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-500/25"
                  >
                    <span>
                      {currentQIndex < levelInfo.questions.length - 1
                        ? 'Lanjut Soal Berikutnya'
                        : 'Lihat Hasil Pertarungan'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        /* Boss Defeated Victory Stage */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/90 border-2 border-yellow-500/50 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-2xl"
        >
          <div className="w-20 h-20 rounded-full bg-yellow-500/20 border-2 border-yellow-400 mx-auto flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <Trophy className="w-10 h-10 text-yellow-400 animate-bounce" />
          </div>

          <h3 className="text-3xl sm:text-4xl font-black text-white font-display">
            ROBOT PENJAGA DIGITAL BERHASIL DITAKLUKKAN!
          </h3>

          <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto">
            Selamat, Agen! Berkat kecerdasanmu menguasai seluruh seluk-beluk aplikasi perkantoran,
            sistem Digital Academy telah pulih dan kastil rahasia terbuka lebar!
          </p>

          <div className="inline-flex items-center gap-6 bg-slate-950/80 border border-yellow-500/30 px-8 py-4 rounded-2xl">
            <div>
              <span className="text-xs text-slate-400 block">Skor Ujian Akhir</span>
              <span className="text-3xl font-black text-yellow-400 font-mono">
                {score} / 100
              </span>
            </div>
            <div className="border-l border-slate-800 pl-6">
              <span className="text-xs text-slate-400 block">Bintang Diperoleh</span>
              <span className="text-2xl font-bold text-yellow-400">
                {score >= 90 ? '★★★' : score >= 70 ? '★★☆' : '★☆☆'}
              </span>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={handleFinishBossFight}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-black text-base shadow-2xl shadow-yellow-500/30 flex items-center gap-3 transition-transform hover:scale-105"
            >
              <span>BUKA HALAMAN KEMENANGAN & SERTIFIKAT</span>
              <Sparkles className="w-5 h-5 text-slate-950" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Back button */}
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
  );
};
