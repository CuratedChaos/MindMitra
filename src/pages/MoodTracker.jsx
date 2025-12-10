
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Heart } from "lucide-react";
import MoodSelector from "../components/wellness/MoodSelector";
import { format, subDays } from "date-fns";

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState([5]);
  const [note, setNote] = useState('');
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  const { data: moodEntries } = useQuery({
    queryKey: ['moodEntries'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.MoodEntry.filter({ user_email: user.email }, '-created_date', 30);
    },
    initialData: [],
  });

  const createMoodMutation = useMutation({
    mutationFn: async (moodData) => {
      const user = await base44.auth.me();
      await base44.entities.MoodEntry.create({
        ...moodData,
        user_email: user.email
      });
      
      // Update streak
      const today = format(new Date(), 'yyyy-MM-dd');
      const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
      const recentEntries = await base44.entities.MoodEntry.filter(
        { user_email: user.email },
        '-created_date',
        2
      );
      
      let newStreak = 1;
      if (recentEntries.length > 1) {
        const lastEntryDate = format(new Date(recentEntries[1].created_date), 'yyyy-MM-dd');
        if (lastEntryDate === yesterday) {
          newStreak = (user.streak_days || 0) + 1;
        }
      }
      
      await base44.auth.updateMe({ streak_days: newStreak });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodEntries'] });
      setSelectedMood(null);
      setIntensity([5]);
      setNote('');
      setSelectedTriggers([]);
    },
  });

  const triggers = [
    'Work', 'Relationships', 'Health', 'Sleep', 
    'Exercise', 'Weather', 'Social Media', 'Money',
    'Family', 'School', 'Other'
  ];

  const handleSubmit = () => {
    if (!selectedMood) return;

    createMoodMutation.mutate({
      mood: selectedMood,
      intensity: intensity[0],
      note,
      triggers: selectedTriggers
    });
  };

  const getMoodInsight = () => {
    if (moodEntries.length < 3) return null;
    
    const recentMoods = moodEntries.slice(0, 7);
    const avgIntensity = recentMoods.reduce((sum, entry) => sum + entry.intensity, 0) / recentMoods.length;
    
    if (avgIntensity >= 7) {
      return { text: "You've been feeling great lately! Keep it up! 🌟", color: "bg-green-100 text-green-800" };
    } else if (avgIntensity >= 5) {
      return { text: "Your mood has been stable. Nice work! 💪", color: "bg-blue-100 text-blue-800" };
    } else {
      return { text: "I notice things have been tough. Remember to reach out for support. 💙", color: "bg-purple-100 text-purple-800" };
    }
  };

  const todayLogged = moodEntries.length > 0 && 
    format(new Date(moodEntries[0].created_date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  const insight = getMoodInsight();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Heart className="w-10 h-10 text-orange-400" />
            Mood Tracker
          </h1>
          <p className="text-gray-400">Understanding your emotions is the first step to wellness</p>
        </div>

        {insight && (
          <Card className="border-none shadow-lg bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className={`p-4 rounded-xl ${insight.color}`}>
                <p className="font-medium">{insight.text}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!todayLogged && (
          <Card className="border-none shadow-lg bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">How are you feeling today?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base mb-3 block text-gray-300">Select your mood</Label>
                <MoodSelector selected={selectedMood} onSelect={setSelectedMood} />
              </div>

              {selectedMood && (
                <>
                  <div>
                    <Label className="text-base mb-3 block text-gray-300">
                      Intensity: {intensity[0]}/10
                    </Label>
                    <Slider
                      value={intensity}
                      onValueChange={setIntensity}
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-base mb-3 block text-gray-300">What might have influenced this? (optional)</Label>
                    <div className="flex flex-wrap gap-2">
                      {triggers.map((trigger) => (
                        <Badge
                          key={trigger}
                          variant={selectedTriggers.includes(trigger) ? "default" : "outline"}
                          className="cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => {
                            if (selectedTriggers.includes(trigger)) {
                              setSelectedTriggers(selectedTriggers.filter(t => t !== trigger));
                            } else {
                              setSelectedTriggers([...selectedTriggers, trigger]);
                            }
                          }}
                        >
                          {trigger}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base mb-3 block text-gray-300">Add a note (optional)</Label>
                    <Textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="What's on your mind?"
                      rows={3}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    size="lg"
                  >
                    Log Mood Entry
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {todayLogged && (
          <Card className="border-none shadow-lg bg-gradient-to-br from-green-900/30 to-teal-900/30 border-green-700">
            <CardContent className="p-6 text-center">
              <div className="text-5xl mb-3">✅</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                You've logged your mood today!
              </h3>
              <p className="text-gray-300">
                Great job staying consistent with your wellness journey
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="border-none shadow-lg bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="w-5 h-5 text-orange-400" />
              Recent Mood History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {moodEntries.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No mood entries yet. Start tracking to see your patterns!
              </p>
            ) : (
              <div className="space-y-3">
                {moodEntries.slice(0, 10).map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 bg-gray-700/50 rounded-xl border border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {entry.mood === 'very_happy' ? '😊' :
                           entry.mood === 'happy' ? '🙂' :
                           entry.mood === 'calm' ? '😌' :
                           entry.mood === 'neutral' ? '😐' :
                           entry.mood === 'tired' ? '😴' :
                           entry.mood === 'anxious' ? '😰' :
                           entry.mood === 'stressed' ? '😣' :
                           entry.mood === 'sad' ? '😔' :
                           entry.mood === 'very_sad' ? '😢' : '⚡'}
                        </span>
                        <div>
                          <p className="font-medium text-white capitalize">
                            {entry.mood.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-gray-400">
                            {format(new Date(entry.created_date), 'MMM d, yyyy • h:mm a')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-400">
                          {entry.intensity}/10
                        </p>
                      </div>
                    </div>
                    {entry.note && (
                      <p className="text-sm text-gray-300 mt-2 italic">"{entry.note}"</p>
                    )}
                    {entry.triggers && entry.triggers.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.triggers.map((trigger, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
