import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function BreathingExercise({ duration = 4 }) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale');
  const [count, setCount] = useState(duration);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount <= 1) {
            // Move to next phase
            if (phase === 'inhale') {
              setPhase('hold1');
              return duration;
            } else if (phase === 'hold1') {
              setPhase('exhale');
              return duration;
            } else if (phase === 'exhale') {
              setPhase('hold2');
              return duration;
            } else {
              setPhase('inhale');
              setCycles(prev => prev + 1);
              return duration;
            }
          }
          return prevCount - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, phase, duration]);

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCount(duration);
    setCycles(0);
  };

  const phaseText = {
    inhale: 'Breathe In',
    hold1: 'Hold',
    exhale: 'Breathe Out',
    hold2: 'Hold'
  };

  const phaseColor = {
    inhale: 'from-blue-400 to-cyan-400',
    hold1: 'from-purple-400 to-pink-400',
    exhale: 'from-green-400 to-teal-400',
    hold2: 'from-orange-400 to-yellow-400'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-64 h-64 mb-8">
        <div 
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${phaseColor[phase]} transition-all duration-1000 ${
            isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-50'
          }`}
          style={{
            transform: isActive ? `scale(${phase === 'inhale' ? 1.2 : phase === 'exhale' ? 0.8 : 1})` : 'scale(0.75)'
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-white text-3xl font-bold mb-2">{phaseText[phase]}</p>
          <p className="text-white text-6xl font-bold">{count}</p>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-gray-600 text-sm mb-1">Breathing Cycles Completed</p>
        <p className="text-2xl font-bold text-purple-600">{cycles}</p>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => setIsActive(!isActive)}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Start
            </>
          )}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          size="lg"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}