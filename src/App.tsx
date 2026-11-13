/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameScreen, LevelId, LevelProgress, PlayerProfile, PlayerRecord } from './types/game';
import {
  loadCurrentPlayer,
  saveCurrentPlayer,
  loadCurrentLevels,
  saveCurrentLevels,
  loadRecordsHistory,
  saveCompletedRecord,
  calculateStars,
  INITIAL_LEVELS,
} from './utils/storage';
import { audio } from './utils/audio';

import { TopNav } from './components/TopNav';
import { IntroCinematic } from './components/IntroCinematic';
import { MainMenu } from './components/MainMenu';
import { PlayerSetup } from './components/PlayerSetup';
import { AdventureMap } from './components/AdventureMap';
import { Level1CopyPaste } from './components/levels/Level1CopyPaste';
import { Level2Screenshot } from './components/levels/Level2Screenshot';
import { Level3DetektifObjek } from './components/levels/Level3DetektifObjek';
import { Level4MenuHome } from './components/levels/Level4MenuHome';
import { Level5FinalBoss } from './components/levels/Level5FinalBoss';
import { VictoryModal } from './components/VictoryModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { LearningHub } from './components/LearningHub';
import { GameGuide } from './components/GameGuide';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('MAIN_MENU');
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [levels, setLevels] = useState<Record<LevelId, LevelProgress>>(INITIAL_LEVELS);
  const [currentLevelId, setCurrentLevelId] = useState<LevelId>(1);
  const [recordsHistory, setRecordsHistory] = useState<PlayerRecord[]>([]);

  // Audio States
  const [soundEnabled, setSoundEnabled] = useState(audio.soundEnabled);
  const [musicEnabled, setMusicEnabled] = useState(audio.musicEnabled);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Initial load from localStorage
  useEffect(() => {
    // Memulai musik setelah interaksi pertama pemain
useEffect(() => {
  const startMusicAfterInteraction = () => {
    if (audio.musicEnabled) {
      audio.startMusic();
    }
  };

  window.addEventListener(
    'pointerdown',
    startMusicAfterInteraction,
    { once: true }
  );

  window.addEventListener(
    'keydown',
    startMusicAfterInteraction,
    { once: true }
  );

  return () => {
    window.removeEventListener(
      'pointerdown',
      startMusicAfterInteraction
    );

    window.removeEventListener(
      'keydown',
      startMusicAfterInteraction
    );
  };
}, []);
    const savedPlayer = loadCurrentPlayer();
    if (savedPlayer) setPlayer(savedPlayer);

    const savedLevels = loadCurrentLevels();
    setLevels(savedLevels);

    const history = loadRecordsHistory();
    setRecordsHistory(history);
  }, []);

  // Sync audio toggles
  const handleToggleSound = () => {
    const next = audio.toggleSound();
    setSoundEnabled(next);
  };

  const handleToggleMusic = () => {
    const next = audio.toggleMusic();
    setMusicEnabled(next);
  };

  // Profile save
  const handleSavePlayer = (newProfile: PlayerProfile) => {
    setPlayer(newProfile);
    saveCurrentPlayer(newProfile);
    setCurrentScreen('MAP_DASHBOARD');
  };

  // Total metrics
  const totalScore = (Object.values(levels) as LevelProgress[]).reduce(
    (acc, lvl) => acc + (lvl.score || 0),
    0
  );
  const totalStars = (Object.values(levels) as LevelProgress[]).reduce(
    (acc, lvl) => acc + (lvl.stars || 0),
    0
  );

  // Level Completion Handler
  const handleCompleteLevel = (levelId: LevelId, score: number) => {
    const stars = calculateStars(score);
    const updatedLevels = {
      ...levels,
      [levelId]: {
        ...levels[levelId],
        completed: true,
        score: Math.max(levels[levelId]?.score || 0, score),
        stars: Math.max(levels[levelId]?.stars || 0, stars),
        attempts: (levels[levelId]?.attempts || 0) + 1,
      },
    };

    // Unlock next level if available
    if (levelId < 5) {
      const nextLvlId = (levelId + 1) as LevelId;
      updatedLevels[nextLvlId] = {
        ...updatedLevels[nextLvlId],
        unlocked: true,
      };
    }

    setLevels(updatedLevels);
    saveCurrentLevels(updatedLevels);

    // If Level 5 completed, save completed record in student history
    if (levelId === 5 && player) {
      const record = saveCompletedRecord(player, updatedLevels);
      setRecordsHistory((prev) => [record, ...prev.filter((r) => r.id !== record.id)]);
      setCurrentScreen('VICTORY');
    } else {
      setCurrentScreen('MAP_DASHBOARD');
    }
  };

  const handleResetProgress = () => {
    setLevels(INITIAL_LEVELS);
    saveCurrentLevels(INITIAL_LEVELS);
    setCurrentScreen('MAP_DASHBOARD');
  };

  const handleAddNewPlayer = () => {
    setPlayer(null);
    setLevels(INITIAL_LEVELS);
    saveCurrentLevels(INITIAL_LEVELS);
    setCurrentScreen('PLAYER_SETUP');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Contract (hidden during full screen cinematic if desired, or present for audio controls) */}
      <TopNav
        currentScreen={currentScreen}
        setScreen={setCurrentScreen}
        player={player}
        totalScore={totalScore}
        totalStars={totalStars}
        soundEnabled={soundEnabled}
        musicEnabled={musicEnabled}
        onToggleSound={handleToggleSound}
        onToggleMusic={handleToggleMusic}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentScreen === 'INTRO_CINEMATIC' && (
          <IntroCinematic
            onStart={() => {
              if (player) {
                setCurrentScreen('MAP_DASHBOARD');
              } else {
                setCurrentScreen('PLAYER_SETUP');
              }
            }}
            onSkip={() => {
              setCurrentScreen('MAIN_MENU');
            }}
          />
        )}

        {currentScreen === 'MAIN_MENU' && (
          <MainMenu
            onStartAdventure={() => {
              if (player) {
                setCurrentScreen('MAP_DASHBOARD');
              } else {
                setCurrentScreen('INTRO_CINEMATIC');
              }
            }}
            onOpenGuide={() => setCurrentScreen('GUIDE')}
            onOpenLearningHub={() => setCurrentScreen('LEARNING_HUB')}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenAbout={() => setIsAboutOpen(true)}
            onOpenTeacherDashboard={() => setCurrentScreen('TEACHER_DASHBOARD')}
            hasExistingPlayer={!!player}
            playerName={player?.name}
          />
        )}

        {currentScreen === 'PLAYER_SETUP' && (
          <PlayerSetup
            existingProfile={player}
            onSaveProfile={handleSavePlayer}
            onBack={() => setCurrentScreen('MAIN_MENU')}
          />
        )}

        {currentScreen === 'MAP_DASHBOARD' && player && (
          <AdventureMap
            player={player}
            levels={levels}
            totalScore={totalScore}
            totalStars={totalStars}
            onSelectLevel={(id) => {
              setCurrentLevelId(id);
              setCurrentScreen('LEVEL_VIEW');
            }}
            onOpenVictory={() => setCurrentScreen('VICTORY')}
          />
        )}

        {/* Level Views */}
        {currentScreen === 'LEVEL_VIEW' && (
          <>
            {currentLevelId === 1 && (
              <Level1CopyPaste
                progress={levels[1]}
                onCompleteLevel={(score) => handleCompleteLevel(1, score)}
                onBackToMap={() => setCurrentScreen('MAP_DASHBOARD')}
              />
            )}
            {currentLevelId === 2 && (
              <Level2Screenshot
                progress={levels[2]}
                onCompleteLevel={(score) => handleCompleteLevel(2, score)}
                onBackToMap={() => setCurrentScreen('MAP_DASHBOARD')}
              />
            )}
            {currentLevelId === 3 && (
              <Level3DetektifObjek
                progress={levels[3]}
                onCompleteLevel={(score) => handleCompleteLevel(3, score)}
                onBackToMap={() => setCurrentScreen('MAP_DASHBOARD')}
              />
            )}
            {currentLevelId === 4 && (
              <Level4MenuHome
                progress={levels[4]}
                onCompleteLevel={(score) => handleCompleteLevel(4, score)}
                onBackToMap={() => setCurrentScreen('MAP_DASHBOARD')}
              />
            )}
            {currentLevelId === 5 && (
              <Level5FinalBoss
                progress={levels[5]}
                onCompleteBossLevel={(score) => handleCompleteLevel(5, score)}
                onBackToMap={() => setCurrentScreen('MAP_DASHBOARD')}
              />
            )}
          </>
        )}

        {currentScreen === 'VICTORY' && player && (
          <VictoryModal
            player={player}
            levels={levels}
            totalScore={totalScore}
            totalStars={totalStars}
            onPlayAgain={() => {
              handleResetProgress();
            }}
            onOpenLearningHub={() => setCurrentScreen('LEARNING_HUB')}
            onBackToMenu={() => setCurrentScreen('MAIN_MENU')}
          />
        )}

        {currentScreen === 'GUIDE' && (
          <GameGuide onBack={() => setCurrentScreen(player ? 'MAP_DASHBOARD' : 'MAIN_MENU')} />
        )}

        {currentScreen === 'LEARNING_HUB' && (
          <LearningHub
            onBack={() => setCurrentScreen(player ? 'MAP_DASHBOARD' : 'MAIN_MENU')}
          />
        )}

        {currentScreen === 'TEACHER_DASHBOARD' && (
          <TeacherDashboard
            records={recordsHistory}
            onRefreshRecords={() => {
              setRecordsHistory(loadRecordsHistory());
            }}
            onAddNewPlayer={handleAddNewPlayer}
            onBack={() => setCurrentScreen('MAIN_MENU')}
          />
        )}
      </main>

      {/* Global Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        soundEnabled={soundEnabled}
        musicEnabled={musicEnabled}
        onToggleSound={handleToggleSound}
        onToggleMusic={handleToggleMusic}
        onResetProgress={handleResetProgress}
      />

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
