
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  GameScreen,
  LevelId,
  LevelProgress,
  PlayerProfile,
  PlayerRecord,
} from './types/game';

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

  // ==========================================
  // GAME STATES
  // ==========================================

  const [currentScreen, setCurrentScreen] =
    useState<GameScreen>('MAIN_MENU');

  const [player, setPlayer] =
    useState<PlayerProfile | null>(null);

  const [levels, setLevels] =
    useState<Record<LevelId, LevelProgress>>(INITIAL_LEVELS);

  const [currentLevelId, setCurrentLevelId] =
    useState<LevelId>(1);

  const [recordsHistory, setRecordsHistory] =
    useState<PlayerRecord[]>([]);


  // ==========================================
  // AUDIO STATES
  // ==========================================

  const [soundEnabled, setSoundEnabled] =
    useState(audio.soundEnabled);

  const [musicEnabled, setMusicEnabled] =
    useState(audio.musicEnabled);


  // ==========================================
  // MODAL STATES
  // ==========================================

  const [isSettingsOpen, setIsSettingsOpen] =
    useState(false);

  const [isAboutOpen, setIsAboutOpen] =
    useState(false);


  // ==========================================
  // INITIAL LOAD FROM LOCAL STORAGE
  // ==========================================

  useEffect(() => {

    const savedPlayer = loadCurrentPlayer();

    if (savedPlayer) {
      setPlayer(savedPlayer);
    }

    const savedLevels = loadCurrentLevels();

    setLevels(savedLevels);

    const history = loadRecordsHistory();

    setRecordsHistory(history);

  }, []);


  // ==========================================
  // START MUSIC AFTER FIRST USER INTERACTION
  // ==========================================

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


  // ==========================================
  // SYNC AUDIO TOGGLES
  // ==========================================

  const handleToggleSound = () => {

    audio.toggleSound();

    setSoundEnabled(audio.soundEnabled);

  };


  const handleToggleMusic = () => {

    audio.toggleMusic();

    setMusicEnabled(audio.musicEnabled);

  };


  // ==========================================
  // SAVE PLAYER PROFILE
  // ==========================================

  const handleSavePlayer = (newProfile: PlayerProfile) => {

    setPlayer(newProfile);

    saveCurrentPlayer(newProfile);

    setCurrentScreen('MAP_DASHBOARD');

  };


  // ==========================================
  // TOTAL SCORE AND STARS
  // ==========================================

  const totalScore = (
    Object.values(levels) as LevelProgress[]
  ).reduce(
    (acc, lvl) => acc + (lvl.score || 0),
    0
  );


  const totalStars = (
    Object.values(levels) as LevelProgress[]
  ).reduce(
    (acc, lvl) => acc + (lvl.stars || 0),
    0
  );


  // ==========================================
  // LEVEL COMPLETION HANDLER
  // ==========================================

  const handleCompleteLevel = (
    levelId: LevelId,
    score: number
  ) => {

    const stars = calculateStars(score);

    const updatedLevels = {
      ...levels,

      [levelId]: {
        ...levels[levelId],

        completed: true,

        score: Math.max(
          levels[levelId]?.score || 0,
          score
        ),

        stars: Math.max(
          levels[levelId]?.stars || 0,
          stars
        ),

        attempts:
          (levels[levelId]?.attempts || 0) + 1,
      },
    };


    // Unlock next level

    if (levelId < 5) {

      const nextLvlId = (levelId + 1) as LevelId;

      updatedLevels[nextLvlId] = {
        ...updatedLevels[nextLvlId],

        unlocked: true,
      };

    }


    setLevels(updatedLevels);

    saveCurrentLevels(updatedLevels);


    // Save final level record

    if (levelId === 5 && player) {

      const record = saveCompletedRecord(
        player,
        updatedLevels
      );

      setRecordsHistory((prev) => [
        record,
        ...prev.filter((r) => r.id !== record.id),
      ]);

      setCurrentScreen('VICTORY');

    } else {

      setCurrentScreen('MAP_DASHBOARD');

    }

  };


  // ==========================================
  // RESET PROGRESS
  // ==========================================

  const handleResetProgress = () => {

    setLevels(INITIAL_LEVELS);

    saveCurrentLevels(INITIAL_LEVELS);

    setCurrentScreen('MAP_DASHBOARD');

  };


  // ==========================================
  // ADD NEW PLAYER
  // ==========================================

  const handleAddNewPlayer = () => {

    setPlayer(null);

    setLevels(INITIAL_LEVELS);

    saveCurrentLevels(INITIAL_LEVELS);

    setCurrentScreen('PLAYER_SETUP');

  };


  // ==========================================
  // MAIN RENDER
  // ==========================================

  return (

    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">


      {/* ======================================
          TOP NAVIGATION
      ====================================== */}

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


      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="flex-1">


        {/* INTRO CINEMATIC */}

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


        {/* MAIN MENU */}

        {currentScreen === 'MAIN_MENU' && (

          <MainMenu

            onStartAdventure={() => {

              if (player) {

                setCurrentScreen('MAP_DASHBOARD');

              } else {

                setCurrentScreen('INTRO_CINEMATIC');

              }

            }}

            onOpenGuide={() =>
              setCurrentScreen('GUIDE')
            }

            onOpenLearningHub={() =>
              setCurrentScreen('LEARNING_HUB')
            }

            onOpenSettings={() =>
              setIsSettingsOpen(true)
            }

            onOpenAbout={() =>
              setIsAboutOpen(true)
            }

            onOpenTeacherDashboard={() =>
              setCurrentScreen('TEACHER_DASHBOARD')
            }

            hasExistingPlayer={!!player}

            playerName={player?.name}

          />

        )}


        {/* PLAYER SETUP */}

        {currentScreen === 'PLAYER_SETUP' && (

          <PlayerSetup

            existingProfile={player}

            onSaveProfile={handleSavePlayer}

            onBack={() =>
              setCurrentScreen('MAIN_MENU')
            }

          />

        )}


        {/* ADVENTURE MAP */}

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

            onOpenVictory={() =>
              setCurrentScreen('VICTORY')
            }

          />

        )}


        {/* ======================================
            LEVEL VIEWS
        ====================================== */}

        {currentScreen === 'LEVEL_VIEW' && (

          <>

            {/* LEVEL 1 */}

            {currentLevelId === 1 && (

              <Level1CopyPaste

                progress={levels[1]}

                onCompleteLevel={(score) =>
                  handleCompleteLevel(1, score)
                }

                onBackToMap={() =>
                  setCurrentScreen('MAP_DASHBOARD')
                }

              />

            )}


            {/* LEVEL 2 */}

            {currentLevelId === 2 && (

              <Level2Screenshot

                progress={levels[2]}

                onCompleteLevel={(score) =>
                  handleCompleteLevel(2, score)
                }

                onBackToMap={() =>
                  setCurrentScreen('MAP_DASHBOARD')
                }

              />

            )}


            {/* LEVEL 3 */}

            {currentLevelId === 3 && (

              <Level3DetektifObjek

                progress={levels[3]}

                onCompleteLevel={(score) =>
                  handleCompleteLevel(3, score)
                }

                onBackToMap={() =>
                  setCurrentScreen('MAP_DASHBOARD')
                }

              />

            )}


            {/* LEVEL 4 */}

            {currentLevelId === 4 && (

              <Level4MenuHome

                progress={levels[4]}

                onCompleteLevel={(score) =>
                  handleCompleteLevel(4, score)
                }

                onBackToMap={() =>
                  setCurrentScreen('MAP_DASHBOARD')
                }

              />

            )}


            {/* LEVEL 5 - FINAL BOSS */}

            {currentLevelId === 5 && (

              <Level5FinalBoss

                progress={levels[5]}

                onCompleteBossLevel={(score) =>
                  handleCompleteLevel(5, score)
                }

                onBackToMap={() =>
                  setCurrentScreen('MAP_DASHBOARD')
                }

              />

            )}

          </>

        )}


        {/* ======================================
            VICTORY SCREEN
        ====================================== */}

        {currentScreen === 'VICTORY' && player && (

          <VictoryModal

            player={player}

            levels={levels}

            totalScore={totalScore}

            totalStars={totalStars}

            onPlayAgain={handleResetProgress}

            onOpenLearningHub={() =>
              setCurrentScreen('LEARNING_HUB')
            }

            onBackToMenu={() =>
              setCurrentScreen('MAIN_MENU')
            }

          />

        )}


        {/* GAME GUIDE */}

        {currentScreen === 'GUIDE' && (

          <GameGuide

            onBack={() =>
              setCurrentScreen(
                player ? 'MAP_DASHBOARD' : 'MAIN_MENU'
              )
            }

          />

        )}


        {/* LEARNING HUB */}

        {currentScreen === 'LEARNING_HUB' && (

          <LearningHub

            onBack={() =>
              setCurrentScreen(
                player ? 'MAP_DASHBOARD' : 'MAIN_MENU'
              )
            }

          />

        )}


        {/* TEACHER DASHBOARD */}

        {currentScreen === 'TEACHER_DASHBOARD' && (

          <TeacherDashboard

            records={recordsHistory}

            onRefreshRecords={() => {

              setRecordsHistory(loadRecordsHistory());

            }}

            onAddNewPlayer={handleAddNewPlayer}

            onBack={() =>
              setCurrentScreen('MAIN_MENU')
            }

          />

        )}

      </main>


      {/* ======================================
          GLOBAL MODALS
      ====================================== */}

      <SettingsModal

        isOpen={isSettingsOpen}

        onClose={() =>
          setIsSettingsOpen(false)
        }

        soundEnabled={soundEnabled}

        musicEnabled={musicEnabled}

        onToggleSound={handleToggleSound}

        onToggleMusic={handleToggleMusic}

        onResetProgress={handleResetProgress}

      />


      <AboutModal

        isOpen={isAboutOpen}

        onClose={() =>
          setIsAboutOpen(false)
        }

      />

    </div>

  );

}
