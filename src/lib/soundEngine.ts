// Professional Web Audio Synthesizer for Esports Atmosphere
// Zero external mp3 dependencies, instant playback, zero latency

let audioCtx: AudioContext | null = null;
let isMuted = false;

// Initialize on first user interaction
function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioCtxClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function isSoundMuted(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("esp_sound_muted") === "true";
  }
  return isMuted;
}

export function setSoundMuted(muted: boolean) {
  isMuted = muted;
  if (typeof window !== "undefined") {
    localStorage.setItem("esp_sound_muted", muted ? "true" : "false");
  }
}

export function toggleSoundMuted(): boolean {
  const current = isSoundMuted();
  setSoundMuted(!current);
  return !current;
}

/** Play a subtle futuristic UI click */
export function playUiClick() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = "sine";
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
  
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.04);
}

/** Role Selected Beep */
export function playRoleSelect() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(520, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.09);
}

/** Rapid roulette spinning tick */
export function playSpinTick() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "square";
  osc.frequency.setValueAtTime(320 + Math.random() * 80, now);

  gain.gain.setValueAtTime(0.04, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.03);
}

/** Heavy Lock-In Bass Drop Impact */
export function playLockInSound() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Sub bass sweep
  const subOsc = ctx.createOscillator();
  const subGain = ctx.createGain();
  subOsc.type = "sine";
  subOsc.frequency.setValueAtTime(220, now);
  subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.45);
  subGain.gain.setValueAtTime(0.3, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
  subOsc.connect(subGain);
  subGain.connect(ctx.destination);
  subOsc.start(now);
  subOsc.stop(now + 0.55);

  // Metallic High Chime
  const highOsc = ctx.createOscillator();
  const highGain = ctx.createGain();
  highOsc.type = "triangle";
  highOsc.frequency.setValueAtTime(987.77, now); // B5
  highOsc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.15); // E6
  highGain.gain.setValueAtTime(0.15, now);
  highGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  highOsc.connect(highGain);
  highGain.connect(ctx.destination);
  highOsc.start(now);
  highOsc.stop(now + 0.35);
}

/** Tension Clock Countdown Tick */
export function playTimerTick(urgent = false) {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = urgent ? "sawtooth" : "sine";
  osc.frequency.setValueAtTime(urgent ? 1040 : 660, now);

  gain.gain.setValueAtTime(urgent ? 0.14 : 0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.06);
}

/** Metallic Coin Toss Spin & Ding */
export function playCoinTossSound() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const frequencies = [1200, 1500, 2000, 2400];

  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + idx * 0.06);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.2, now + idx * 0.06 + 0.15);

    gain.gain.setValueAtTime(0.1, now + idx * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.06);
    osc.stop(now + idx * 0.06 + 0.25);
  });
}

/** Map Ban / Pick Impact */
export function playMapVetoSound(isBan = false) {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  if (isBan) {
    // Harsh red ban thud
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
  } else {
    // Harmonious green pick chime
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  }

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.25);
}

/** Victory / MVP Fanfare Chords */
export function playVictoryFanfare() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio

  chord.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now + i * 0.09);

    gain.gain.setValueAtTime(0.12, now + i * 0.09);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * 0.09);
    osc.stop(now + i * 0.09 + 0.45);
  });
}
