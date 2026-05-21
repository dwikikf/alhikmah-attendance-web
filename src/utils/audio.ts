/**
 * Audio utilities for the application
 */

const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

/**
 * Plays a short beep sound for success feedback
 * Uses Web Audio API to generate a synth beep without needing external files
 */
export const playSuccessBeep = () => {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // High pitch short beep typical for scanners
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note

  // Envelope
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.05);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.15);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.15);
};

/**
 * Plays an error buzzer sound
 */
export const playErrorBuzzer = () => {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Lower harsh tone for error
  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(150, audioContext.currentTime);

  // Envelope
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
};
