"use client";

interface WindowWithWebkitAudio extends Window {
  webkitAudioContext?: typeof AudioContext;
}

// Web Audio API pure mechanical tactile click generator
class SoundController {
  private audioCtx: AudioContext | null = null;
  public enabled: boolean = false;

  private initCtx() {
    if (!this.audioCtx && typeof window !== "undefined") {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as WindowWithWebkitAudio).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public playClick(pitch: number = 800) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(pitch, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        120,
        this.audioCtx.currentTime + 0.04
      );

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioCtx.currentTime + 0.04
      );

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.045);
    } catch {
      // Audio autoplay policy catch
    }
  }

  public playSnap() {
    if (!this.enabled) return;
    this.playClick(1400);
  }

  public playSuccess() {
    if (!this.enabled) return;
    this.playClick(1200);
    setTimeout(() => this.playClick(1600), 60);
  }

  // Futuristic Denver AI Arc Reactor power-up sonic chime
  public playDenverWake() {
    try {
      this.initCtx();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;

      // 1. High-frequency harmonic sweep
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(1680, now + 0.32);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.48);

      // 2. Secondary resonant chord ring
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(880, now + 0.15);
      osc2.frequency.setValueAtTime(1320, now + 0.28);

      gain2.gain.setValueAtTime(0.08, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);

      osc2.start(now + 0.15);
      osc2.stop(now + 0.58);
    } catch {
      // Audio policy catch
    }
  }
}

export const soundManager = new SoundController();

