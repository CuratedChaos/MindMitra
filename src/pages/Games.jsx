
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Sparkles, Brain, Heart, Palette, Music as MusicIcon } from "lucide-react";
import MemoryGame from "../components/games/MemoryGame";
import BreathingGame from "../components/games/BreathingGame";
import ColorMatchGame from "../components/games/ColorMatchGame";
import ZenDrawing from "../components/games/ZenDrawing";

export default function Games() {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: 'memory',
      title: 'Memory Match',
      description: 'Find matching pairs to train your memory',
      icon: Brain,
      color: 'from-purple-400 to-pink-400',
      component: MemoryGame,
      benefits: 'Improves focus and cognitive function'
    },
    {
      id: 'breathing',
      title: 'Breathing Rhythm',
      description: 'Follow the rhythm to calm your mind',
      icon: Heart,
      color: 'from-blue-400 to-cyan-400',
      component: BreathingGame,
      benefits: 'Reduces stress and anxiety'
    },
    {
      id: 'colors',
      title: 'Color Harmony',
      description: 'Match colors to find inner peace',
      icon: Palette,
      color: 'from-green-400 to-teal-400',
      component: ColorMatchGame,
      benefits: 'Enhances mood and creativity'
    },
    {
      id: 'zen',
      title: 'Zen Drawing',
      description: 'Create beautiful patterns mindfully',
      icon: MusicIcon,
      color: 'from-orange-400 to-yellow-400',
      component: ZenDrawing,
      benefits: 'Promotes mindfulness and relaxation'
    }
  ];

  const selectedGameData = games.find(g => g.id === selectedGame);
  const GameComponent = selectedGameData?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Gamepad2 className="w-10 h-10 text-orange-400" />
            Wellness Games
          </h1>
          <p className="text-gray-400">Play, relax, and boost your mood</p>
        </div>

        {!selectedGame ? (
          <>
            <Card className="border-none shadow-lg bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      Why Play Wellness Games?
                    </h3>
                    <p className="text-gray-400 text-sm">
                      These games are designed to reduce stress, improve focus, and boost your mood. 
                      Each game offers unique mental health benefits while being fun and engaging. 
                      Take 5-10 minutes to play and feel the difference!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {games.map((game) => {
                const Icon = game.icon;
                return (
                  <Card
                    key={game.id}
                    className="border-none shadow-lg bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group overflow-hidden"
                    onClick={() => setSelectedGame(game.id)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${game.color}`} />
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2 flex items-center gap-2 text-white">
                            {game.title}
                            <Icon className="w-6 h-6 text-orange-400" />
                          </CardTitle>
                          <p className="text-gray-400">{game.description}</p>
                        </div>
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 bg-gray-700/50 rounded-xl">
                          <p className="text-sm text-gray-300">
                            <strong className="text-orange-400">Benefits:</strong> {game.benefits}
                          </p>
                        </div>
                        <Button
                          className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90 text-white`}
                          size="lg"
                        >
                          <Gamepad2 className="w-5 h-5 mr-2" />
                          Play Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="border-none shadow-lg bg-gradient-to-br from-orange-900/20 to-amber-900/20 border-orange-700/30">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    🎮 Gaming for Mental Health
                  </h3>
                  <p className="text-gray-300 max-w-3xl mx-auto">
                    Research shows that mindful gaming can reduce cortisol levels, improve cognitive function, 
                    and enhance overall well-being. These games are specifically designed to promote relaxation 
                    and positive mental states.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div>
            <Button
              variant="outline"
              onClick={() => setSelectedGame(null)}
              className="mb-4 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              ← Back to Games
            </Button>

            <Card className="border-none shadow-lg bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <selectedGameData.icon className="w-6 h-6 text-orange-400" />
                  {selectedGameData.title}
                </CardTitle>
                <p className="text-gray-400 text-sm">{selectedGameData.description}</p>
              </CardHeader>
              <CardContent>
                {GameComponent && <GameComponent />}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
