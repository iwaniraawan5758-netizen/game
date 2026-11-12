import React from 'react';
import { Flame, ShieldAlert, Cpu } from 'lucide-react';

interface TeacherFlameBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const TeacherFlameBadge: React.FC<TeacherFlameBadgeProps> = ({
  size = 'md',
  showLabel = true,
}) => {
  const sizeStyles = {
    sm: {
      text: 'text-sm sm:text-base',
      icon: 'w-4 h-4',
      badge: 'px-3 py-1.5',
    },
    md: {
      text: 'text-base sm:text-lg md:text-xl',
      icon: 'w-5 h-5',
      badge: 'px-4 py-2 sm:px-5 sm:py-2.5',
    },
    lg: {
      text: 'text-lg sm:text-2xl md:text-3xl',
      icon: 'w-6 h-6',
      badge: 'px-5 py-3 sm:px-6 sm:py-4',
    },
  };

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center rounded-2xl bg-gradient-to-r from-red-950/90 via-orange-950/80 to-amber-950/90 border-2 border-orange-500/60 shadow-xl shadow-orange-950/40 flame-badge backdrop-blur-md ${sizeStyles[size].badge}`}
    >
      {/* Background burning aura */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-600/20 via-orange-500/25 to-amber-500/20 blur-md pointer-events-none -z-10" />

      {showLabel && (
        <div className="flex items-center gap-1.5 mb-1 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-amber-300">
          <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse fill-orange-400" />
          <span>GURU PENGAMPU INFORMATIKA</span>
          <Cpu className="w-3.5 h-3.5 text-amber-400" />
        </div>
      )}

      {/* Fiery Slanted Informatics Name */}
      <div className="flex items-center gap-2">
        <Flame className={`${sizeStyles[size].icon} text-orange-400 fill-orange-500 animate-bounce shrink-0`} />
        <span className={`flame-text ${sizeStyles[size].text}`}>
          Samuel Ari Listyo, S. Kom
        </span>
        <Flame className={`${sizeStyles[size].icon} text-amber-400 fill-amber-500 animate-bounce shrink-0 delay-100`} />
      </div>
    </div>
  );
};
