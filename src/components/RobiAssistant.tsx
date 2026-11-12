import React from 'react';
import { motion } from 'motion/react';
import { Bot, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';

interface RobiAssistantProps {
  hint?: string;
  explanation?: string;
  type?: 'hint' | 'success' | 'error';
  compact?: boolean;
}

export const RobiAssistant: React.FC<RobiAssistantProps> = ({
  hint,
  explanation,
  type = 'hint',
  compact = false,
}) => {
  const content = explanation || hint;
  if (!content) return null;

  const bgStyles = {
    hint: 'from-blue-950/80 to-slate-900/90 border-cyan-500/30 text-cyan-200',
    success: 'from-emerald-950/80 to-slate-900/90 border-emerald-500/30 text-emerald-200',
    error: 'from-rose-950/80 to-slate-900/90 border-rose-500/30 text-rose-200',
  };

  const iconComponents = {
    hint: <Lightbulb className="w-4 h-4 text-amber-300" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`rounded-2xl bg-gradient-to-r ${bgStyles[type]} border p-3 md:p-4 shadow-lg backdrop-blur-md flex items-start gap-3`}
    >
      {/* Robi Robot Avatar Container */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="shrink-0 flex flex-col items-center"
      >
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br from-white via-cyan-100 to-sky-300 p-0.5 shadow-md shadow-cyan-500/20 flex items-center justify-center border border-cyan-300">
          <div className="w-full h-full bg-slate-900 rounded-[14px] flex flex-col items-center justify-center relative overflow-hidden">
            {/* LED Eyes */}
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${type === 'error' ? 'bg-rose-400' : 'bg-cyan-400'} animate-ping`} />
              <span className={`w-1.5 h-1.5 rounded-full ${type === 'error' ? 'bg-rose-400' : 'bg-cyan-400'}`} />
            </div>
            {/* Little smile */}
            <div className="w-3 h-0.5 bg-cyan-300 rounded-full" />
          </div>
        </div>
        <span className="text-[10px] font-bold text-cyan-300 tracking-wider mt-1 uppercase font-mono">
          ROBI
        </span>
      </motion.div>

      {/* Message content */}
      <div className="flex-1 text-xs md:text-sm">
        <div className="flex items-center gap-1.5 font-bold mb-1">
          {iconComponents[type]}
          <span className="text-white">
            {type === 'hint' ? 'Petunjuk Robi' : type === 'success' ? 'Catatan Detektif' : 'Analisis Robi'}
          </span>
        </div>
        <p className="text-slate-200 leading-relaxed">{content}</p>
      </div>
    </motion.div>
  );
};
