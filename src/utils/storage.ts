import { SessionData, SelfAttentionRating, AttentionRating } from '@/types';

const STORAGE_KEY = 'att_sessions';
const CURRENT_SESSION_KEY = 'att_current_session';

/**
 * Storage utilities for ATT session data
 * Uses localStorage for persistence
 */

/**
 * Save session data to localStorage
 */
export function saveSession(session: SessionData): void {
  try {
    const sessions = getAllSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);

    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

/**
 * Get all sessions from localStorage
 */
export function getAllSessions(): SessionData[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading sessions:', error);
    return [];
  }
}

/**
 * Get a specific session by ID
 */
export function getSession(id: string): SessionData | null {
  const sessions = getAllSessions();
  return sessions.find(s => s.id === id) || null;
}

/**
 * Get the most recent session
 */
export function getLatestSession(): SessionData | null {
  const sessions = getAllSessions();
  if (sessions.length === 0) return null;

  return sessions.reduce((latest, current) => {
    return current.startTime > latest.startTime ? current : latest;
  });
}

/**
 * Get completed sessions
 */
export function getCompletedSessions(): SessionData[] {
  return getAllSessions().filter(s => s.completed);
}

/**
 * Save current session to temporary storage
 */
export function saveCurrentSession(session: SessionData): void {
  try {
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving current session:', error);
  }
}

/**
 * Get current session from temporary storage
 */
export function getCurrentSession(): SessionData | null {
  try {
    const data = localStorage.getItem(CURRENT_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading current session:', error);
    return null;
  }
}

/**
 * Clear current session from temporary storage
 */
export function clearCurrentSession(): void {
  try {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  } catch (error) {
    console.error('Error clearing current session:', error);
  }
}

/**
 * Delete a session
 */
export function deleteSession(id: string): void {
  try {
    const sessions = getAllSessions().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error deleting session:', error);
  }
}

/**
 * Clear all sessions
 */
export function clearAllSessions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing all sessions:', error);
  }
}

/**
 * Calculate statistics from completed sessions
 */
export function calculateSessionStats(): {
  totalSessions: number;
  averagePreRating: number;
  averagePostRating: number;
  averageChange: number;
  improvementRate: number;
} {
  const completed = getCompletedSessions();

  if (completed.length === 0) {
    return {
      totalSessions: 0,
      averagePreRating: 0,
      averagePostRating: 0,
      averageChange: 0,
      improvementRate: 0,
    };
  }

  const preRatings = completed.map(s => s.preRating.value);
  const postRatings = completed
    .filter(s => s.postRating)
    .map(s => s.postRating!.value);

  const avgPre = preRatings.reduce((sum, val) => sum + val, 0) / preRatings.length;
  const avgPost = postRatings.reduce((sum, val) => sum + val, 0) / postRatings.length;
  const avgChange = avgPost - avgPre;

  const improved = completed.filter(s =>
    s.postRating && s.postRating.value > s.preRating.value
  ).length;
  const improvementRate = (improved / completed.length) * 100;

  return {
    totalSessions: completed.length,
    averagePreRating: Math.round(avgPre * 10) / 10,
    averagePostRating: Math.round(avgPost * 10) / 10,
    averageChange: Math.round(avgChange * 10) / 10,
    improvementRate: Math.round(improvementRate),
  };
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new session object
 */
export function createSession(preRating: SelfAttentionRating): SessionData {
  return {
    id: generateSessionId(),
    startTime: Date.now(),
    preRating: {
      value: preRating,
      timestamp: Date.now(),
    },
    completed: false,
  };
}

/**
 * Complete a session with post-rating
 */
export function completeSession(
  sessionId: string,
  postRating: SelfAttentionRating
): SessionData | null {
  const session = getSession(sessionId);
  if (!session) return null;

  const completed: SessionData = {
    ...session,
    endTime: Date.now(),
    postRating: {
      value: postRating,
      timestamp: Date.now(),
    },
    completed: true,
  };

  saveSession(completed);
  return completed;
}
