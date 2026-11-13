
class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private isMusicPlaying = false;
  private musicInterval: number | null = null;
  private musicStep = 0;
  private noiseBuffer: AudioBuffer | null = null;

  private distortionCurve: Float32Array;

  public soundEnabled = true;
  public musicEnabled = true;

  constructor() {
    this.soundEnabled =
      localStorage.getItem("mdd_sound_enabled") !== "false";

    this.musicEnabled =
      localStorage.getItem("mdd_music_enabled") !== "false";

    this.distortionCurve = this.createDistortionCurve();
  }

  // ==========================================
  // AUDIO INITIALIZATION
  // ==========================================

  public init() {
    if (!this.ctx) {
      this.ctx = new AudioContext();

      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.musicGain.gain.value = this.musicEnabled ? 0.18 : 0;
      this.sfxGain.gain.value = this.soundEnabled ? 0.8 : 0;

      this.musicGain.connect(this.ctx.destination);
      this.sfxGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }

    return this.ctx;
  }

  public get audioContext() {
    return this.ctx;
  }

  private createDistortionCurve(): Float32Array {
    const curve = new Float32Array(44100);

    for (let i = 0; i < curve.length; i++) {
      const x = (i * 2) / curve.length - 1;
      curve[i] = Math.tanh(x * 5);
    }

    return curve;
  }

  // ==========================================
  // BASIC SOUND FUNCTIONS
  // ==========================================

  public tone(
    frequency: number,
    duration = 0.2,
    type: OscillatorType = "sine",
    volume = 0.3
  ) {
    if (!this.soundEnabled) return;

    this.init();

    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const oscillator = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + duration
    );

    oscillator.connect(gain);
    gain.connect(this.sfxGain);

    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  public chord(
    frequencies: number[],
    duration = 0.3,
    volume = 0.15
  ) {
    frequencies.forEach((frequency) => {
      this.tone(frequency, duration, "triangle", volume);
    });
  }

  public noise(
    duration = 0.2,
    volume = 0.2
  ) {
    if (!this.soundEnabled) return;

    this.init();

    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();

    source.buffer = this.getNoiseBuffer();

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + duration
    );

    source.connect(gain);
    gain.connect(this.sfxGain);

    source.start(now);
    source.stop(now + duration);
  }

  private getNoiseBuffer(): AudioBuffer {
    if (!this.ctx) {
      throw new Error("AudioContext belum tersedia");
    }

    if (!this.noiseBuffer) {
      const bufferSize = this.ctx.sampleRate * 2;

      this.noiseBuffer = this.ctx.createBuffer(
        1,
        bufferSize,
        this.ctx.sampleRate
      );

      const data = this.noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }

    return this.noiseBuffer;
  }

  // ==========================================
  // SOUND EFFECTS
  // ==========================================

  public playClick() {
    this.tone(800, 0.07, "sine", 0.15);
    this.tone(1100, 0.05, "sine", 0.08);
  }

  public playWhoosh() {
    this.noise(0.25, 0.12);
    this.tone(300, 0.2, "sawtooth", 0.06);
  }

  public playPageOpen() {
    this.tone(500, 0.12, "triangle", 0.15);
    setTimeout(() => {
      this.tone(750, 0.15, "triangle", 0.12);
    }, 100);
  }

  public playGameStart() {
    this.chord([261.63, 329.63, 392], 0.25, 0.12);

    setTimeout(() => {
      this.chord([392, 493.88, 587.33], 0.4, 0.12);
    }, 250);
  }

  public playCorrect() {
    this.tone(660, 0.12, "sine", 0.2);

    setTimeout(() => {
      this.tone(880, 0.18, "sine", 0.2);
    }, 100);
  }

  public playWrong() {
    this.tone(220, 0.2, "sawtooth", 0.15);

    setTimeout(() => {
      this.tone(165, 0.25, "sawtooth", 0.12);
    }, 100);
  }

  public playStar() {
    this.tone(880, 0.12, "sine", 0.15);

    setTimeout(() => {
      this.tone(1174.66, 0.15, "sine", 0.15);
    }, 90);

    setTimeout(() => {
      this.tone(1567.98, 0.2, "sine", 0.12);
    }, 180);
  }

  public playReward() {
    this.chord([523.25, 659.25, 783.99], 0.35, 0.12);

    setTimeout(() => {
      this.chord([659.25, 783.99, 987.77], 0.4, 0.12);
    }, 250);
  }

  public playCountdown() {
    this.tone(600, 0.12, "square", 0.15);
  }

  public playLevelUnlock() {
    this.tone(440, 0.15, "triangle", 0.15);

    setTimeout(() => {
      this.tone(660, 0.15, "triangle", 0.15);
    }, 120);

    setTimeout(() => {
      this.tone(880, 0.3, "triangle", 0.18);
    }, 240);
  }

  public playBossHit() {
    this.noise(0.18, 0.25);
    this.tone(100, 0.25, "sawtooth", 0.18);
  }

  public playShutter() {
    this.noise(0.08, 0.12);
    this.tone(1200, 0.06, "square", 0.08);
  }

  public playVictory() {
    this.chord([523.25, 659.25, 783.99], 0.5, 0.15);
  }

  public playEpicVictory() {
    this.chord([261.63, 329.63, 392, 523.25], 0.6, 0.15);

    setTimeout(() => {
      this.chord([392, 493.88, 587.33, 783.99], 0.7, 0.15);
    }, 350);
  }

  public playCelebration() {
    this.playEpicVictory();

    setTimeout(() => {
      this.playStar();
    }, 500);

    setTimeout(() => {
      this.playReward();
    }, 900);
  }

  // ==========================================
  // GUITAR HERO STYLE ADVENTURE MUSIC
  // ==========================================

  public startMusic() {
    if (!this.musicEnabled || this.isMusicPlaying) return;

    this.init();

    if (!this.ctx || !this.musicGain) return;

    this.isMusicPlaying = true;
    this.musicStep = 0;

    const roots = [
      65.41, // C
      55.00, // A
      43.65, // F
      49.00  // G
    ];

    // Melodi rock arcade
    const riff = [
      0, 0, 7, 0,
      10, 7, 5, 7,
      0, 0, 7, 12,
      10, 7, 5, 3
    ];

    // 125ms = tempo sekitar 120 BPM
    const tempo = 125;

    this.musicInterval = window.setInterval(() => {
      if (
        !this.ctx ||
        !this.musicGain ||
        !this.isMusicPlaying
      ) {
        return;
      }

      const step = this.musicStep % 64;
      const bar = Math.floor(step / 16) % 4;
      const beat = step % 16;

      const root = roots[bar];

      // BASS
      if (beat % 4 === 0) {
        this.playMusicTone(
          root,
          0.32,
          "sawtooth",
          0.12
        );

        this.playMusicTone(
          root * 2,
          0.25,
          "triangle",
          0.055
        );
      }

      // KICK DRUM
      if ([0, 4, 8, 12].includes(beat)) {
        this.playKick();
      }

      // SNARE
      if (beat === 4 || beat === 12) {
        this.playMusicNoise(0.15, 0.18, 1400);
      }

      // HI-HAT
      if (beat % 2 === 0) {
        this.playMusicNoise(0.045, 0.045, 8500);
      }

      // ELECTRIC GUITAR RIFF
      if (beat % 2 === 0) {
        const offset = riff[beat];

        const guitarNote =
          root * 4 * Math.pow(2, offset / 12);

        this.playGuitar(
          guitarNote,
          0.19,
          0.14
        );
      }

      // POWER CHORD
      if (beat === 0 || beat === 8) {
        this.playGuitarChord(
          root * 4,
          0.38,
          0.09
        );
      }

      // CYMBAL
      if (beat === 0 && bar === 0) {
        this.playMusicNoise(0.35, 0.08, 6500);
      }

      // ROCK ACCENT
      if (beat === 6 || beat === 14) {
        this.playMusicTone(
          root * 8,
          0.1,
          "square",
          0.035
        );
      }

      this.musicStep++;
    }, tempo);
  }

  // ==========================================
  // ELECTRIC GUITAR SYNTHESIS
  // ==========================================

  private playGuitar(
    frequency: number,
    duration: number,
    volume: number
  ) {
    if (!this.ctx || !this.musicGain) return;

    const now = this.ctx.currentTime;

    const oscillator = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const distortion = this.ctx.createWaveShaper();

    distortion.curve = this.distortionCurve;
    distortion.oversample = "4x";

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(frequency, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2600, now);
    filter.Q.value = 1.5;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(
      volume,
      now + 0.015
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + duration
    );

    oscillator.connect(distortion);
    distortion.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    oscillator.start(now);
    oscillator.stop(now + duration + 0.03);
  }

  private playGuitarChord(
    frequency: number,
    duration: number,
    volume: number
  ) {
    this.playGuitar(frequency, duration, volume);

    this.playGuitar(
      frequency * 1.5,
      duration,
      volume * 0.8
    );

    this.playGuitar(
      frequency * 2,
      duration,
      volume * 0.55
    );
  }

  // ==========================================
  // MUSIC SUPPORT FUNCTIONS
  // ==========================================

  private playMusicTone(
    frequency: number,
    duration: number,
    type: OscillatorType,
    volume: number
  ) {
    if (!this.ctx || !this.musicGain) return;

    const now = this.ctx.currentTime;

    const oscillator = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + duration
    );

    oscillator.connect(gain);
    gain.connect(this.musicGain);

    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  private playKick() {
    if (!this.ctx || !this.musicGain) return;

    const now = this.ctx.currentTime;

    const oscillator = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(150, now);
    oscillator.frequency.exponentialRampToValueAtTime(
      40,
      now + 0.15
    );

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + 0.18
    );

    oscillator.connect(gain);
    gain.connect(this.musicGain);

    oscillator.start(now);
    oscillator.stop(now + 0.2);
  }

  private playMusicNoise(
    duration: number,
    volume: number,
    frequency: number
  ) {
    if (!this.ctx || !this.musicGain) return;

    const now = this.ctx.currentTime;

    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    source.buffer = this.getNoiseBuffer();

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

  // ==========================================
  // STOP MUSIC
  // ==========================================

  public stopMusic() {
    this.isMusicPlaying = false;

    if (this.musicInterval !== null) {
      window.clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  // ==========================================
  // SOUND SETTINGS
  // ==========================================

  public toggleSound() {
    this.setSoundEnabled(!this.soundEnabled);
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;

    localStorage.setItem(
      "mdd_sound_enabled",
      String(enabled)
    );

    if (this.ctx && this.sfxGain) {
      this.sfxGain.gain.setTargetAtTime(
        enabled ? 0.8 : 0,
        this.ctx.currentTime,
        0.03
      );
    }
  }

  // ==========================================
  // MUSIC SETTINGS
  // ==========================================

  public toggleMusic() {
    this.setMusicEnabled(!this.musicEnabled);
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;

    localStorage.setItem(
      "mdd_music_enabled",
      String(enabled)
    );

    if (enabled) {
      this.init();

      if (this.ctx && this.musicGain) {
        this.musicGain.gain.setTargetAtTime(
          0.18,
          this.ctx.currentTime,
          0.1
        );
      }

      this.startMusic();
    } else {
      this.stopMusic();

      if (this.ctx && this.musicGain) {
        this.musicGain.gain.setTargetAtTime(
          0,
          this.ctx.currentTime,
          0.1
        );
      }
    }
  }
}

// ==========================================
// EXPORT AUDIO ENGINE
// ==========================================

export const audio = new SoundEngine();
