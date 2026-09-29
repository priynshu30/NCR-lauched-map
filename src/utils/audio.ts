// Modern Web Audio synthesized Delhi Metro soundscapes & micro-interactions
let audioCtx: AudioContext | null = null;
let soundEnabled = true;

// Pre-warm Web Speech API voices to eliminate Chrome TTS startup delay
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      try { window.speechSynthesis.getVoices(); } catch {}
    };
  } catch {}
}

export const toggleSound = () => {
  soundEnabled = !soundEnabled;
  return soundEnabled;
};

export const isSoundEnabled = () => soundEnabled;

export const setSoundEnabled = (val: boolean) => {
  soundEnabled = val;
  return soundEnabled;
};

const getAudioContext = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// ─── Pin & Toggle UI Sounds ───────────────────────────────────────────────────

export const playPinClickSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // ignore audio errors
  }
};

export const playHiringToggleSound = (isHiring: boolean) => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    if (isHiring) {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
    } else {
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(330, now + 0.15);
    }

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(now + 0.18);
  } catch {
    // ignore audio errors
  }
};

// ─── AUTHENTIC DELHI METRO SOUNDS ─────────────────────────────────────────────

/**
 * Plays the iconic 4-tone Delhi Metro chime (C5 -> E5 -> G5 -> C6)
 * followed by the two-tone closing chime alert (G5 -> E5).
 * Responds instantly with zero latency.
 */
export const playDelhiMetroChime = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Authentic Delhi Metro 4-Tone Arrival Chime frequencies (in Hz)
    const chimeNotes = [
      { freq: 523.25, time: 0.00, dur: 0.32, vol: 0.14 }, // C5
      { freq: 659.25, time: 0.12, dur: 0.32, vol: 0.15 }, // E5
      { freq: 783.99, time: 0.24, dur: 0.32, vol: 0.16 }, // G5
      { freq: 1046.5, time: 0.36, dur: 0.60, vol: 0.18 }, // C6 (sustained bell chime)
      // Closing 2-tone door alert
      { freq: 783.99, time: 0.85, dur: 0.22, vol: 0.13 }, // G5
      { freq: 659.25, time: 1.02, dur: 0.38, vol: 0.12 }, // E5
    ];

    chimeNotes.forEach(({ freq, time, dur, vol }) => {
      const t = now + time;

      // Primary chime bell tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      // Fast attack & bell exponential decay
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + dur);

      // Metallic overtone (2.76x for tubular chime resonance)
      const overtone = ctx.createOscillator();
      const overGain = ctx.createGain();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2.76, t);

      overGain.gain.setValueAtTime(0.001, t);
      overGain.gain.linearRampToValueAtTime(vol * 0.28, t + 0.01);
      overGain.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.6);

      overtone.connect(overGain);
      overGain.connect(ctx.destination);

      overtone.start(t);
      overtone.stop(t + dur * 0.6);
    });
  } catch {
    // audio failure fallback
  }
};

/**
 * Realistic Delhi Metro Running Train Sound:
 * - 3-Phase VVVF Inverter AC motor acceleration & speed hum (Hyundai Rotem & Bombardier)
 * - Rhythmic steel wheel rail-joint clicks ("dhadak-dhadak, dhadak-dhadak") for 6-coach rake
 * - Heavy elevated viaduct concrete rumble
 * - Aerodynamic air displacement & pneumatic brake release
 */
export const playMetroRunningSound = (durationSec = 6.0) => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // ── 1. VVVF AC Traction Inverter Sound (Authentic Hyundai Rotem / Bombardier) ──
    const motorOsc = ctx.createOscillator();
    const motorGain = ctx.createGain();
    motorOsc.type = 'triangle';

    // Characteristic Delhi Metro VVVF inverter frequency stepping
    motorOsc.frequency.setValueAtTime(160, now);
    motorOsc.frequency.linearRampToValueAtTime(260, now + 1.2);
    motorOsc.frequency.linearRampToValueAtTime(390, now + 2.2);
    motorOsc.frequency.linearRampToValueAtTime(580, now + 3.8);
    motorOsc.frequency.linearRampToValueAtTime(740, now + 4.8);
    motorOsc.frequency.exponentialRampToValueAtTime(320, now + durationSec);

    motorGain.gain.setValueAtTime(0.001, now);
    motorGain.gain.linearRampToValueAtTime(0.065, now + 1.0);
    motorGain.gain.setValueAtTime(0.07, now + 3.5);
    motorGain.gain.exponentialRampToValueAtTime(0.0005, now + durationSec);

    motorOsc.connect(motorGain);
    motorGain.connect(ctx.destination);
    motorOsc.start(now);
    motorOsc.stop(now + durationSec);

    // Harmonic Inverter Overtones (the recognizable singing chime of DMRC trains)
    const overtoneOsc = ctx.createOscillator();
    const overtoneGain = ctx.createGain();
    overtoneOsc.type = 'sine';
    overtoneOsc.frequency.setValueAtTime(320, now);
    overtoneOsc.frequency.linearRampToValueAtTime(780, now + 3.0);
    overtoneOsc.frequency.linearRampToValueAtTime(1160, now + 4.5);

    overtoneGain.gain.setValueAtTime(0.001, now);
    overtoneGain.gain.linearRampToValueAtTime(0.025, now + 1.5);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0002, now + durationSec * 0.85);

    overtoneOsc.connect(overtoneGain);
    overtoneGain.connect(ctx.destination);
    overtoneOsc.start(now);
    overtoneOsc.stop(now + durationSec * 0.85);

    // ── 2. Concrete Viaduct Heavy Sub Rumble ──
    const rumbleOsc = ctx.createOscillator();
    const rumbleGain = ctx.createGain();
    rumbleOsc.type = 'sine';
    rumbleOsc.frequency.setValueAtTime(68, now);
    rumbleOsc.frequency.linearRampToValueAtTime(82, now + 2.5);
    rumbleOsc.frequency.linearRampToValueAtTime(65, now + durationSec);

    rumbleGain.gain.setValueAtTime(0.001, now);
    rumbleGain.gain.linearRampToValueAtTime(0.08, now + 0.8);
    rumbleGain.gain.linearRampToValueAtTime(0.08, now + 4.0);
    rumbleGain.gain.exponentialRampToValueAtTime(0.0005, now + durationSec);

    rumbleOsc.connect(rumbleGain);
    rumbleGain.connect(ctx.destination);
    rumbleOsc.start(now);
    rumbleOsc.stop(now + durationSec);

    // ── 3. Rhythmic Rail Wheel Joint Beats ("Dhadak-Dhadak") for 6 Coaches ──
    // Multiple wheelsets crossing track expansion joints
    const jointTimes = [0.35, 0.85, 1.35, 1.85, 2.35, 2.85, 3.35, 3.85, 4.35, 4.85];
    jointTimes.forEach((jt) => {
      // Axle 1 click
      playWheelClick(ctx, now + jt, 0.05);
      // Axle 2 click (bogie partner, 65ms delay)
      playWheelClick(ctx, now + jt + 0.065, 0.042);
    });

    // ── 4. Pneumatic air brake release whoosh at end ("pssshh") ──
    playPneumaticWhoosh(ctx, now + durationSec - 1.2, 1.1);

  } catch {
    // audio ignore
  }
};

/**
 * Synthetic rail-joint wheel click:
 * High metallic 'tuck' + sub bass track 'thump'
 */
const playWheelClick = (ctx: AudioContext, time: number, vol: number) => {
  try {
    // 1. High metallic wheel flange tick
    const oscHigh = ctx.createOscillator();
    const gainHigh = ctx.createGain();
    oscHigh.type = 'triangle';
    oscHigh.frequency.setValueAtTime(980, time);
    oscHigh.frequency.exponentialRampToValueAtTime(450, time + 0.035);

    gainHigh.gain.setValueAtTime(vol, time);
    gainHigh.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    oscHigh.connect(gainHigh);
    gainHigh.connect(ctx.destination);
    oscHigh.start(time);
    oscHigh.stop(time + 0.04);

    // 2. Concrete girder structural thump
    const oscLow = ctx.createOscillator();
    const gainLow = ctx.createGain();
    oscLow.type = 'sine';
    oscLow.frequency.setValueAtTime(110, time);
    oscLow.frequency.exponentialRampToValueAtTime(45, time + 0.06);

    gainLow.gain.setValueAtTime(vol * 1.2, time);
    gainLow.gain.exponentialRampToValueAtTime(0.001, time + 0.07);

    oscLow.connect(gainLow);
    gainLow.connect(ctx.destination);
    oscLow.start(time);
    oscLow.stop(time + 0.07);
  } catch {}
};

/**
 * Pneumatic air suspension and brake discharge hiss
 */
const playPneumaticWhoosh = (ctx: AudioContext, time: number, duration: number) => {
  try {
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, time);
    filter.frequency.linearRampToValueAtTime(600, time + duration);
    filter.Q.value = 2.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.025, time + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0005, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(time);
    noise.stop(time + duration);
  } catch {}
};

export const playMetroPassingSound = () => {
  playMetroRunningSound(5.5);
};

/**
 * Dual-tone Delhi Metro pneumatic electric horn (440Hz + 554.37Hz)
 */
export const playDelhiMetroHorn = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    [440, 554.37].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    });
  } catch {
    // ignore
  }
};

export const HINDI_DMRC_ANNOUNCEMENTS = [
  {
    hindi: 'अगला स्टेशन मिलेनियम सिटी सेंटर गुरुग्राम है। दरवाजे बायीं तरफ खुलेंगे। कृपया सावधानी से उतरें।',
    roman: 'Agla station Millennium City Centre Gurugram hai. Darwaaze baayeen taraf khulengey. Kripya savdhaani se utarein.',
    display: 'अगला स्टेशन: मिलेनियम सिटी सेंटर गुरुग्राम'
  },
  {
    hindi: 'अगला स्टेशन नोएडा सेक्टर 62 है। दरवाजे बायीं तरफ खुलेंगे।',
    roman: 'Agla station Noida Sector 62 hai. Darwaaze baayeen taraf khulengey.',
    display: 'अगला स्टेशन: नोएडा सेक्टर 62'
  },
  {
    hindi: 'अगला स्टेशन राजीव चौक है। येलो लाइन और ब्लू लाइन के लिए यहाँ बदलें। दरवाजे दायीं तरफ खुलेंगे।',
    roman: 'Agla station Rajiv Chowk hai. Yellow Line aur Blue Line ke liye yahaan badlein. Darwaaze daayeen taraf khulengey.',
    display: 'अगला स्टेशन: राजीव चौक (इंटरचेंज)'
  },
  {
    hindi: 'अगला स्टेशन डीएलएफ साइबर सिटी है। कृपया ध्यान दें, दरवाजे बायीं तरफ खुलेंगे।',
    roman: 'Agla station DLF Cyber City hai. Kripya dhyan dein, darwaaze baayeen taraf khulengey.',
    display: 'अगला स्टेशन: डीएलएफ साइबर सिटी'
  }
];

/**
 * Authentic Spoken DMRC Announcement in Hindi with Zero Latency
 */
export const announceDelhiMetroStation = (announcementIndex?: number): string => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return '';
  try {
    const idx = typeof announcementIndex === 'number'
      ? announcementIndex % HINDI_DMRC_ANNOUNCEMENTS.length
      : Math.floor(Math.random() * HINDI_DMRC_ANNOUNCEMENTS.length);

    const item = HINDI_DMRC_ANNOUNCEMENTS[idx];
    const voices = window.speechSynthesis.getVoices();

    // Look specifically for Hindi TTS voice
    const hindiVoice = voices.find((v) =>
      v.lang === 'hi-IN' ||
      v.lang.startsWith('hi') ||
      v.name.toLowerCase().includes('hindi') ||
      v.name.includes('Kalpana') ||
      v.name.includes('Hemant') ||
      v.name.includes('Swara') ||
      v.name.includes('Madhur')
    );

    // Fallback to Indian English voice
    const indianVoice = voices.find((v) =>
      v.lang.includes('en-IN') ||
      v.name.includes('India') ||
      v.name.includes('Zira') ||
      v.name.includes('Google UK English Female')
    );

    // If Hindi voice is present, speak pure Devanagari Hindi!
    // Otherwise speak phonetic Roman Hindi so Indian English voices pronounce it in Hindi!
    const textToSpeak = hindiVoice ? item.hindi : item.roman;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    if (hindiVoice) {
      utterance.voice = hindiVoice;
      utterance.lang = 'hi-IN';
    } else if (indianVoice) {
      utterance.voice = indianVoice;
      utterance.lang = 'en-IN';
    } else {
      utterance.lang = 'hi-IN';
    }

    utterance.rate = 0.94; // Authentic calm, clear DMRC announcement pace
    utterance.pitch = 1.05;
    utterance.volume = 1.0;

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.speak(utterance);
    return item.display;
  } catch (e) {
    return '';
  }
};

/**
 * Complete Delhi Metro Experience (Instant Zero-Latency Execution):
 * Chime starts immediately (0ms) -> Hindi Spoken Announcement begins smoothly at 280ms
 */
export const playDelhiMetroFullExperience = (index?: number): string => {
  if (!soundEnabled) return '';
  playDelhiMetroChime();
  playMetroPassingSound();

  const idx = typeof index === 'number' ? index : Math.floor(Math.random() * HINDI_DMRC_ANNOUNCEMENTS.length);
  const display = HINDI_DMRC_ANNOUNCEMENTS[idx].display;

  // Immediate smooth onset (no 4-second delay)
  setTimeout(() => {
    if (soundEnabled) {
      announceDelhiMetroStation(idx);
    }
  }, 260);

  return display;
};
