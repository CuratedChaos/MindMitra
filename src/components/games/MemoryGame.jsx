import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy } from 'lucide-react';

const emojis = ['😊', '🌟', '💜', '🌈', '🦋', '🌸', '🎨', '✨'];

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, matched: false }));
    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].emoji === cards[second].emoji) {
        const newMatched = [...matched, first, second];
        setMatched(newMatched);
        setFlipped([]);
        
        if (newMatched.length === cards.length) {
          setGameWon(true);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <p className="text-sm text-gray-600 mb-1">Moves</p>
          <p className="text-3xl font-bold text-purple-600">{moves}</p>
        </div>
        <Button
          onClick={initializeGame}
          variant="outline"
          size="lg"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          New Game
        </Button>
      </div>

      {gameWon && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-200 text-center">
          <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Congratulations! 🎉
          </h3>
          <p className="text-gray-700">
            You completed the game in {moves} moves!
          </p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          const isMatched = matched.includes(index);
          
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              disabled={isMatched}
              className={`aspect-square rounded-xl text-4xl flex items-center justify-center transition-all duration-300 ${
                isFlipped
                  ? isMatched
                    ? 'bg-gradient-to-br from-green-400 to-teal-400 scale-95'
                    : 'bg-gradient-to-br from-purple-400 to-pink-400'
                  : 'bg-gradient-to-br from-gray-200 to-gray-300 hover:scale-105'
              }`}
            >
              {isFlipped ? card.emoji : '?'}
            </button>
          );
        })}
      </div>

      <div className="p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-gray-700 text-center">
          💡 <strong>Tip:</strong> Focus on remembering card positions to improve your memory and concentration
        </p>
      </div>
    </div>
  );
}