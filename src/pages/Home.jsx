import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  MessageCircle, Heart, Music, Target, 
  Award, Sparkles, ArrowRight, Zap, Brain,
  Shield, TrendingUp, Users, Rocket
} from "lucide-react";
import AIGreeting from "../components/wellness/AIGreeting";

export default function Home() {
  const [user, setUser] = useState(null);

  const { data: moodEntries } = useQuery({
    queryKey: ['recentMoods'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.MoodEntry.filter({ user_email: user.email }, '-created_date', 7);
    },
    initialData: [],
  });

  const { data: goals } = useQuery({
    queryKey: ['activeGoals'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Goal.filter({ user_email: user.email, completed: false }, '-created_date', 5);
    },
    initialData: [],
  });

  const { data: badges } = useQuery({
    queryKey: ['badges'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Badge.filter({ user_email: user.email }, '-earned_date');
    },
    initialData: [],
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  const features = [
    {
      title: "AI-Powered Support",
      description: "Get personalized wellness guidance 24/7 from your AI companion",
      icon: Brain,
      gradient: "from-orange-500 to-amber-500"
    },
    {
      title: "Mood Tracking",
      description: "Track and understand your emotional patterns with intelligent insights",
      icon: Heart,
      gradient: "from-pink-500 to-rose-500"
    },
    {
      title: "Wellness Games",
      description: "Scientifically-designed games to reduce stress and improve mental health",
      icon: Zap,
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      title: "Music Therapy",
      description: "Curated soundscapes and playlists for every mood and moment",
      icon: Music,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Goal Achievement",
      description: "Set and track wellness goals with AI-generated personalized tasks",
      icon: Target,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Emergency Support",
      description: "Instant access to crisis resources and calming exercises when you need them",
      icon: Shield,
      gradient: "from-red-500 to-orange-500"
    }
  ];

  const stats = [
    { label: "Active Users", value: "10K+", icon: Users },
    { label: "Wellness Score Avg", value: user?.wellness_score || "75", icon: TrendingUp },
    { label: "Lives Improved", value: "50K+", icon: Sparkles },
    { label: "Daily Check-ins", value: "25K+", icon: Rocket }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <AIGreeting user={user} />
        </div>
      </div>



      {/* Why Use Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Use <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">MindMitra</span>?
          </h2>
          <p className="text-xl text-gray-400">Powerful features designed for your mental wellness</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={idx}
                className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 group overflow-hidden"
              >
                <div className={`h-1 bg-gradient-to-r ${feature.gradient}`} />
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Access Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Start Your <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Wellness Journey</span>
          </h2>
          <p className="text-xl text-gray-400">Choose your path to better mental health</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link to={createPageUrl("Chat")}>
            <Card className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 border-orange-500/30 backdrop-blur-sm hover:from-orange-500/30 hover:to-amber-500/30 transition-all duration-300 group cursor-pointer">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Talk to AI Companion</h3>
                    <p className="text-gray-300">Get instant support and guidance</p>
                  </div>
                  <MessageCircle className="w-12 h-12 text-orange-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex items-center text-orange-400 font-semibold">
                  Start Conversation
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("Games")}>
            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 backdrop-blur-sm hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 group cursor-pointer">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Play Wellness Games</h3>
                    <p className="text-gray-300">Relax with mindful activities</p>
                  </div>
                  <Zap className="w-12 h-12 text-purple-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex items-center text-purple-400 font-semibold">
                  Start Playing
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* User Progress Section */}
      {(goals.length > 0 || badges.length > 0) && (
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Your Progress</h2>
                <p className="text-gray-400">Keep up the great work!</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  {user?.wellness_score || 50}
                </div>
                <p className="text-gray-400 text-sm mt-1">Wellness Score</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {goals.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-400" />
                    Active Goals
                  </h3>
                  <div className="space-y-3">
                    {goals.slice(0, 3).map((goal) => (
                      <div key={goal.id} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                        <p className="font-medium text-white">{goal.title}</p>
                        <p className="text-sm text-gray-400 mt-1 capitalize">{goal.category}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {badges.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-orange-400" />
                    Recent Achievements
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {badges.slice(0, 6).map((badge) => (
                      <div 
                        key={badge.id}
                        className="p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30 text-center"
                      >
                        <div className="text-3xl mb-2">🏆</div>
                        <p className="text-xs text-white font-medium">{badge.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}