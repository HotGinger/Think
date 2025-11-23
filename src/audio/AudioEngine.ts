import { SoundSource, AudioPosition } from '@/types';

/**
 * AudioEngine manages spatial audio playback for ATT protocol
 * Uses Web Audio API for precise control and spatial positioning
 */
export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private gainNodes: Map<string, GainNode> = new Map();
  private pannerNodes: Map<string, StereoPannerNode> = new Map();
  private sources: Map<string, MediaElementAudioSourceNode> = new Map();
  private isInitialized = false;

  constructor() {}

  /**
   * Initialize the audio context and prepare sound sources
   * MUST be called after user interaction due to browser autoplay policies
   */
  async initialize(soundSources: SoundSource[]): Promise<void> {
    if (this.isInitialized) return;

    // Create AudioContext
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Load and setup each sound source
    for (const source of soundSources) {
      await this.loadSound(source);
    }

    this.isInitialized = true;
  }

  /**
   * Load a sound file and create audio nodes
   */
  private async loadSound(source: SoundSource): Promise<void> {
    if (!this.audioContext) throw new Error('AudioContext not initialized');

    const audio = new Audio(source.audioPath);
    audio.loop = true;
    audio.preload = 'auto';

    // Create audio nodes
    const sourceNode = this.audioContext.createMediaElementSource(audio);
    const gainNode = this.audioContext.createGain();
    const pannerNode = this.audioContext.createStereoPanner();

    // Set initial spatial positioning
    pannerNode.pan.value = source.position.pan;

    // Set volume based on distance (closer = louder)
    const baseVolume = 0.3; // Base volume to prevent distortion
    const distanceFactor = 1 - source.position.distance;
    gainNode.gain.value = baseVolume * distanceFactor;

    // Connect nodes: source -> gain -> panner -> destination
    sourceNode.connect(gainNode);
    gainNode.connect(pannerNode);
    pannerNode.connect(this.audioContext.destination);

    // Store references
    this.audioElements.set(source.id, audio);
    this.sources.set(source.id, sourceNode);
    this.gainNodes.set(source.id, gainNode);
    this.pannerNodes.set(source.id, pannerNode);
  }

  /**
   * Play a specific sound
   */
  async play(soundId: string): Promise<void> {
    const audio = this.audioElements.get(soundId);
    if (!audio) {
      console.warn(`Sound ${soundId} not found`);
      return;
    }

    try {
      await audio.play();
    } catch (error) {
      console.error(`Error playing sound ${soundId}:`, error);
    }
  }

  /**
   * Stop a specific sound
   */
  stop(soundId: string): void {
    const audio = this.audioElements.get(soundId);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  /**
   * Play all sounds simultaneously
   */
  async playAll(): Promise<void> {
    const promises = Array.from(this.audioElements.keys()).map(id => this.play(id));
    await Promise.all(promises);
  }

  /**
   * Stop all sounds
   */
  stopAll(): void {
    this.audioElements.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  /**
   * Fade in a sound over duration (ms)
   */
  async fadeIn(soundId: string, duration: number = 1000): Promise<void> {
    const gainNode = this.gainNodes.get(soundId);
    const audio = this.audioElements.get(soundId);

    if (!gainNode || !audio || !this.audioContext) return;

    const currentTime = this.audioContext.currentTime;
    const targetGain = gainNode.gain.value;

    // Start from silence
    gainNode.gain.setValueAtTime(0, currentTime);

    // Play the audio
    await this.play(soundId);

    // Fade to target volume
    gainNode.gain.linearRampToValueAtTime(targetGain, currentTime + duration / 1000);
  }

  /**
   * Fade out a sound over duration (ms)
   */
  async fadeOut(soundId: string, duration: number = 1000): Promise<void> {
    const gainNode = this.gainNodes.get(soundId);
    const audio = this.audioElements.get(soundId);

    if (!gainNode || !audio || !this.audioContext) return;

    const currentTime = this.audioContext.currentTime;
    const currentGain = gainNode.gain.value;

    // Fade to silence
    gainNode.gain.setValueAtTime(currentGain, currentTime);
    gainNode.gain.linearRampToValueAtTime(0, currentTime + duration / 1000);

    // Stop after fade completes
    setTimeout(() => {
      this.stop(soundId);
      // Restore original gain for next play
      gainNode.gain.setValueAtTime(currentGain, this.audioContext!.currentTime);
    }, duration);
  }

  /**
   * Set volume for a specific sound (0-1)
   */
  setVolume(soundId: string, volume: number): void {
    const gainNode = this.gainNodes.get(soundId);
    if (gainNode && this.audioContext) {
      gainNode.gain.setValueAtTime(
        Math.max(0, Math.min(1, volume)),
        this.audioContext.currentTime
      );
    }
  }

  /**
   * Add subtle random variation to sound position
   * Prevents habituation and maintains cognitive load
   */
  addPositionVariation(soundId: string, amount: number = 0.1): void {
    const pannerNode = this.pannerNodes.get(soundId);
    if (!pannerNode || !this.audioContext) return;

    const currentPan = pannerNode.pan.value;
    const variation = (Math.random() - 0.5) * amount * 2;
    const newPan = Math.max(-1, Math.min(1, currentPan + variation));

    pannerNode.pan.setValueAtTime(newPan, this.audioContext.currentTime);
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.stopAll();

    this.audioElements.clear();
    this.gainNodes.clear();
    this.pannerNodes.clear();
    this.sources.clear();

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.isInitialized = false;
  }

  /**
   * Check if engine is ready
   */
  isReady(): boolean {
    return this.isInitialized && this.audioContext !== null;
  }

  /**
   * Resume audio context (required after page becomes inactive)
   */
  async resume(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
}
