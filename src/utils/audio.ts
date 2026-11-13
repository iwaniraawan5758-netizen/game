
// =====================================================
// MISSION DETECTIVE DIGITAL
// Audio Engine - Dynamic Adventure Game Sound
// Tanpa file audio eksternal
// =====================================================

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
      const savedSound = localStorage.getItem("mdd_sound_enabled");
      const savedMusic = localStorage.getItem("mdd_music_enabled");

      if (savedSound !== null) {
        this.soundEnabled = savedSound === "true";
      }

      if (savedMusic !== null) {
        this.musicEnabled = savedMusic === "true";
      }
    } catch {
      // Abaikan jika penyimpanan tidak tersedia
    }
  }

  // -----------------------------------------------------
  // AUDIO INITIALIZATION
  // -----------------------------------------------------

  private initContext() {
    if (typeof window === "undefined") return;

    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;

      if (!AudioContextClass) return;

      this.ctx = new AudioContextClass();

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicEnabled ? 0.12 : 0;
      this.musicGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.soundEnabled ? 0.65 : 0;
      this.sfxGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  private get context() {
    this.initContext();
    return this.ctx;
  }

  // -----------------------------------------------------
  // BASIC SOUND GENERATORS
  // -----------------------------------------------------

  private tone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    volume = 0.2,
    endFrequency?: number,
    delay = 0,
    pan = 0
  ) {
    if (!this.soundEnabled) return;

    const ctx = this.context;
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime + delay;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const panner = ctx.createStereoPanner();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);

    if (endFrequency) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(1, endFrequency),
        now + duration
      );
    }

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(5000, now);
    filter.Q.value = 0.7;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + duration
    );

    panner.pan.value = pan;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(panner);
    panner.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + duration + 0.03);
  }

  private noise(
    duration: number,
    volume = 0.1,
    filterFrequency = 4000,
    delay = 0
  ) {
    if (!this.soundEnabled) return;

    const ctx = this.context;
    if (!ctx || !this.sfxGain) return;

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

    const now = ctx.currentTime + delay;

    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    source.buffer = this.noiseBuffer;

    filter.type = "lowpass";
    filter.frequency.value = filterFrequency;

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + duration
    );

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    source.start(now);
    source.stop(now + duration);
  }

  private chord(
    notes: number[],
    duration: number,
    volume = 0.12,
    delay = 0
  ) {
    notes.forEach((frequency, index) => {
      this.tone(
        frequency,
        duration,
        "triangle",
        volume,
        undefined,
        delay + index * 0.015,
        (index - (notes.length - 1) / 2) * 0.25
      );
    });
  }

  // -----------------------------------------------------
  // SOUND AND MUSIC SETTINGS
  // -----------------------------------------------------

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;

    try {
      localStorage.setItem(
        "mdd_sound_enabled",
        String(enabled)
      );
    } catch {}

    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(
        enabled ? 0.65 : 0,
        this.ctx.currentTime,
        0.04
      );
    }
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;

    try {
      localStorage.setItem(
        "mdd_music_enabled",
        String(enabled)
      );
    } catch {}

    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(
        enabled ? 0.12 : 0,
        this.ctx.currentTime,
        0.08
      );
    }

    if (enabled && !this.isMusicPlaying) {
      this.startMusic();
    } else if (!enabled && this.isMusicPlaying) {
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

  // -----------------------------------------------------
  // BUTTON CLICK
  // -----------------------------------------------------

  public playClick() {
    this.tone(850, 0.07, "sine", 0.16, 1250);
    this.tone(1250, 0.045, "triangle", 0.07, 850, 0.035);
  }

  // -----------------------------------------------------
  // CORRECT ANSWER
  // -----------------------------------------------------

  public playCorrect() {
    const notes = [523.25, 659.25, 783.99, 1046.5];

    notes.forEach((note, i) => {
      this.tone(
        note,
        0.24,
        "sine",
        0.22,
        note * 1.015,
        i * 0.075,
        i % 2 === 0 ? -0.25 : 0.25
      );
    });

    this.chord([659.25, 783.99, 1046.5], 0.38, 0.09, 0.25);
    this.noise(0.18, 0.055, 6500, 0.12);
  }

  // -----------------------------------------------------
  // WRONG ANSWER
  // -----------------------------------------------------

  public playWrong() {
    this.tone(320, 0.18, "sawtooth", 0.16, 210);
    this.tone(240, 0.25, "triangle", 0.15, 155, 0.13);
    this.noise(0.12, 0.055, 1000, 0.12);
  }

  // -----------------------------------------------------
  // LEVEL UNLOCK
  // -----------------------------------------------------

  public playLevelUnlock() {
    const notes = [392, 493.88, 587.33, 783.99, 987.77];

    notes.forEach((note, i) => {
      this.tone(
        note,
        0.42,
        "triangle",
        0.19,
        note * 1.04,
        i * 0.09,
        i % 2 === 0 ? -0.3 : 0.3
      );
    });

    this.chord([523.25, 659.25, 783.99], 0.7, 0.12, 0.4);
    this.noise(0.4, 0.08, 7000, 0.25);
  }

  // -----------------------------------------------------
  // STAR REWARD
  // -----------------------------------------------------

  public playStar() {
    const notes = [880, 1174.66, 1567.98, 2093];

    notes.forEach((note, i) => {
      this.tone(
        note,
        0.32,
        "sine",
        0.17,
        note * 1.12,
        i * 0.055,
        i % 2 === 0 ? -0.4 : 0.4
      );
    });

    this.noise(0.35, 0.09, 8500, 0.08);
  }

  // -----------------------------------------------------
  // BOSS HIT
  // -----------------------------------------------------

  public playBossHit() {
    this.tone(950, 0.22, "sawtooth", 0.2, 65);
    this.tone(130, 0.35, "triangle", 0.24, 45, 0.02);
    this.noise(0.22, 0.13, 1800, 0.01);
  }

  // -----------------------------------------------------
  // CAMERA SHUTTER
  // -----------------------------------------------------

  public playShutter() {
    this.noise(0.055, 0.18, 6500);
    this.tone(1200, 0.045, "square", 0.12, 650, 0.015);
    this.tone(420, 0.1, "triangle", 0.13, 230, 0.075);
  }

  // -----------------------------------------------------
  // VICTORY
  // -----------------------------------------------------

  public playVictory() {
    const melody = [
      { f: 523.25, d: 0.18 },
      { f: 659.25, d: 0.18 },
      { f: 783.99, d: 0.18 },
      { f: 1046.5, d: 0.32 },
      { f: 783.99, d: 0.16 },
      { f: 1046.5, d: 0.55 },
    ];

    let time = 0;

    melody.forEach((note) => {
      this.tone(
        note.f,
        note.d,
        "triangle",
        0.23,
        note.f * 1.015,
        time
      );

      time += note.d * 0.85;
    });

    this.chord(
      [523.25, 659.25, 783.99, 1046.5],
      1.0,
      0.14,
      0.75
    );

    this.noise(0.7, 0.1, 7500, 0.8);
  }

  // -----------------------------------------------------
  // BACKGROUND MUSIC
  // Adventure Electronic Soundtrack
  // -----------------------------------------------------

  public startMusic() {
    if (!this.musicEnabled || this.isMusicPlaying) return;

    this.initContext();

    if (!this.ctx || !this.musicGain) return;

    this.isMusicPlaying = true;

    const chords = [
      [261.63, 329.63, 392.0, 493.88],   // C
      [220.0, 261.63, 329.63, 392.0],    // Am
      [174.61, 220.0, 261.63, 349.23],   // F
      [196.0, 246.94, 293.66, 392.0],    // G
    ];

    const melody = [
      523.25, 659.25, 783.99, 659.25,
      587.33, 659.25, 783.99, 987.77,
      783.99, 659.25, 587.33, 523.25,
      587.33, 659.25, 783.99, 659.25,
    ];

    const bassNotes = [130.81, 110.0, 87.31, 98.0];

    const tempo = 190;

    this.musicInterval = window.setInterval(() => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain) {
        return;
      }

      const step = this.musicStep % 32;
      const bar = Math.floor(step / 8) % 4;
      const now = this.ctx.currentTime;

      // Bass rhythm
      if (step % 4 === 0) {
        const bass = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        const bassFilter = this.ctx.createBiquadFilter();

        bass.type = "triangle";
        bass.frequency.setValueAtTime(bassNotes[bar], now);
        bass.frequency.exponentialRampToValueAtTime(
          bassNotes[bar] * 0.5,
          now + 0.22
        );

        bassFilter.type = "lowpass";
        bassFilter.frequency.value = 500;

        bassGain.gain.setValueAtTime(0.13, now);
        bassGain.gain.exponentialRampToValueAtTime(
          0.001,
          now + 0.3
        );

        bass.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(this.musicGain);

        bass.start(now);
        bass.stop(now + 0.32);
      }

      // Electronic kick drum
      if (step % 8 === 0) {
        const kick = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();

        kick.type = "sine";
        kick.frequency.setValueAtTime(130, now);
        kick.frequency.exponentialRampToValueAtTime(
          42,
          now + 0.16
        );

        kickGain.gain.setValueAtTime(0.2, now);
        kickGain.gain.exponentialRampToValueAtTime(
          0.001,
          now + 0.2
        );

        kick.connect(kickGain);
        kickGain.connect(this.musicGain);

        kick.start(now);
        kick.stop(now + 0.22);
      }

      // Snare drum
      if (step === 4 || step === 12 || step === 20 || step === 28) {
        this.playMusicNoise(0.12, 0.13, 2500);
      }

      // Hi-hat
      if (step % 2 === 0) {
        this.playMusicNoise(0.045, 0.035, 9000);
      }

      // Melody
      if (step % 2 === 0) {
        const note = melody[
          (Math.floor(step / 2) + bar * 2) % melody.length
        ];

        this.playMusicTone(
          note,
          0.16,
          "sine",
          0.055
        );
      }

      // Chord atmosphere
      if (step % 8 === 0) {
        chords[bar].forEach((note, index) => {
          this.playMusicTone(
            note,
            0.65,
            "triangle",
            0.025,
            index * 0.015
          );
        });
      }

      this.musicStep = (this.musicStep + 1) % 32;
    }, tempo);
  }

  private playMusicTone(
    frequency: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    delay = 0
  ) {
    if (!this.ctx || !this.musicGain) return;

    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.value = frequency;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + duration
    );

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  private playMusicNoise(
    duration: number,
    volume: number,
    frequency: number
  ) {
    if (!this.ctx || !this.musicGain) return;

    if (!this.noiseBuffer) {
      const buffer = this.ctx.createBuffer(
        1,
        this.ctx.sampleRate,
        this.ctx.sampleRate
      );

      const data = buffer.getChannelData(0);

      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      this.noiseBuffer = buffer;
    }

    const now = this.ctx.currentTime;
    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    source.buffer = this.noiseBuffer;

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
