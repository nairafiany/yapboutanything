export function playChime(kind = "think") {
  if (typeof window === "undefined") return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const notes = kind === "think" ? [523.25, 659.25] : [440, 554.37, 659.25];
  notes.forEach((frequency, i) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, now + i * 0.11);
    gain.gain.linearRampToValueAtTime(0.08, now + i * 0.11 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.11 + 0.65);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(now + i * 0.11);
    oscillator.stop(now + i * 0.11 + 0.7);
  });
  setTimeout(() => ctx.close(), 1200);
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  return `${String(mins).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function friendlyTime(seconds) {
  if (seconds < 60) return `${seconds} sec`;
  return `${seconds / 60} min`;
}
