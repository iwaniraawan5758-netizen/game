import { LevelId, LevelProgress, PlayerProfile, PlayerRecord } from '../types/game';

const CURRENT_PLAYER_KEY = 'mdd_current_player';
const CURRENT_LEVELS_KEY = 'mdd_current_levels';
const RECORDS_KEY = 'mdd_player_records_history';

export const INITIAL_LEVELS: Record<LevelId, LevelProgress> = {
  1: {
    unlocked: true,
    completed: false,
    score: 0,
    stars: 0,
    quizScore: 0,
    interactiveScore: 0,
    attempts: 0,
  },
  2: {
    unlocked: false,
    completed: false,
    score: 0,
    stars: 0,
    quizScore: 0,
    interactiveScore: 0,
    attempts: 0,
  },
  3: {
    unlocked: false,
    completed: false,
    score: 0,
    stars: 0,
    quizScore: 0,
    interactiveScore: 0,
    attempts: 0,
  },
  4: {
    unlocked: false,
    completed: false,
    score: 0,
    stars: 0,
    quizScore: 0,
    interactiveScore: 0,
    attempts: 0,
  },
  5: {
    unlocked: false,
    completed: false,
    score: 0,
    stars: 0,
    quizScore: 0,
    interactiveScore: 0,
    attempts: 0,
  },
};

export function calculateStars(score: number): number {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  if (score >= 50) return 1;
  return 0;
}

export function calculatePredicate(totalScore: number): string {
  if (totalScore >= 450) return 'MASTER DETEKTIF DIGITAL';
  if (totalScore >= 350) return 'DETEKTIF PROFESIONAL';
  if (totalScore >= 250) return 'DETEKTIF MUDA';
  return 'CALON DETEKTIF';
}

export function loadCurrentPlayer(): PlayerProfile | null {
  try {
    const raw = localStorage.getItem(CURRENT_PLAYER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCurrentPlayer(player: PlayerProfile) {
  try {
    localStorage.setItem(CURRENT_PLAYER_KEY, JSON.stringify(player));
  } catch (e) {
    console.error('Failed to save player', e);
  }
}

export function loadCurrentLevels(): Record<LevelId, LevelProgress> {
  try {
    const raw = localStorage.getItem(CURRENT_LEVELS_KEY);
    if (raw) {
      return { ...INITIAL_LEVELS, ...JSON.parse(raw) };
    }
  } catch {}
  return { ...INITIAL_LEVELS };
}

export function saveCurrentLevels(levels: Record<LevelId, LevelProgress>) {
  try {
    localStorage.setItem(CURRENT_LEVELS_KEY, JSON.stringify(levels));
  } catch (e) {
    console.error('Failed to save levels', e);
  }
}

export function loadRecordsHistory(): PlayerRecord[] {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCompletedRecord(
  player: PlayerProfile,
  levels: Record<LevelId, LevelProgress>
): PlayerRecord {
  const totalScore = (Object.values(levels) as LevelProgress[]).reduce(
    (acc, lvl) => acc + lvl.score,
    0
  );
  const totalStars = (Object.values(levels) as LevelProgress[]).reduce(
    (acc, lvl) => acc + lvl.stars,
    0
  );

  const achievements: string[] = ['PEMULA DIGITAL'];
  if (levels[1]?.completed) achievements.push('AHLI COPY PASTE');
  if (levels[2]?.completed) achievements.push('MASTER SCREENSHOT');
  if (levels[3]?.completed) achievements.push('DETEKTIF OBJEK');
  if (levels[4]?.completed) achievements.push('PENGUASA MENU HOME');
  if (levels[5]?.completed && totalScore >= 400) achievements.push('MASTER DETEKTIF DIGITAL');

  const record: PlayerRecord = {
    id: 'REC_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    name: player.name,
    grade: player.grade,
    groupNumber: player.groupNumber || '-',
    startedAt: player.startedAt,
    completedAt: new Date().toLocaleString('id-ID'),
    totalScore,
    totalStars,
    levels,
    predicate: calculatePredicate(totalScore),
    achievements,
  };

  try {
    const history = loadRecordsHistory();
    // Avoid duplicate id
    const updated = [record, ...history.filter((h) => h.id !== record.id)];
    localStorage.setItem(RECORDS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save history record', e);
  }

  return record;
}

export function clearAllGameData() {
  try {
    localStorage.removeItem(CURRENT_PLAYER_KEY);
    localStorage.removeItem(CURRENT_LEVELS_KEY);
    localStorage.removeItem(RECORDS_KEY);
  } catch (e) {
    console.error(e);
  }
}

export function clearCurrentProgress() {
  try {
    localStorage.removeItem(CURRENT_LEVELS_KEY);
  } catch (e) {
    console.error(e);
  }
}

export function exportRecordsToCSV(records: PlayerRecord[]): void {
  if (!records || records.length === 0) {
    alert('Belum ada data siswa untuk diunduh.');
    return;
  }

  const headers = [
    'No',
    'Nama Siswa',
    'Kelas',
    'Kelompok',
    'Level 1 (Copy Paste)',
    'Level 2 (Screenshot)',
    'Level 3 (Detektif Objek)',
    'Level 4 (Menu Home)',
    'Level 5 (Final Boss)',
    'Total Skor',
    'Total Bintang',
    'Predikat',
    'Waktu Selesai',
  ];

  const rows = records.map((r, i) => [
    i + 1,
    `"${r.name.replace(/"/g, '""')}"`,
    `"${r.grade.replace(/"/g, '""')}"`,
    `"${(r.groupNumber || '-').replace(/"/g, '""')}"`,
    r.levels[1]?.score ?? 0,
    r.levels[2]?.score ?? 0,
    r.levels[3]?.score ?? 0,
    r.levels[4]?.score ?? 0,
    r.levels[5]?.score ?? 0,
    r.totalScore,
    r.totalStars,
    `"${r.predicate}"`,
    `"${r.completedAt || '-'}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Rekap_Nilai_Detektif_Digital_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
