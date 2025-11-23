import { AudioEngine } from '@/audio/AudioEngine';
import { SOUND_SOURCES } from '@/audio/soundSources';
import {
  SELECTIVE_ATTENTION_CONFIG,
  SWITCHING_ATTENTION_CONFIG,
  DIVIDED_ATTENTION_CONFIG,
  generateSwitchingCues,
  getSelectiveAttentionTarget,
} from './attProtocol';
import { AttentionPhase, AttInstruction, SwitchingCue } from '@/types';

export type SessionEventType =
  | 'phase-start'
  | 'phase-end'
  | 'instruction'
  | 'switch-sound'
  | 'session-complete';

export interface SessionEvent {
  type: SessionEventType;
  phase: AttentionPhase;
  data?: any;
  timestamp: number;
}

export type SessionEventCallback = (event: SessionEvent) => void;

/**
 * SessionManager orchestrates the complete 12-minute ATT protocol
 * Manages three phases: Selective, Switching, Divided attention
 */
export class SessionManager {
  private audioEngine: AudioEngine;
  private currentPhase: AttentionPhase | null = null;
  private isRunning = false;
  private startTime = 0;
  private phaseStartTime = 0;
  private timeouts: NodeJS.Timeout[] = [];
  private intervals: NodeJS.Timeout[] = [];
  private eventCallback: SessionEventCallback | null = null;

  // Switching phase data
  private switchingCues: SwitchingCue[] = [];
  private currentSwitchIndex = 0;
  private currentTargetSound: string = '';

  constructor(audioEngine: AudioEngine) {
    this.audioEngine = audioEngine;
  }

  /**
   * Set event callback for UI updates
   */
  onEvent(callback: SessionEventCallback): void {
    this.eventCallback = callback;
  }

  /**
   * Emit an event
   */
  private emitEvent(type: SessionEventType, data?: any): void {
    if (this.eventCallback && this.currentPhase) {
      this.eventCallback({
        type,
        phase: this.currentPhase,
        data,
        timestamp: Date.now() - this.startTime,
      });
    }
  }

  /**
   * Start the complete ATT session
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.warn('Session already running');
      return;
    }

    this.isRunning = true;
    this.startTime = Date.now();
    this.timeouts = [];
    this.intervals = [];

    // Start all sounds playing
    await this.audioEngine.playAll();

    // Add subtle position variations every 30 seconds to prevent habituation
    const variationInterval = setInterval(() => {
      SOUND_SOURCES.forEach(source => {
        this.audioEngine.addPositionVariation(source.id, 0.15);
      });
    }, 30000);
    this.intervals.push(variationInterval);

    // Start Phase 1: Selective Attention
    await this.startSelectiveAttention();
  }

  /**
   * PHASE 1: Selective Attention (5 minutes)
   */
  private async startSelectiveAttention(): Promise<void> {
    this.currentPhase = 'selective';
    this.phaseStartTime = Date.now();

    const targetSound = getSelectiveAttentionTarget();
    this.currentTargetSound = targetSound;

    this.emitEvent('phase-start', {
      phaseName: 'Selective Attention',
      targetSound,
      duration: SELECTIVE_ATTENTION_CONFIG.duration,
    });

    // Schedule instructions
    this.scheduleInstructions(SELECTIVE_ATTENTION_CONFIG.instructions);

    // Schedule phase end and transition to switching
    const phaseTimeout = setTimeout(() => {
      this.emitEvent('phase-end', { phaseName: 'Selective Attention' });
      this.startSwitchingAttention();
    }, SELECTIVE_ATTENTION_CONFIG.duration);
    this.timeouts.push(phaseTimeout);
  }

  /**
   * PHASE 2: Rapid Attention Switching (5 minutes)
   */
  private async startSwitchingAttention(): Promise<void> {
    this.currentPhase = 'switching';
    this.phaseStartTime = Date.now();

    // Generate switching cues with randomization
    this.switchingCues = generateSwitchingCues();
    this.currentSwitchIndex = 0;

    this.emitEvent('phase-start', {
      phaseName: 'Rapid Attention Switching',
      duration: SWITCHING_ATTENTION_CONFIG.duration,
    });

    // Schedule instructions
    this.scheduleInstructions(SWITCHING_ATTENTION_CONFIG.instructions);

    // Schedule all switching cues
    this.scheduleSwitchingCues();

    // Schedule phase end and transition to divided
    const phaseTimeout = setTimeout(() => {
      this.emitEvent('phase-end', { phaseName: 'Rapid Attention Switching' });
      this.startDividedAttention();
    }, SWITCHING_ATTENTION_CONFIG.duration);
    this.timeouts.push(phaseTimeout);
  }

  /**
   * PHASE 3: Divided Attention (2 minutes)
   */
  private async startDividedAttention(): Promise<void> {
    this.currentPhase = 'divided';
    this.phaseStartTime = Date.now();

    this.emitEvent('phase-start', {
      phaseName: 'Divided Attention',
      duration: DIVIDED_ATTENTION_CONFIG.duration,
    });

    // Schedule instructions
    this.scheduleInstructions(DIVIDED_ATTENTION_CONFIG.instructions);

    // Schedule session completion
    const phaseTimeout = setTimeout(() => {
      this.emitEvent('phase-end', { phaseName: 'Divided Attention' });
      this.completeSession();
    }, DIVIDED_ATTENTION_CONFIG.duration);
    this.timeouts.push(phaseTimeout);
  }

  /**
   * Schedule instruction display
   */
  private scheduleInstructions(instructions: AttInstruction[]): void {
    instructions.forEach(instruction => {
      const timeout = setTimeout(() => {
        this.emitEvent('instruction', {
          text: instruction.text,
          duration: instruction.duration,
        });
      }, instruction.timing);
      this.timeouts.push(timeout);
    });
  }

  /**
   * Schedule switching cues for Phase 2
   */
  private scheduleSwitchingCues(): void {
    this.switchingCues.forEach((cue, index) => {
      const timeout = setTimeout(() => {
        const sound = SOUND_SOURCES.find(s => s.id === cue.targetSoundId);
        if (sound) {
          this.currentTargetSound = cue.targetSoundId;
          this.currentSwitchIndex = index;

          this.emitEvent('switch-sound', {
            soundName: sound.name,
            soundId: sound.id,
            interval: cue.interval,
            index,
            total: this.switchingCues.length,
          });
        }
      }, cue.timing);
      this.timeouts.push(timeout);
    });
  }

  /**
   * Complete the session
   */
  private completeSession(): void {
    this.emitEvent('session-complete', {
      totalDuration: Date.now() - this.startTime,
    });
    this.stop();
  }

  /**
   * Stop the session
   */
  stop(): void {
    // Clear all timeouts and intervals
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.intervals.forEach(interval => clearInterval(interval));
    this.timeouts = [];
    this.intervals = [];

    // Stop all audio
    this.audioEngine.stopAll();

    this.isRunning = false;
    this.currentPhase = null;
  }

  /**
   * Get current phase
   */
  getCurrentPhase(): AttentionPhase | null {
    return this.currentPhase;
  }

  /**
   * Get elapsed time since session start
   */
  getElapsedTime(): number {
    if (!this.isRunning) return 0;
    return Date.now() - this.startTime;
  }

  /**
   * Get elapsed time since phase start
   */
  getPhaseElapsedTime(): number {
    if (!this.isRunning) return 0;
    return Date.now() - this.phaseStartTime;
  }

  /**
   * Check if session is running
   */
  getIsRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Get current target sound (for selective/switching phases)
   */
  getCurrentTargetSound(): string {
    return this.currentTargetSound;
  }
}
