'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AudioEngine } from '@/audio/AudioEngine';
import { SessionManager, SessionEvent } from '@/session/SessionManager';
import { SOUND_SOURCES } from '@/audio/soundSources';
import FixationPoint from '@/components/FixationPoint';
import InstructionDisplay from '@/components/InstructionDisplay';
import ProgressIndicator from '@/components/ProgressIndicator';
import { AttentionPhase } from '@/types';
import { getCurrentSession } from '@/utils/storage';

const TOTAL_DURATION = 12 * 60 * 1000; // 12 minutes

export default function SessionPage() {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<AttentionPhase>('selective');
  const [currentInstruction, setCurrentInstruction] = useState<string>('');
  const [instructionDuration, setInstructionDuration] = useState<number>(5000);
  const [elapsed, setElapsed] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const [currentSound, setCurrentSound] = useState<string>('');

  const audioEngineRef = useRef<AudioEngine | null>(null);
  const sessionManagerRef = useRef<SessionManager | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if there's a current session
    const session = getCurrentSession();
    if (!session) {
      router.push('/');
      return;
    }

    // Initialize audio engine and session manager
    const audioEngine = new AudioEngine();
    const sessionManager = new SessionManager(audioEngine);

    audioEngineRef.current = audioEngine;
    sessionManagerRef.current = sessionManager;

    // Handle session events
    sessionManager.onEvent((event: SessionEvent) => {
      handleSessionEvent(event);
    });

    return () => {
      // Cleanup on unmount
      if (timerRef.current) clearInterval(timerRef.current);
      sessionManager.stop();
      audioEngine.dispose();
    };
  }, [router]);

  const handleSessionEvent = (event: SessionEvent) => {
    switch (event.type) {
      case 'phase-start':
        setCurrentPhase(event.phase);
        if (event.data?.targetSound) {
          const sound = SOUND_SOURCES.find(s => s.id === event.data.targetSound);
          setCurrentSound(sound?.name || '');
        }
        break;

      case 'instruction':
        setCurrentInstruction(event.data.text);
        setInstructionDuration(event.data.duration || 5000);
        break;

      case 'switch-sound':
        setCurrentSound(event.data.soundName);
        setCurrentInstruction(`Focus on: ${event.data.soundName}`);
        setInstructionDuration(2000);
        break;

      case 'session-complete':
        router.push('/rating/post');
        break;
    }
  };

  const startSession = async () => {
    if (!audioEngineRef.current || !sessionManagerRef.current) return;

    try {
      // Initialize audio engine
      await audioEngineRef.current.initialize(SOUND_SOURCES);

      setIsInitialized(true);

      // Start session
      await sessionManagerRef.current.start();
      setIsRunning(true);

      // Start timer for progress updates
      timerRef.current = setInterval(() => {
        if (sessionManagerRef.current) {
          setElapsed(sessionManagerRef.current.getElapsedTime());
          setPhaseElapsed(sessionManagerRef.current.getPhaseElapsedTime());
        }
      }, 100);
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Error starting audio. Please check your audio settings and try again.');
    }
  };

  const handleInstructionComplete = () => {
    setCurrentInstruction('');
  };

  // Show initialization screen
  if (!isRunning) {
    return (
      <main className="min-h-screen bg-att-dark flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Begin
          </h2>

          <div className="space-y-4 text-gray-700 mb-8">
            <p>
              Before starting, please ensure:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>You are in a quiet environment</li>
              <li>Your headphones/speakers are connected</li>
              <li>You will not be disturbed for 12 minutes</li>
              <li>Your volume is at a comfortable level</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
              <p className="text-sm">
                <strong>Important:</strong> Keep your eyes fixed on the central
                fixation point throughout the entire exercise. Do not look away.
              </p>
            </div>
          </div>

          <button
            onClick={startSession}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start ATT Session
          </button>
        </div>
      </main>
    );
  }

  // Session running
  return (
    <main className="min-h-screen bg-att-dark relative overflow-hidden no-select">
      {/* Fixation point */}
      <FixationPoint size={12} />

      {/* Instruction overlay */}
      {currentInstruction && (
        <InstructionDisplay
          text={currentInstruction}
          duration={instructionDuration}
          onComplete={handleInstructionComplete}
        />
      )}

      {/* Progress indicator */}
      <ProgressIndicator
        phase={currentPhase}
        elapsed={elapsed}
        total={TOTAL_DURATION}
        currentSound={currentSound}
      />
    </main>
  );
}
