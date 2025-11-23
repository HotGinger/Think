import { SelfAttentionRating } from '@/types';

/**
 * Formatting utilities for display
 */

/**
 * Format time in MM:SS format
 */
export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format rating value with sign
 */
export function formatRating(rating: SelfAttentionRating): string {
  if (rating > 0) return `+${rating}`;
  return rating.toString();
}

/**
 * Get rating label
 */
export function getRatingLabel(rating: SelfAttentionRating): string {
  const labels: Record<SelfAttentionRating, string> = {
    '-3': 'Extremely Self-Focused',
    '-2': 'Very Self-Focused',
    '-1': 'Somewhat Self-Focused',
    '0': 'Balanced',
    '1': 'Somewhat Externally Focused',
    '2': 'Very Externally Focused',
    '3': 'Extremely Externally Focused',
  };
  return labels[rating];
}

/**
 * Get rating color (for UI)
 */
export function getRatingColor(rating: SelfAttentionRating): string {
  if (rating < 0) return 'text-red-500';
  if (rating > 0) return 'text-green-500';
  return 'text-gray-500';
}

/**
 * Format change in rating
 */
export function formatRatingChange(pre: SelfAttentionRating, post: SelfAttentionRating): {
  change: number;
  text: string;
  color: string;
} {
  const change = post - pre;
  let text = '';
  let color = '';

  if (change > 0) {
    text = `Improved by ${change} point${change !== 1 ? 's' : ''}`;
    color = 'text-green-600';
  } else if (change < 0) {
    text = `Decreased by ${Math.abs(change)} point${change !== -1 ? 's' : ''}`;
    color = 'text-red-600';
  } else {
    text = 'No change';
    color = 'text-gray-600';
  }

  return { change, text, color };
}

/**
 * Format phase name for display
 */
export function formatPhaseName(phase: string): string {
  const names: Record<string, string> = {
    'selective': 'Selective Attention',
    'switching': 'Rapid Attention Switching',
    'divided': 'Divided Attention',
  };
  return names[phase] || phase;
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(elapsed: number, total: number): number {
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}
