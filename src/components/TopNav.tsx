import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Star,
  Award,
  BookOpen,
  HelpCircle,
  Users,
  MapPin,
  Menu,
  X,
} from 'lucide-react';
import { GameScreen, PlayerProfile } from '../types/game';
import { audio } from '../utils/audio';

interface TopNavProps {
  currentScreen: GameScreen;
  setScreen: (screen: GameScreen) => void;
  player: PlayerProfile | null;
  totalScore: number;
  totalStars: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentScreen,
  setScreen,
  player,
  totalScore,
  totalStars,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (screen: GameScreen) => {
    audio.playClick();
    setScreen(screen);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-900/40 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNav(player ? 'MAP_DASHBOARD' : 'MAIN_MENU')}
          className="text-left group flex items-center gap-2.5 shrink-0 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 p-0.5 shadow-md shadow-cyan-500/20 flex items-center justify-center">
            <span className="font-display font-black text-white text-base">D</span>
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors font-display whitespace-nowrap">
              Misi Detektif Digital
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {player && (
            <button
              onClick={() => handleNav('MAP_DASHBOARD')}
              className={`hover:text-cyan-400 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                currentScreen === 'MAP_DASHBOARD' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              <MapPin className="w-4 h-4 text-cyan-400" /> Peta Misi
            </button>
          )}
          <button
            onClick={() => handleNav('LEARNING_HUB')}
            className={`hover:text-cyan-400 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentScreen === 'LEARNING_HUB' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            <BookOpen className="w-4 h-4 text-sky-400" /> Materi
          </button>
          <button
            onClick={() => handleNav('GUIDE')}
            className={`hover:text-cyan-400 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentScreen === 'GUIDE' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-400" /> Panduan
          </button>
          <button
            onClick={() => handleNav('TEACHER_DASHBOARD')}
            className={`hover:text-cyan-400 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentScreen === 'TEACHER_DASHBOARD' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            <Users className="w-4 h-4 text-indigo-400" /> Dashboard Guru
          </button>
        </nav>

        {/* Zone 3: Audio Toggles & Player HUD */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Audio controls */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => {
                audio.playClick();
                onToggleMusic();
              }}
              title={musicEnabled ? 'Matikan Musik' : 'Nyalakan Musik'}
              className={`p-1.5 rounded-md transition-colors ${
                musicEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Music className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                audio.playClick();
                onToggleSound();
              }}
              title={soundEnabled ? 'Matikan Efek Suara' : 'Nyalakan Efek Suara'}
              className={`p-1.5 rounded-md transition-colors ${
                soundEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Player stats chip */}
          {player ? (
            <div className="flex items-center gap-2 bg-slate-900/90 border border-cyan-800/50 rounded-xl px-2.5 py-1.5 text-xs">
              <div className="flex items-center gap-1 text-yellow-400 font-bold font-mono">
                <Star className="w-3.5 h-3.5 fill-yellow-400" />
                <span>{totalStars}</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-1 text-cyan-300 font-bold font-mono">
                <Award className="w-3.5 h-3.5" />
                <span>{totalScore}</span>
              </div>
              <div className="hidden sm:block border-l border-slate-800 pl-2">
                <span className="text-slate-300 font-medium truncate max-w-[90px] inline-block">
                  {player.name}
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleNav('PLAYER_SETUP')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg shadow-md shadow-cyan-900/30 transition-all whitespace-nowrap"
            >
              Mulai Main
            </button>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 space-y-2">
          {player && (
            <button
              onClick={() => handleNav('MAP_DASHBOARD')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-cyan-400 hover:bg-slate-900 flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" /> Peta Misi
            </button>
          )}
          <button
            onClick={() => handleNav('LEARNING_HUB')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-900 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-sky-400" /> Materi Pembelajaran
          </button>
          <button
            onClick={() => handleNav('GUIDE')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-900 flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" /> Panduan Permainan
          </button>
          <button
            onClick={() => handleNav('TEACHER_DASHBOARD')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-900 flex items-center gap-2"
          >
            <Users className="w-4 h-4 text-indigo-400" /> Dashboard Guru
          </button>
        </div>
      )}
    </header>
  );
};
