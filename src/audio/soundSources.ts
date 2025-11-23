import { SoundSource } from '@/types';

/**
 * Sound sources for ATT protocol
 * Following Wells' protocol: mix of internal, near, and far sounds
 *
 * NOTE: Replace audio paths with actual audio files
 * For production, use:
 * - High-quality recordings (44.1kHz, 16-bit minimum)
 * - Loopable audio files
 * - Normalize volume levels
 */

export const SOUND_SOURCES: SoundSource[] = [
  // INTERNAL SOUNDS
  {
    id: 'breath',
    name: 'Breathing',
    audioPath: '/sounds/breath.mp3',
    position: { pan: 0, distance: 0 }, // centered, very close
    distance: 'internal',
    description: 'Simulated breathing sound',
  },
  {
    id: 'heartbeat',
    name: 'Heartbeat',
    audioPath: '/sounds/heartbeat.mp3',
    position: { pan: -0.1, distance: 0.1 },
    distance: 'internal',
    description: 'Simulated heartbeat',
  },
  {
    id: 'white-noise',
    name: 'White Noise',
    audioPath: '/sounds/white-noise.mp3',
    position: { pan: 0.1, distance: 0.15 },
    distance: 'internal',
    description: 'Gentle white noise',
  },

  // NEAR SOUNDS
  {
    id: 'clock-tick',
    name: 'Clock Ticking',
    audioPath: '/sounds/clock-tick.mp3',
    position: { pan: -0.6, distance: 0.4 },
    distance: 'near',
    description: 'Clock ticking to the left',
  },
  {
    id: 'water-drip',
    name: 'Water Dripping',
    audioPath: '/sounds/water-drip.mp3',
    position: { pan: 0.7, distance: 0.45 },
    distance: 'near',
    description: 'Water dripping to the right',
  },
  {
    id: 'fan-hum',
    name: 'Fan Humming',
    audioPath: '/sounds/fan-hum.mp3',
    position: { pan: 0.3, distance: 0.5 },
    distance: 'near',
    description: 'Fan humming slightly to the right',
  },

  // FAR SOUNDS
  {
    id: 'bird-distant',
    name: 'Distant Birds',
    audioPath: '/sounds/bird-distant.mp3',
    position: { pan: -0.8, distance: 0.8 },
    distance: 'far',
    description: 'Birds chirping in the distance',
  },
  {
    id: 'traffic-distant',
    name: 'Distant Traffic',
    audioPath: '/sounds/traffic-distant.mp3',
    position: { pan: 0.5, distance: 0.85 },
    distance: 'far',
    description: 'Faint traffic noise',
  },
  {
    id: 'wind-distant',
    name: 'Distant Wind',
    audioPath: '/sounds/wind-distant.mp3',
    position: { pan: -0.4, distance: 0.9 },
    distance: 'far',
    description: 'Wind blowing in the distance',
  },
];

/**
 * Get sound sources by distance category
 */
export function getSoundsByDistance(distance: 'internal' | 'near' | 'far'): SoundSource[] {
  return SOUND_SOURCES.filter(s => s.distance === distance);
}

/**
 * Get a random sound source
 */
export function getRandomSound(): SoundSource {
  return SOUND_SOURCES[Math.floor(Math.random() * SOUND_SOURCES.length)];
}

/**
 * Get a random sound excluding specific IDs
 */
export function getRandomSoundExcluding(excludeIds: string[]): SoundSource {
  const available = SOUND_SOURCES.filter(s => !excludeIds.includes(s.id));
  if (available.length === 0) return SOUND_SOURCES[0];
  return available[Math.floor(Math.random() * available.length)];
}
