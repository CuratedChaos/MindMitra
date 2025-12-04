import React from 'react';
import { Smile, Meh, Frown, Heart, Zap, Cloud, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const moodOptions = [
  { value: 'very_happy', label: 'Very Happy', icon: Smile, color: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200', emoji: '😊' },
  { value: 'happy', label: 'Happy', icon: Smile, color: 'bg-green-100 text-green-600 hover:bg-green-200', emoji: '🙂' },
  { value: 'calm', label: 'Calm', icon: Heart, color: 'bg-blue-100 text-blue-600 hover:bg-blue-200', emoji: '😌' },
  { value: 'neutral', label: 'Neutral', icon: Meh, color: 'bg-gray-100 text-gray-600 hover:bg-gray-200', emoji: '😐' },
  { value: 'tired', label: 'Tired', icon: Cloud, color: 'bg-purple-100 text-purple-600 hover:bg-purple-200', emoji: '😴' },
  { value: 'anxious', label: 'Anxious', icon: AlertCircle, color: 'bg-orange-100 text-orange-600 hover:bg-orange-200', emoji: '😰' },
  { value: 'stressed', label: 'Stressed', icon: Zap, color: 'bg-red-100 text-red-600 hover:bg-red-200', emoji: '😣' },
  { value: 'sad', label: 'Sad', icon: Frown, color: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200', emoji: '😔' },
  { value: 'very_sad', label: 'Very Sad', icon: Frown, color: 'bg-slate-100 text-slate-600 hover:bg-slate-200', emoji: '😢' },
  { value: 'energetic', label: 'Energetic', icon: Zap, color: 'bg-pink-100 text-pink-600 hover:bg-pink-200', emoji: '⚡' }
];

export default function MoodSelector({ selected, onSelect, variant = 'grid' }) {
  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-2">
        {moodOptions.map((mood) => (
          <Button
            key={mood.value}
            variant={selected === mood.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelect(mood.value)}
            className={`${selected === mood.value ? mood.color : ''} transition-all duration-200`}
          >
            <span className="text-lg mr-1">{mood.emoji}</span>
            {mood.label}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {moodOptions.map((mood) => {
        const Icon = mood.icon;
        return (
          <button
            key={mood.value}
            onClick={() => onSelect(mood.value)}
            className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
              selected === mood.value
                ? `${mood.color} border-current scale-105 shadow-lg`
                : 'bg-white border-gray-200 hover:border-gray-300 hover:scale-102'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">{mood.emoji}</span>
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{mood.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}