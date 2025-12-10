import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Play, Heart, Brain, Moon, Zap, Volume2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MusicTherapy() {
  const [activeCategory, setActiveCategory] = useState('calm');

  const playlists = {
    calm: [
      {
        title: "Deep Relaxation",
        description: "Slow, peaceful melodies for stress relief",
        duration: "45 min",
        tracks: 12,
        youtubeUrl: "https://www.youtube.com/watch?v=lTRiuFIWV54",
        color: "from-blue-400 to-cyan-400"
      },
      {
        title: "Nature Sounds",
        description: "Rain, ocean waves, and forest ambience",
        duration: "60 min",
        tracks: 8,
        youtubeUrl: "https://www.youtube.com/watch?v=eKFTSSKCzWA",
        color: "from-green-400 to-teal-400"
      },
      {
        title: "Meditation Music",
        description: "Zen music for mindfulness practice",
        duration: "30 min",
        tracks: 10,
        youtubeUrl: "https://www.youtube.com/watch?v=cyq_D6TkyUA",
        color: "from-purple-400 to-indigo-400"
      }
    ],
    sleep: [
      {
        title: "Sleep Deeply",
        description: "Gentle lullabies and delta waves",
        duration: "2 hours",
        tracks: 15,
        youtubeUrl: "https://www.youtube.com/watch?v=t0kfn-U6JHQ",
        color: "from-indigo-400 to-purple-400"
      },
      {
        title: "Night Rain",
        description: "Peaceful rainfall for restful sleep",
        duration: "8 hours",
        tracks: 1,
        youtubeUrl: "https://www.youtube.com/watch?v=nDq6TstdEi8",
        color: "from-slate-400 to-gray-400"
      }
    ],
    focus: [
      {
        title: "Deep Focus",
        description: "Lo-fi beats for concentration",
        duration: "90 min",
        tracks: 25,
        youtubeUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
        color: "from-orange-400 to-red-400"
      },
      {
        title: "Study Music",
        description: "Classical music for productivity",
        duration: "2 hours",
        tracks: 18,
        youtubeUrl: "https://www.youtube.com/watch?v=EKkzbbLYPuI",
        color: "from-yellow-400 to-orange-400"
      }
    ],
    energize: [
      {
        title: "Morning Energy",
        description: "Uplifting tunes to start your day",
        duration: "45 min",
        tracks: 20,
        youtubeUrl: "https://www.youtube.com/watch?v=ZbZSe6N_BXs",
        color: "from-pink-400 to-red-400"
      },
      {
        title: "Workout Motivation",
        description: "High-energy beats for exercise",
        duration: "60 min",
        tracks: 22,
        youtubeUrl: "https://www.youtube.com/watch?v=4TYv2PhG89A",
        color: "from-red-400 to-orange-400"
      }
    ]
  };

  const categories = [
    { id: 'calm', label: 'Calm & Relax', icon: Heart, color: 'text-blue-600' },
    { id: 'sleep', label: 'Sleep', icon: Moon, color: 'text-purple-600' },
    { id: 'focus', label: 'Focus', icon: Brain, color: 'text-orange-600' },
    { id: 'energize', label: 'Energize', icon: Zap, color: 'text-pink-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Music className="w-10 h-10 text-purple-600" />
            Music Therapy
          </h1>
          <p className="text-gray-600">Let healing sounds transform your mood</p>
        </div>

        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 scale-105 shadow-lg'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:scale-102'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${category.color}`} />
                    <p className="font-medium text-gray-800 text-sm">{category.label}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists[activeCategory].map((playlist, idx) => (
            <Card
              key={idx}
              className="border-none shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden group"
            >
              <div className={`h-2 bg-gradient-to-r ${playlist.color}`} />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{playlist.title}</CardTitle>
                    <p className="text-gray-600 text-sm">{playlist.description}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${playlist.color} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
                    <Music className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-4 h-4" />
                    {playlist.tracks} tracks
                  </span>
                  <span>•</span>
                  <span>{playlist.duration}</span>
                </div>

                <Button
                  className={`w-full bg-gradient-to-r ${playlist.color} hover:opacity-90 text-white`}
                  size="lg"
                  asChild
                >
                  <a
                    href={playlist.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Listen Now
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-none shadow-lg bg-gradient-to-br from-purple-100 to-pink-100">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <Music className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  💡 Music Therapy Tips
                </h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Use headphones for a more immersive experience</li>
                  <li>• Set aside 15-30 minutes for dedicated listening</li>
                  <li>• Combine with breathing exercises for deeper relaxation</li>
                  <li>• Create a comfortable, distraction-free environment</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}