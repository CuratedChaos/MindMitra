
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target, Plus, CheckCircle, Clock, Trophy, 
  Sparkles, Calendar, Award
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function Goals() {
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Goal.filter({ user_email: user.email }, '-created_date');
    },
    initialData: [],
  });

  const completeGoalMutation = useMutation({
    mutationFn: async (goalId) => {
      await base44.entities.Goal.update(goalId, {
        completed: true,
        completed_date: new Date().toISOString()
      });
      
      // Award badge for milestones
      const completedGoals = goals.filter(g => g.completed).length + 1;
      if ([1, 5, 10, 25, 50].includes(completedGoals)) {
        const user = await base44.auth.me();
        await base44.entities.Badge.create({
          user_email: user.email,
          name: `${completedGoals} Goals Completed`,
          description: `Completed ${completedGoals} wellness goals`,
          category: 'goals',
          earned_date: new Date().toISOString()
        });
      }
      
      // Update wellness score
      const user = await base44.auth.me();
      const newScore = Math.min(100, (user.wellness_score || 50) + 5);
      await base44.auth.updateMe({ wellness_score: newScore });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const generateGoalsMutation = useMutation({
    mutationFn: async () => {
      const user = await base44.auth.me();
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 5 personalized wellness goals for someone working on mental health.
        Include a mix of mindfulness, physical activity, social connection, and self-care.
        Return as JSON array with: title (concise, actionable), description (1 sentence), 
        category (mindfulness/physical/social/sleep/nutrition/learning/creativity), 
        difficulty (easy/medium/hard), points (10-50 based on difficulty).`,
        response_json_schema: {
          type: "object",
          properties: {
            goals: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  category: { type: "string" },
                  difficulty: { type: "string" },
                  points: { type: "number" }
                }
              }
            }
          }
        }
      });

      for (const goal of response.goals) {
        await base44.entities.Goal.create({
          ...goal,
          user_email: user.email,
          completed: false
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const categories = ['all', 'mindfulness', 'physical', 'social', 'sleep', 'nutrition', 'learning', 'creativity'];
  
  const filteredGoals = selectedCategory === 'all' 
    ? goals 
    : goals.filter(g => g.category === selectedCategory);

  const activeGoals = filteredGoals.filter(g => !g.completed);
  const completedGoals = filteredGoals.filter(g => g.completed);
  const totalPoints = goals.filter(g => g.completed).reduce((sum, g) => sum + (g.points || 0), 0);

  const categoryColors = {
    mindfulness: 'from-purple-400 to-pink-400',
    physical: 'from-green-400 to-teal-400',
    social: 'from-blue-400 to-cyan-400',
    sleep: 'from-indigo-400 to-purple-400',
    nutrition: 'from-orange-400 to-yellow-400',
    learning: 'from-pink-400 to-red-400',
    creativity: 'from-yellow-400 to-orange-400'
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    hard: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Target className="w-10 h-10 text-orange-400" />
            Wellness Goals
          </h1>
          <p className="text-gray-400">Small steps lead to big transformations</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-none shadow-lg bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6 text-center">
              <Trophy className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white mb-1">{totalPoints}</p>
              <p className="text-gray-400 text-sm">Total Points Earned</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white mb-1">{completedGoals.length}</p>
              <p className="text-gray-400 text-sm">Goals Completed</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6 text-center">
              <Clock className="w-10 h-10 text-blue-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white mb-1">{activeGoals.length}</p>
              <p className="text-gray-400 text-sm">Active Goals</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-lg bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-white">Your Goals</CardTitle>
                <p className="text-sm text-gray-400 mt-1">
                  Filter by category or generate AI-curated goals
                </p>
              </div>
              <Button
                onClick={() => generateGoalsMutation.mutate()}
                disabled={generateGoalsMutation.isPending}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {generateGoalsMutation.isPending ? 'Generating...' : 'Generate Goals'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-transform capitalize"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>

            {activeGoals.length === 0 && completedGoals.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No goals yet. Generate some to get started!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {activeGoals.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      Active Goals ({activeGoals.length})
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <AnimatePresence>
                        {activeGoals.map((goal) => (
                          <motion.div
                            key={goal.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                          >
                            <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group bg-gray-700/50 border-gray-600">
                              <div className={`h-1 bg-gradient-to-r ${categoryColors[goal.category] || 'from-gray-400 to-gray-500'}`} />
                              <CardContent className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className="font-semibold text-white flex-1">{goal.title}</h4>
                                  <Badge className={`${difficultyColors[goal.difficulty]} border ml-2`}>
                                    {goal.difficulty}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-300 mb-4">{goal.description}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <Badge variant="secondary" className="capitalize">
                                      {goal.category}
                                    </Badge>
                                    <span className="font-bold text-orange-400">{goal.points} pts</span>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => completeGoalMutation.mutate(goal.id)}
                                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Complete
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {completedGoals.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-500" />
                      Completed Goals ({completedGoals.length})
                    </h3>
                    <div className="space-y-3">
                      {completedGoals.map((goal) => (
                        <div
                          key={goal.id}
                          className="p-4 bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-xl border border-green-700/50 opacity-75"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-white line-through">{goal.title}</p>
                                <p className="text-sm text-gray-400">
                                  Completed {format(new Date(goal.completed_date), 'MMM d, yyyy')}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-green-400">+{goal.points} pts</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
