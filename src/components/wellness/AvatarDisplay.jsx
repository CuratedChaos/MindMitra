import React from 'react';
import { Sparkles, Heart, Smile, Meh, Frown, Zap, Bot } from 'lucide-react';

const avatarStyles = {
  calm: {
    icon: Heart,
    gradient: 'from-blue-400 to-cyan-400',
    animation: 'breathing-animation',
    label: 'Calm & Peaceful'
  },
  cheerful: {
    icon: Smile,
    gradient: 'from-yellow-400 to-orange-400',
    animation: 'animate-bounce',
    label: 'Cheerful & Happy'
  },
  neutral: {
    icon: Meh,
    gradient: 'from-purple-400 to-pink-400',
    animation: '',
    label: 'Neutral & Balanced'
  },
  peaceful: {
    icon: Sparkles,
    gradient: 'from-green-400 to-teal-400',
    animation: 'animate-pulse',
    label: 'Peaceful & Serene'
  },
  energetic: {
    icon: Zap,
    gradient: 'from-red-400 to-pink-400',
    animation: 'animate-spin',
    label: 'Energetic & Active'
  },
  robot: {
    icon: Bot,
    gradient: 'from-orange-500 to-amber-500',
    animation: 'animate-bounce',
    label: 'AI Companion'
  }
};

export default function AvatarDisplay({ style = 'neutral', size = 'large', showLabel = false, isSpeaking = false }) {
  const avatar = avatarStyles[style] || avatarStyles.robot;
  const Icon = avatar.icon;
  
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-32 h-32',
    xlarge: 'w-48 h-48'
  };

  const iconSizes = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${avatar.gradient} flex items-center justify-center wellness-glow ${isSpeaking ? 'animate-pulse scale-110 transition-transform duration-300' : avatar.animation}`}>
        <Icon className={`${iconSizes[size]} text-white ${isSpeaking ? 'animate-bounce' : ''}`} />
      </div>
      {showLabel && (
        <p className="text-sm font-medium text-gray-600">{avatar.label}</p>
      )}
    </div>
  );
}