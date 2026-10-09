// Plays a short three-note chime with the Web Audio API.
// Generated in code, so there is no audio file to ship or license.
let audioContext;

export function playChime() {
  audioContext ??= new AudioContext();
  const start = audioContext.currentTime + 0.05;
  const notes = [659.25, 783.99, 1046.5]; // E5, G5, C6

  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const at = start + index * 0.22;

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.35, at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.6);

    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(at);
    oscillator.stop(at + 0.65);
  });
}
