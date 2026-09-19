/**
 * Procedural Web Audio API sound synthesis engine for Cthulhu's Inbox.
 * Generates all sound effects dynamically without external audio files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  // Cosmic Drone Nodes
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneLfo: OscillatorNode | null = null;
  private droneLfoGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private isDroneActive: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {
        // Handled after explicit user gesture
      });
    }

    return this.ctx;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.stopCosmicDrone();
    } else {
      this.startCosmicDrone();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Ambient Cosmic Drone Generator:
   * Continuous low-frequency hum/sub-bass drone generator (40Hz-60Hz with subtle detune oscillation).
   */
  public startCosmicDrone(): void {
    if (this.isMuted || this.isDroneActive || typeof window === "undefined") return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Primary 48Hz Sub-bass oscillator
      const osc1 = ctx.createOscillator();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(48, now);

      // Secondary 52.4Hz detuned oscillator creating a 4.4Hz cosmic acoustic beating
      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(52.4, now);

      // Lowpass filter to keep sound deep and atmospheric
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(110, now);
      filter.Q.setValueAtTime(2, now);

      // Ultra-slow LFO (0.12Hz) undulating filter frequency
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.12, now);
      lfoGain.gain.setValueAtTime(35, now);
      lfo.connect(filter.frequency);

      // Master drone gain node with smooth fade-in
      const masterDroneGain = ctx.createGain();
      masterDroneGain.gain.setValueAtTime(0.0001, now);
      masterDroneGain.gain.linearRampToValueAtTime(0.038, now + 1.2);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterDroneGain);
      masterDroneGain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      lfo.start(now);

      this.droneOsc1 = osc1;
      this.droneOsc2 = osc2;
      this.droneLfo = lfo;
      this.droneLfoGain = lfoGain;
      this.droneFilter = filter;
      this.droneGain = masterDroneGain;
      this.isDroneActive = true;
    } catch {
      // Audio autoplay policy handled on interaction
    }
  }

  /**
   * Stops the continuous ambient cosmic drone.
   */
  public stopCosmicDrone(): void {
    if (!this.isDroneActive) return;
    const ctx = this.getContext();
    if (ctx && this.droneGain) {
      try {
        const now = ctx.currentTime;
        this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
        this.droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

        const osc1 = this.droneOsc1;
        const osc2 = this.droneOsc2;
        const lfo = this.droneLfo;

        setTimeout(() => {
          try {
            osc1?.stop();
            osc2?.stop();
            lfo?.stop();
            osc1?.disconnect();
            osc2?.disconnect();
            lfo?.disconnect();
          } catch {
            // Ignore if already disconnected
          }
        }, 350);
      } catch {
        // Fail-safe
      }
    }

    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.droneLfo = null;
    this.droneLfoGain = null;
    this.droneFilter = null;
    this.droneGain = null;
    this.isDroneActive = false;
  }

  public getIsDroneActive(): boolean {
    return this.isDroneActive;
  }

  /**
   * Mechanical rubber stamp impact sound:
   * Heavy bureaucratic wooden handle platen thump with paper slap.
   */
  public playStampThump(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Low heavy thump
    const thumpOsc = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    const thumpFilter = ctx.createBiquadFilter();

    thumpOsc.type = "sine";
    thumpOsc.frequency.setValueAtTime(120, now);
    thumpOsc.frequency.exponentialRampToValueAtTime(32, now + 0.14);

    thumpFilter.type = "lowpass";
    thumpFilter.frequency.setValueAtTime(220, now);

    thumpGain.gain.setValueAtTime(0.35, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    thumpOsc.connect(thumpFilter);
    thumpFilter.connect(thumpGain);
    thumpGain.connect(ctx.destination);

    thumpOsc.start(now);
    thumpOsc.stop(now + 0.18);

    // 2. Paper slap / wooden click transient
    const slapOsc = ctx.createOscillator();
    const slapGain = ctx.createGain();
    const slapFilter = ctx.createBiquadFilter();

    slapOsc.type = "triangle";
    slapOsc.frequency.setValueAtTime(750, now);
    slapOsc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

    slapFilter.type = "bandpass";
    slapFilter.frequency.setValueAtTime(650, now);
    slapFilter.Q.setValueAtTime(2, now);

    slapGain.gain.setValueAtTime(0.2, now);
    slapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    slapOsc.connect(slapFilter);
    slapFilter.connect(slapGain);
    slapGain.connect(ctx.destination);

    slapOsc.start(now);
    slapOsc.stop(now + 0.055);
  }

  /**
   * Dissonance audio chord for [DRIVE PETITIONER MAD]:
   * Eerie microtonal cluster (minor second + tritone) with fast psychoacoustic tremolo.
   */
  public playDissonanceChord(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.85;

    // Dissonant microtonal cluster: A4 (440Hz), Bb4 (466Hz), Eb5 (622Hz tritone), G#5 (830Hz)
    const clusterFreqs = [440, 466.16, 622.25, 830.6];

    clusterFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? "sawtooth" : "square";
      osc.frequency.setValueAtTime(freq, now);
      // Slight pitch drift
      osc.frequency.linearRampToValueAtTime(freq * (1 + (idx - 1.5) * 0.04), now + duration);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(freq, now);
      filter.Q.setValueAtTime(3.5, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.09 / (idx + 1), now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  /**
   * Sub-second high-pitch square-wave tick simulating mechanical teletype relays.
   */
  public playKeyClick(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "square";
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.035);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(3, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  /**
   * Procedural teletype typewriter impact noise with deep mechanical clack
   * and high-transient hammer platen strike.
   */
  public playTeletypeClick(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    const bodyFilter = ctx.createBiquadFilter();

    bodyOsc.type = "triangle";
    bodyOsc.frequency.setValueAtTime(340, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(70, now + 0.038);

    bodyFilter.type = "lowpass";
    bodyFilter.frequency.setValueAtTime(450, now);

    bodyGain.gain.setValueAtTime(0.14, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    bodyOsc.connect(bodyFilter);
    bodyFilter.connect(bodyGain);
    bodyGain.connect(ctx.destination);

    bodyOsc.start(now);
    bodyOsc.stop(now + 0.045);

    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    const clickFilter = ctx.createBiquadFilter();

    clickOsc.type = "square";
    clickOsc.frequency.setValueAtTime(1400, now);
    clickOsc.frequency.exponentialRampToValueAtTime(400, now + 0.022);

    clickFilter.type = "bandpass";
    clickFilter.frequency.setValueAtTime(1200, now);
    clickFilter.Q.setValueAtTime(2.5, now);

    clickGain.gain.setValueAtTime(0.09, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    clickOsc.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(ctx.destination);

    clickOsc.start(now);
    clickOsc.stop(now + 0.03);
  }

  /**
   * Low distortion oscillator sweep downward simulating abyssal smiting.
   */
  public playEldritchSmite(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 1.3;

    const distortion = ctx.createWaveShaper();
    const nSamples = 44100;
    const curve = new Float32Array(nSamples);
    const deg = Math.PI / 180;
    const k = 45;
    for (let i = 0; i < nSamples; ++i) {
      const x = (i * 2) / nSamples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    distortion.curve = curve;
    distortion.oversample = "4x";

    const osc1 = ctx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(260, now);
    osc1.frequency.exponentialRampToValueAtTime(28, now + duration);

    const osc2 = ctx.createOscillator();
    osc2.type = "square";
    osc2.frequency.setValueAtTime(90, now);
    osc2.frequency.exponentialRampToValueAtTime(20, now + duration);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(distortion);
    osc2.connect(distortion);
    distortion.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  /**
   * Metallic two-tone chime for sanctioning doomsday decrees.
   */
  public playSanction(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 1.1;
    const tones = [587.33, 880.0, 1174.66];

    tones.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = index === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq + (index * 3.5), now);

      filter.type = "highpass";
      filter.frequency.setValueAtTime(300, now);

      const peakGain = 0.12 / (index + 1);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(peakGain, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  /**
   * High-frequency dissonant warble causing psychic disorientation.
   */
  public playInsanityPulse(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.95;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(1480, now);
    osc1.frequency.exponentialRampToValueAtTime(740, now + duration);

    osc2.type = "square";
    osc2.frequency.setValueAtTime(1535, now);
    osc2.frequency.exponentialRampToValueAtTime(780, now + duration);

    lfo.type = "sine";
    lfo.frequency.setValueAtTime(24, now);
    lfoGain.gain.setValueAtTime(150, now);
    lfo.connect(osc1.frequency);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(4, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    lfo.start(now);
    osc1.start(now);
    osc2.start(now);
    lfo.stop(now + duration);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  /**
   * Terminal boot chirp sequence.
   */
  public playBootSequence(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const freqs = [440, 660, 880, 1320];
    freqs.forEach((freq, idx) => {
      const start = ctx.currentTime + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.05, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.075);
    });
  }
}

export const soundEngine = new SoundEngine();
