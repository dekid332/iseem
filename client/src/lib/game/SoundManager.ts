export class SoundManager {
  private hitSound: HTMLAudioElement | null = null;
  private successSound: HTMLAudioElement | null = null;
  private backgroundMusic: HTMLAudioElement | null = null;
  private isMuted: boolean = true;

  constructor() {
    this.loadSounds();
  }

  private async loadSounds(): Promise<void> {
    try {
      // Load hit sound
      this.hitSound = new Audio('/sounds/hit.mp3');
      this.hitSound.volume = 0.3;
      this.hitSound.preload = 'auto';

      // Load success sound
      this.successSound = new Audio('/sounds/success.mp3');
      this.successSound.volume = 0.5;
      this.successSound.preload = 'auto';

      // Load background music
      this.backgroundMusic = new Audio('/sounds/background.mp3');
      this.backgroundMusic.volume = 0.2;
      this.backgroundMusic.loop = true;
      this.backgroundMusic.preload = 'auto';

      console.log('Sounds loaded successfully');
    } catch (error) {
      console.warn('Failed to load sounds:', error);
    }
  }

  playHit(): void {
    if (this.isMuted || !this.hitSound) return;
    
    try {
      // Clone the sound to allow overlapping playback
      const soundClone = this.hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(e => console.log('Hit sound play prevented:', e));
    } catch (error) {
      console.warn('Failed to play hit sound:', error);
    }
  }

  playSuccess(): void {
    if (this.isMuted || !this.successSound) return;
    
    try {
      this.successSound.currentTime = 0;
      this.successSound.play().catch(e => console.log('Success sound play prevented:', e));
    } catch (error) {
      console.warn('Failed to play success sound:', error);
    }
  }

  startBackgroundMusic(): void {
    if (this.isMuted || !this.backgroundMusic) return;
    
    try {
      this.backgroundMusic.play().catch(e => console.log('Background music play prevented:', e));
    } catch (error) {
      console.warn('Failed to start background music:', error);
    }
  }

  stopBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      this.stopBackgroundMusic();
    } else {
      this.startBackgroundMusic();
    }
    
    console.log(`Sound ${this.isMuted ? 'muted' : 'unmuted'}`);
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    
    if (this.isMuted) {
      this.stopBackgroundMusic();
    } else {
      this.startBackgroundMusic();
    }
  }
}
