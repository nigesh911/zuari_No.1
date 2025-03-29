// Sound effects utility

class SoundEffects {
  private static enabled: boolean = true;
  private static initialized: boolean = false;
  private static diamondSound: HTMLAudioElement | null = null;
  private static bombSound: HTMLAudioElement | null = null;
  private static winSound: HTMLAudioElement | null = null;

  // Initialize sound files
  static init() {
    if (this.initialized) return;

    try {
      console.log("Initializing sound effects...");
      
      // Load each sound and handle errors for each one separately
      try {
        this.diamondSound = new Audio('/sounds/diamond.mp3');
        this.diamondSound.volume = 0.4;
        
        // Add error listeners to detect loading issues
        this.diamondSound.addEventListener('error', (e) => {
          console.log(`Diamond sound error: ${e.type}`, e);
        });
        
        // Add canplaythrough listener to confirm the sound loaded
        this.diamondSound.addEventListener('canplaythrough', () => {
          console.log("Diamond sound loaded successfully");
        });
      } catch (e) {
        console.log("Diamond sound could not be loaded", e);
      }
      
      try {
        this.bombSound = new Audio('/sounds/explosion.mp3');
        this.bombSound.volume = 0.8;
        
        this.bombSound.addEventListener('error', (e) => {
          console.log(`Bomb sound error: ${e.type}`, e);
        });
        
        this.bombSound.addEventListener('canplaythrough', () => {
          console.log("Bomb sound loaded successfully");
        });
      } catch (e) {
        console.log("Bomb sound could not be loaded", e);
      }
      
      try {
        this.winSound = new Audio('/sounds/win.mp3');
        this.winSound.volume = 0.4;
        
        this.winSound.addEventListener('error', (e) => {
          console.log(`Win sound error: ${e.type}`, e);
        });
        
        this.winSound.addEventListener('canplaythrough', () => {
          console.log("Win sound loaded successfully");
        });
      } catch (e) {
        console.log("Win sound could not be loaded", e);
      }
      
      // Try to "wake up" the audio system
      document.addEventListener('click', () => {
        console.log("Click detected, attempting to wake up audio system");
        const audio = new Audio();
        audio.volume = 0;
        audio.play().catch(() => {/* Silent catch */});
      }, { once: true });
      
      this.initialized = true;
      console.log("Sound effects initialization complete");
    } catch (e) {
      console.error("Error initializing sound effects:", e);
    }
  }

  // Toggle sound on/off
  static toggleSound(enabled: boolean) {
    this.enabled = enabled;
    console.log(`Sound ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Play diamond discovery sound
  static playDiamondSound() {
    if (!this.enabled) {
      console.log("Diamond sound not played (sounds disabled)");
      return;
    }
    
    if (!this.diamondSound) {
      console.log("Diamond sound not available");
      return;
    }
    
    try {
      console.log("Playing diamond sound");
      // Clone the audio element for better parallel playback
      const sound = this.diamondSound.cloneNode() as HTMLAudioElement;
      sound.volume = 0.4;
      sound.play().catch(e => console.log("Diamond sound playback error:", e));
    } catch (e) {
      console.log("Error playing diamond sound:", e);
    }
  }

  // Play bomb explosion sound
  static playBombSound() {
    if (!this.enabled) {
      console.log("Bomb sound not played (sounds disabled)");
      return;
    }
    
    if (!this.bombSound) {
      console.log("Bomb sound not available");
      return;
    }
    
    try {
      console.log("Playing bomb sound");
      const sound = this.bombSound.cloneNode() as HTMLAudioElement;
      sound.volume = 0.8;
      sound.play().catch(e => console.log("Bomb sound playback error:", e));
    } catch (e) {
      console.log("Error playing bomb sound:", e);
    }
  }

  // Play win sound
  static playWinSound() {
    if (!this.enabled) {
      console.log("Win sound not played (sounds disabled)");
      return;
    }
    
    if (!this.winSound) {
      console.log("Win sound not available");
      return;
    }
    
    try {
      console.log("Playing win sound");
      const sound = this.winSound.cloneNode() as HTMLAudioElement;
      sound.volume = 0.4;
      sound.play().catch(e => console.log("Win sound playback error:", e));
    } catch (e) {
      console.log("Error playing win sound:", e);
    }
  }
}

export default SoundEffects; 