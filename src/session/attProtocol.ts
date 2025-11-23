import { PhaseConfig, AttInstruction, SwitchingCue } from '@/types';
import { SOUND_SOURCES, getRandomSoundExcluding } from '@/audio/soundSources';

/**
 * ATT Protocol Configuration following Adrian Wells' exact specifications
 * Total duration: 12 minutes (5 + 5 + 2)
 */

const MINUTE = 60 * 1000; // 60,000 ms

/**
 * PHASE 1: SELECTIVE ATTENTION (5 minutes)
 * User focuses on ONE sound and ignores all others
 * Periodic reminders to maintain focus and redirect wandering attention
 */
export const SELECTIVE_ATTENTION_CONFIG: PhaseConfig = {
  phase: 'selective',
  duration: 5 * MINUTE,
  instructions: [
    {
      phase: 'selective',
      text: 'Focus all your attention on the clock ticking.',
      timing: 0,
      duration: 5000,
    },
    {
      phase: 'selective',
      text: 'No other sound matters. Only the clock.',
      timing: 8000,
      duration: 4000,
    },
    {
      phase: 'selective',
      text: 'If your attention is captured by another sound, gently return it to the clock.',
      timing: 60000, // 1 minute
      duration: 5000,
    },
    {
      phase: 'selective',
      text: 'Maintain focus only on the clock ticking.',
      timing: 120000, // 2 minutes
      duration: 4000,
    },
    {
      phase: 'selective',
      text: 'If you notice your mind wandering, simply bring your attention back.',
      timing: 180000, // 3 minutes
      duration: 5000,
    },
    {
      phase: 'selective',
      text: 'Continue focusing only on the clock.',
      timing: 240000, // 4 minutes
      duration: 4000,
    },
  ],
};

/**
 * PHASE 2: RAPID ATTENTION SWITCHING (5 minutes)
 * User switches attention between sounds at decreasing intervals
 * Intervals: 10s → 5s → 3s (unpredictable pattern to prevent habituation)
 */
export function generateSwitchingCues(): SwitchingCue[] {
  const cues: SwitchingCue[] = [];
  let currentTime = 0;

  // Define intervals in order of cognitive difficulty
  const intervals = [
    { duration: 10000, count: 12 }, // 10 seconds × 12 = 2 minutes
    { duration: 5000, count: 24 },  // 5 seconds × 24 = 2 minutes
    { duration: 3000, count: 20 },  // 3 seconds × 20 = 1 minute
  ];

  let lastSoundId = '';

  intervals.forEach(({ duration, count }) => {
    for (let i = 0; i < count; i++) {
      // Select a different sound each time
      const sound = getRandomSoundExcluding([lastSoundId]);
      lastSoundId = sound.id;

      cues.push({
        targetSoundId: sound.id,
        timing: currentTime,
        interval: duration,
      });

      currentTime += duration;
    }
  });

  return cues;
}

export const SWITCHING_ATTENTION_CONFIG: PhaseConfig = {
  phase: 'switching',
  duration: 5 * MINUTE,
  instructions: [
    {
      phase: 'switching',
      text: 'Now you will switch your attention rapidly between different sounds.',
      timing: 0,
      duration: 5000,
    },
    {
      phase: 'switching',
      text: 'Listen carefully for the instruction to switch.',
      timing: 6000,
      duration: 4000,
    },
    {
      phase: 'switching',
      text: 'Switching will become faster. Stay alert.',
      timing: 120000, // 2 minutes
      duration: 4000,
    },
    {
      phase: 'switching',
      text: 'Continue switching quickly between sounds.',
      timing: 240000, // 4 minutes
      duration: 4000,
    },
  ],
};

/**
 * PHASE 3: DIVIDED ATTENTION (2 minutes)
 * User attempts to absorb ALL sounds simultaneously
 * This is the most cognitively demanding phase
 */
export const DIVIDED_ATTENTION_CONFIG: PhaseConfig = {
  phase: 'divided',
  duration: 2 * MINUTE,
  instructions: [
    {
      phase: 'divided',
      text: 'Now, try to absorb all sounds at the same time.',
      timing: 0,
      duration: 5000,
    },
    {
      phase: 'divided',
      text: 'Expand your awareness to encompass every sound simultaneously.',
      timing: 7000,
      duration: 5000,
    },
    {
      phase: 'divided',
      text: 'Do not focus on any single sound. Take in everything at once.',
      timing: 60000, // 1 minute
      duration: 5000,
    },
    {
      phase: 'divided',
      text: 'How many sounds can you hear at the same time?',
      timing: 90000, // 1.5 minutes
      duration: 5000,
    },
  ],
};

/**
 * Get initial target sound for selective attention phase
 */
export function getSelectiveAttentionTarget(): string {
  // Start with clock-tick as it's a clear, distinct sound
  return 'clock-tick';
}

/**
 * Protocol summary for reference
 */
export const PROTOCOL_SUMMARY = {
  totalDuration: 12 * MINUTE,
  phases: [
    {
      name: 'Selective Attention',
      duration: 5 * MINUTE,
      description: 'Focus on one sound, ignore all others',
    },
    {
      name: 'Rapid Attention Switching',
      duration: 5 * MINUTE,
      description: 'Switch attention between sounds at decreasing intervals (10s → 5s → 3s)',
    },
    {
      name: 'Divided Attention',
      duration: 2 * MINUTE,
      description: 'Absorb all sounds simultaneously',
    },
  ],
  totalSounds: SOUND_SOURCES.length,
};
