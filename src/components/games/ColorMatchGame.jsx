import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy } from 'lucide-react';

const colors = [
  { name: 'Sunset Orange', hex: '#FF6B6B', rgb: [255, 107, 107] },
  { name: 'Ocean Blue', hex: '#4ECDC4', rgb: [78, 205, 196] },
  { name: 'Forest Green', hex: '#95E1D3', rgb: [149, 225, 211] },
  { name: 'Lavender Dream', hex: '#C7CEEA', rgb: [199, 206, 234] },
  { name: 'Golden Hour', hex: '#FFE66D', rgb: [255, 230, 109] },
  { name: 'Rose Petal', hex: '#FF87AB', rgb: [255, 135, 171] }
];

export default function ColorMatchGame() {
  const [targetColor, setTargetColor] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    generateRound();
  }, []);

  const generateRound = () => {
    const target = colors[Math.floor(Math.random() * colors.length)];
    const wrongColors = colors.filter(c => c.name !== target.name);
    const shuffledOptions = [
      target,
      wrongColors[Math.floor(Math.random() * wrongColors.length)],
      wrongColors[Math.floor(Math.random() * wrongColors.length)]
    ].sort(() => Math.random() - 0.5);

    setTargetColor(target);
    setOptions(shuffledOptions);
    setFeedback('');
  };

  const handleChoice = (selectedColor) => {
    if (selectedColor.name === targetColor.name) {
      setScore(score + 10);
      setStreak(streak + 1);
      setFeedback('Perfect! 🌟');
      setTimeout(generateRound, 1000);
    } else {
      setStreak(0);
      setFeedback('Try again! 💙');
      setTimeout(() => setFeedback(''), 1500);
    }
  };

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    generateRound();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Score</p>
            <p className="text-3xl font-bold text-purple-600">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Streak</p>
            <p className="text-3xl font-bold text-blue-600">{streak}</p>
          </div>
        </div>
        <Button onClick={resetGame} variant="outline">
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </Button>
      </div>

      {targetColor && (
        <>
          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <p className="text-lg text-gray-700 mb-4">Find this color:</p>
            <div className="inline-block p-6 bg-white rounded-xl shadow-md">
              <p className="text-2xl font-bold text-gray-800">{targetColor.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {options.map((color, index) => (
              <button
                key={index}
                onClick={() => handleChoice(color)}
                className="aspect-square rounded-2xl transition-all duration-300 hover:scale-110 shadow-lg border-4 border-white"
                style={{ backgroundColor: color.hex }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold drop-shadow-lg">
                    {color.name.split(' ')[0]}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`text-center p-4 rounded-xl ${
              feedback.includes('Perfect') 
                ? 'bg-gradient-to-r from-green-100 to-teal-100' 
                : 'bg-gradient-to-r from-blue-100 to-cyan-100'
            }`}>
              <p className="text-2xl font-bold text-gray-800">{feedback}</p>
            </div>
          )}
        </>
      )}

      <div className="p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-gray-700 text-center">
          💡 <strong>Tip:</strong> Colors can influence your mood. This game helps you appreciate color harmony!
        </p>
      </div>
    </div>
  );
}