// Core types for ATT application

export type AttentionPhase = 'selective' | 'switching' | 'divided';

export type SelfAttentionRating = -3 | -2 | -1 | 0 | 1 | 2 | 3;

export interface AttentionRating {
  value: SelfAttentionRating;
  timestamp: number;
}

export interface SessionData {
  id: string;
  startTime: number;
  endTime?: number;
  preRating: AttentionRating;
  postRating?: AttentionRating;
  completed: boolean;
}

export type SoundDistance = 'internal' | 'near' | 'far';

export interface SoundSource {
  id: string;
  name: string;
  audioPath: string;
  position: AudioPosition;
  distance: SoundDistance;
  description: string;
}

export interface AudioPosition {
  // Stereo positioning: -1 (left) to 1 (right)
  pan: number;
  // Distance: 0 (close) to 1 (far)
  distance: number;
  // 3D positioning (optional, for Web Audio API)
  x?: number;
  y?: number;
  z?: number;
}

export interface AttInstruction {
  phase: AttentionPhase;
  text: string;
  timing: number; // when to display (in milliseconds from phase start)
  duration?: number; // how long to display (optional)
}

export interface PhaseConfig {
  phase: AttentionPhase;
  duration: number; // in milliseconds
  instructions: AttInstruction[];
}

export interface SwitchingCue {
  targetSoundId: string;
  timing: number; // when to switch (in milliseconds from phase start)
  interval: number; // interval used (for tracking)
}
