import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function BreathingGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState('ready');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(4);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          // Move to next phase
          if (phase === 'inhale') {
            setPhase('hold1');
            return 4;
          } else if (phase === 'hold1') {
            setPhase('exhale');
            return 4;
          } else if (phase === 'exhale') {
            setPhase('hold2');
            return 4;
          } else {
            setPhase('inhale');
            setCycles(prev => prev + 1);
            setScore(prev => prev + 10);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, phase]);

  const handleStart = () => {
    setIsPlaying(true);
    setPhase('inhale');
    setTimer(4);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPhase('ready');
    setTimer(4);
    setScore(0);
    setCycles(0);
  };

  const phaseColors = {
    ready: 'from-gray-400 to-gray-500',
    inhale: 'from-blue-400 to-cyan-400',
    hold1: 'from-purple-400 to-pink-400',
    exhale: 'from-green-400 to-teal-400',
    hold2: 'from-orange-400 to-yellow-400'
  };

  const phaseText = {
    ready: 'Ready to Begin',
    inhale: 'Breathe In',
    hold1: 'Hold',
    exhale: 'Breathe Out',
    hold2: 'Hold'
  };

  const getCircleSize = () => {
    if (phase === 'inhale') return 'scale-150';
    if (phase === 'exhale') return 'scale-75';
    return 'scale-100';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">Score</p>
          <p className="text-3xl font-bold text-purple-600">{score}</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">Cycles</p>
          <p className="text-3xl font-bold text-blue-600">{cycles}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative w-64 h-64 mb-8">
          <div 
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${phaseColors[phase]} transition-all duration-1000 ${getCircleSize()}`}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-white text-2xl font-bold mb-2">{phaseText[phase]}</p>
            {isPlaying && <p className="text-white text-5xl font-bold">{timer}</p>}
          </div>
        </div>

        <div className="flex gap-3">
          {!isPlaying ? (
            <Button
              onClick={handleStart}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Play className="w-5 h-5 mr-2" />
              Start
            </Button>
          ) : (
            <Button
              onClick={() => setIsPlaying(false)}
              size="lg"
              variant="outline"
            >
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </Button>
          )}
          <Button
            onClick={handleReset}
            size="lg"
            variant="outline"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-gray-700 text-center">
          💡 <strong>How to play:</strong> Follow the breathing rhythm. Complete cycles to earn points and calm your mind!
        </p>
      </div>
    </div>
  );
}