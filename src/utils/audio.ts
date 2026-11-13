
class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMusicPlaying = false;
  private musicInterval: number | null = null;
  private musicStep = 0;
  private noiseBuffer: AudioBuffer | null = null;

  public soundEnabled = true;
  public musicEnabled = true;

  constructor() {
    try {
      const s = localStorage.getItem("mdd_sound_enabled");
      const m = localStorage.getItem("mdd_music_enabled");
      if (s !== null) this.soundEnabled = s === "true";
      if (m !== null) this.musicEnabled = m === "true";
    } catch {}
  }

  // ===============================
  // AUDIO ENGINE
  // ===============================

  private init() {
    if (typeof window === "undefined") return;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as any).webkitAudioContext;

      if (!AudioCtx) return;

      this.ctx = new AudioCtx();

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicEnabled ? 0.16 : 0;
      this.musicGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.soundEnabled ? 0.8 : 0;
      this.sfxGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  private get audioContext() {
    this.init();
    return this.ctx;
  }

  // ===============================
  // OSCILLATOR SOUND
  // ===============================

  private tone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    volume = 0.2,
    endFrequency?: number,
    delay = 0,
    destination?: AudioNode
  ) {
    if (!this.soundEnabled) return;

    const ctx = this.audioContext;
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);

    if (endFrequency) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(1, endFrequency),
        now + duration
      );
    }

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(6000, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + duration
    );

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(destination || this.sfxGain);

    osc.start(now);
    osc.stop(now + duration + 0.04);
  }

  // ===============================
  // NOISE GENERATOR
  // ===============================

  private getNoiseBuffer() {
    const ctx = this.audioContext;
    if (!ctx) return null;

    if (!this.noiseBuffer) {
      const buffer = ctx.createBuffer(
        1,
        ctx.sampleRate,
        ctx.sampleRate
      );

      const data = buffer.getChannelData(0);

      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      this.noiseBuffer = buffer;
    }

    return this.noiseBuffer;
  }

  private noise(
    duration: number,
    volume = 0.1,
    frequency = 4000,
    delay = 0,
    sweep = false
  ) {
    if (!this.soundEnabled) return;

    const ctx = this.audioContext;
    if (!ctx || !this.sfxGain) return;

    const buffer = this.getNoiseBuffer();
    if (!buffer) return;

    const now = ctx.currentTime + delay;
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    source.buffer = buffer;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(
      sweep ? 900 : frequency,
      now
    );

    if (sweep) {
      filter.frequency.exponentialRampToValueAtTime(
        frequency,
        now + duration
      );
    }

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + duration
    );

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    source.start(now);
    source.stop(now + duration + 0.03);
  }

  private chord(
    notes: number[],
    duration: number,
    volume = 0.12,
    delay = 0
  ) {
    notes.forEach((note, i) => {
      this.tone(
        note,
        duration,
        "triangle",
        volume,
        undefined,
        delay + i * 0.025
      );
    });
  }

  // ===============================
  // SETTINGS
  // ===============================

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;

    try {
      localStorage.setItem("mdd_sound_enabled", String(enabled));
    } catch {}

    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(
        enabled ? 0.8 : 0,
        this.ctx.currentTime,
        0.05
      );
    }
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;

    try {
      localStorage.setItem("mdd_music_enabled", String(enabled));
    } catch {}

    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(
        enabled ? 0.16 : 0,
        this.ctx.currentTime,
        0.1
      );
    }

    if (enabled && !this.isMusicPlaying) {
      this.startMusic();
    }

    if (!enabled) {
      this.stopMusic();
    }
  }

  public toggleMusic(): boolean {
    const next = !this.musicEnabled;
    this.setMusicEnabled(next);
    return next;
  }

  public toggleSound(): boolean {
    const next = !this.soundEnabled;
    this.setSoundEnabled(next);
    return next;
  }

  // ===============================
  // 1. WHOOSH - OPEN PAGE
  // ===============================

  public playWhoosh() {
    this.noise(0.65, 0.32, 7000, 0, true);
    this.tone(180, 0.55, "sawtooth", 0.1, 850, 0);
    this.tone(650, 0.3, "sine", 0.1, 1200, 0.22);
  }

  public playPageOpen() {
    this.playWhoosh();
  }

  // ===============================
  // 2. GAME START
  // ===============================

  public playGameStart() {
    this.tone(110, 0.5, "sawtooth", 0.2, 440);
    this.tone(220, 0.55, "triangle", 0.2, 880, 0.12);
    this.tone(440, 0.45, "square", 0.12, 880, 0.28);

    this.chord(
      [523.25, 659.25, 783.99, 1046.5],
      0.75,
      0.15,
      0.55
    );

    this.noise(0.45, 0.12, 8000, 0.5, true);
  }

  // ===============================
  // 3. STAR SPARKLE
  // ===============================

  public playStar() {
    const notes = [880, 1174.66, 1567.98, 2093, 2637];

    notes.forEach((note, i) => {
      this.tone(
        note,
        0.32,
        "sine",
        0.19,
        note * 1.04,
        i * 0.07
      );
    });

    this.noise(0.45, 0.13, 9000, 0.08);
  }

  // ===============================
  // 4. REWARD SOUND
  // ===============================

  public playReward() {
    this.tone(392, 0.35, "triangle", 0.2, 523.25);
    this.tone(523.25, 0.35, "triangle", 0.22, 659.25, 0.15);
    this.tone(659.25, 0.45, "sine", 0.23, 1046.5, 0.3);

    this.chord(
      [523.25, 659.25, 783.99],
      0.65,
      0.15,
      0.55
    );

    this.noise(0.45, 0.12, 7500, 0.4);
  }

  // ===============================
  // 5. COUNTDOWN
  // ===============================

  public playCountdown() {
    this.tone(880, 0.2, "square", 0.2, 660);
    this.tone(440, 0.25, "sawtooth", 0.12, 330, 0.04);
    this.noise(0.08, 0.07, 1600, 0.02);
  }

  // ===============================
  // 6. EPIC VICTORY
  // ===============================

  public playEpicVictory() {
    const melody = [
      392, 523.25, 659.25, 783.99,
      1046.5, 783.99, 1046.5, 1318.51
    ];

    melody.forEach((note, i) => {
      this.tone(
        note,
        0.4,
        "triangle",
        0.24,
        note * 1.015,
        i * 0.16
      );
    });

    this.chord(
      [523.25, 659.25, 783.99, 1046.5],
      1.4,
      0.2,
      1.15
    );

    this.tone(65, 1.1, "sine", 0.25, 35, 1.1);
    this.noise(1.0, 0.17, 8500, 1.1);
  }

  // ===============================
  // 7. CELEBRATION
  // ===============================

  public playCelebration() {
    this.playEpicVictory();

    this.chord(
      [659.25, 783.99, 987.77, 1174.66],
      1.0,
      0.14,
      1.6
    );

    this.noise(0.9, 0.15, 9000, 1.5);
    this.tone(1567.98, 0.7, "sine", 0.13, 2093, 1.8);
  }

  // ===============================
  // LEGACY GAME SOUNDS
  // ===============================

  public playClick() {
    this.tone(850, 0.07, "sine", 0.18, 1250);
    this.tone(1200, 0.06, "triangle", 0.09, 700, 0.04);
  }

  public playCorrect() {
    this.tone(523.25, 0.22, "sine", 0.2, 659.25);
    this.tone(659.25, 0.22, "sine", 0.2, 783.99, 0.1);
    this.tone(783.99, 0.3, "triangle", 0.2, 1046.5, 0.2);
    this.playStar();
  }

  public playWrong() {
    this.tone(220, 0.3, "sawtooth", 0.18, 110);
    this.tone(160, 0.25, "triangle", 0.15, 90, 0.15);
    this.noise(0.15, 0.08, 1200, 0.05);
  }

  public playLevelUnlock() {
    this.playGameStart();
  }

  public playBossHit() {
    this.noise(0.25, 0.2, 1800);
    this.tone(950, 0.25, "sawtooth", 0.2, 60);
    this.tone(110, 0.4, "triangle", 0.25, 45, 0.02);
  }

  public playShutter() {
    this.noise(0.06, 0.2, 7500);
    this.tone(1200, 0.06, "square", 0.12, 650, 0.04);
    this.tone(350, 0.12, "triangle", 0.14, 180, 0.09);
  }

  public playVictory() {
    this.playEpicVictory();
  }

  // ===============================
  // ADVENTURE MUSIC
  // ===============================

  public startMusic() {
    if (!this.musicEnabled || this.isMusicPlaying) return;

    this.init();

    if (!this.ctx || !this.musicGain) return;

    this.isMusicPlaying = true;

    const tempo = 180;

    const chords = [
      [261.63, 329.63, 392, 493.88],
      [220, 261.63, 329.63, 392],
      [174.61, 220, 261.63, 349.23],
      [196, 246.94, 293.66, 392]
    ];

    const bass = [65.41, 55, 43.65, 49];

    const melody = [
      523.25, 659.25, 783.99, 659.25,
      587.33, 659.25, 783.99, 987.77,
      783.99, 659.25, 587.33, 523.25,
      659.25, 783.99, 987.77, 783.99
    ];

    this.musicInterval = window.setInterval(() => {
      if (!this.ctx || !this.musicGain || !this.isMusicPlaying) return;

      const step = this.musicStep % 64;
      const bar = Math.floor(step / 16) % 4;
      const beat = step % 16;
      const now = this.ctx.currentTime;

      // BASS
      if (beat % 4 === 0) {
        this.playMusicTone(bass[bar], 0.38, "triangle", 0.22);
        this.playMusicTone(bass[bar] * 2, 0.25, "sine", 0.07);
      }

      // KICK
      if (beat % 8 === 0) {
        this.playKick();
      }

      // SNARE
      if (beat === 4 || beat === 12) {
        this.playMusicNoise(0.13, 0.14, 1800);
      }

      // HI HAT
      if (beat % 2 === 0) {
        this.playMusicNoise(0.04, 0.045, 8500);
      }

      // MELODY
      if (beat % 2 === 0) {
        const note = melody[
          (Math.floor(step / 2) + bar * 2) % melody.length
        ];

        this.playMusicTone(note, 0.2, "sawtooth", 0.045);
      }

      // BACKGROUND CHORDS
      if (beat === 0) {
        chords[bar].forEach((note, index) => {
          this.playMusicTone(
            note,
            0.8,
            "triangle",
            0.035 + index * 0.005
          );
        });
      }

      // EXTRA ELECTRONIC PULSE
      if (beat === 6 || beat === 14) {
        this.playMusicTone(1046.5, 0.1, "sine", 0.035);
      }

      this.musicStep++;
    }, tempo);
  }

  private playMusicTone(
    frequency: number,
    duration: number,
    type: OscillatorType,
    volume: number
  ) {
    if (!this.ctx || !this.musicGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.value = frequency;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + duration + 0.03);
  }

  private playKick() {
    if (!this.ctx || !this.musicGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.18);

    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + 0.24);
  }

  private playMusicNoise(
    duration: number,
    volume: number,
    frequency: number
  ) {
    if (!this.ctx || !this.musicGain) return;

    const buffer = this.getNoiseBuffer();
    if (!buffer) return;

    const now = this.ctx.currentTime;
    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    source.buffer = buffer;

    filter.type = "highpass";
    filter.frequency.value = frequency;

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + duration
    );

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    source.start(now);
    source.stop(now + duration);
  }

  public stopMusic() {
    this.isMusicPlaying = false;

    if (this.musicInterval !== null) {
      window.clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const audio = new SoundEngine();
