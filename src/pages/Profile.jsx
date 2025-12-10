import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, Award, Heart, Target, LogOut, 
  Save, Sparkles, Mail, Phone
} from "lucide-react";
import AvatarDisplay from "../components/wellness/AvatarDisplay";
import { format } from "date-fns";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [emergencyContact, setEmergencyContact] = useState('');
  const [selectedAvatarStyle, setSelectedAvatarStyle] = useState('neutral');
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setEmergencyContact(currentUser.emergency_contact || '');
      setSelectedAvatarStyle(currentUser.avatar_style || 'neutral');
    };
    loadUser();
  }, []);

  const { data: badges } = useQuery({
    queryKey: ['allBadges'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Badge.filter({ user_email: user.email }, '-earned_date');
    },
    initialData: [],
  });

  const { data: goals } = useQuery({
    queryKey: ['userGoals'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Goal.filter({ user_email: user.email });
    },
    initialData: [],
  });

  const { data: moodEntries } = useQuery({
    queryKey: ['userMoods'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.MoodEntry.filter({ user_email: user.email });
    },
    initialData: [],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      await base44.auth.updateMe(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      const loadUser = async () => {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      };
      loadUser();
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate({
      emergency_contact: emergencyContact,
      avatar_style: selectedAvatarStyle
    });
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  const avatarStyles = ['calm', 'cheerful', 'neutral', 'peaceful', 'energetic'];
  
  const completedGoals = goals.filter(g => g.completed).length;
  const totalPoints = goals.filter(g => g.completed).reduce((sum, g) => sum + (g.points || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <User className="w-10 h-10 text-purple-600" />
            Your Profile
          </h1>
          <p className="text-gray-600">Manage your wellness journey</p>
        </div>

        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <AvatarDisplay style={user?.avatar_style || 'neutral'} size="xlarge" showLabel />
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{user?.full_name}</h2>
                <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mb-4">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-full">
                    <p className="text-sm text-purple-700 font-medium">
                      🔥 {user?.streak_days || 0} Day Streak
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-100 to-cyan-100 px-6 py-3 rounded-full">
                    <p className="text-sm text-blue-700 font-medium">
                      💪 Wellness Score: {user?.wellness_score || 50}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{moodEntries.length}</p>
              <p className="text-gray-600 text-sm">Mood Entries</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{completedGoals}</p>
              <p className="text-gray-600 text-sm">Goals Completed</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{totalPoints}</p>
              <p className="text-gray-600 text-sm">Total Points</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{badges.length}</p>
              <p className="text-gray-600 text-sm">Badges Earned</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Avatar Style</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">Choose how your companion appears</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {avatarStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedAvatarStyle(style)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                    selectedAvatarStyle === style
                      ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 scale-105 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <AvatarDisplay style={style} size="small" />
                  <p className="text-sm font-medium text-gray-800 mt-2 capitalize">{style}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-purple-600" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">
              Add a trusted person we can suggest contacting during difficult times
            </p>
            <div className="space-y-2">
              <Label htmlFor="emergency">Contact Name or Number</Label>
              <Input
                id="emergency"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="e.g., Mom - (555) 123-4567"
                className="bg-white"
              />
            </div>
          </CardContent>
        </Card>

        {badges.length > 0 && (
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Your Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 text-center"
                  >
                    <div className="text-4xl mb-2">🏆</div>
                    <p className="font-medium text-gray-800 text-sm mb-1">{badge.name}</p>
                    <p className="text-xs text-gray-600">
                      {format(new Date(badge.earned_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={updateProfileMutation.isPending}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            size="lg"
          >
            <Save className="w-5 h-5 mr-2" />
            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="lg"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}