
// Basic pop sound using a tiny encoded wav file to avoid external dependency issues
const POP_SOUND = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="; // Placeholder - browser default or silent if fails

class AudioService {
  private audioContext: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private hapticsEnabled: boolean = true;

  constructor() {
    // Initialize AudioContext on user interaction to comply with autoplay policies
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        this.audioContext = new AudioContext();
      }
    } catch (e) {
      console.error("Web Audio API not supported");
    }
  }

  setSettings(sound: boolean, haptics: boolean) {
    this.soundEnabled = sound;
    this.hapticsEnabled = haptics;
  }

  // Play a short generated beep/pop using Oscillator for zero-latency
  playClick() {
    if (!this.soundEnabled || !this.audioContext) return;
    
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime); // 600Hz beep
      oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime); // Low volume
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.05);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  }

  triggerHaptic(pattern: number | number[] = 5) {
    if (!this.hapticsEnabled || !navigator.vibrate) return;
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignore if not supported or blocked
    }
  }
}

export const audioService = new AudioService();
