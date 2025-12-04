import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, Heart, Wind, Music, BookOpen, 
  AlertCircle, ExternalLink, Shield
} from "lucide-react";
import BreathingExercise from "../Components/wellness/BreathingExercise";

export default function Emergency() {
  const [activeTab, setActiveTab] = useState('crisis');

  const crisisLines = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support",
      icon: Phone
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "24/7 text support",
      icon: Phone
    },
    {
      name: "SAMHSA National Helpline",
      number: "1-800-662-4357",
      description: "Mental health & substance abuse",
      icon: Phone
    }
  ];

  const groundingTechniques = [
    {
      title: "5-4-3-2-1 Technique",
      description: "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste"
    },
    {
      title: "Ice Cube Hold",
      description: "Hold an ice cube in your hand. Focus on the sensation and how it changes"
    },
    {
      title: "Progressive Muscle Relaxation",
      description: "Tense and relax each muscle group, starting from your toes to your head"
    },
    {
      title: "Grounding Statements",
      description: "Say aloud: 'My name is [name]. I am [age]. I am safe. I am here now.'"
    }
  ];

  const calmingActivities = [
    { title: "Listen to calming music", icon: Music },
    { title: "Read a comforting book", icon: BookOpen },
    { title: "Call a trusted friend", icon: Phone },
    { title: "Take a warm shower", icon: Heart },
    { title: "Go for a gentle walk", icon: Wind }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-red-800 mb-2">
                  If you're in immediate danger
                </h2>
                <p className="text-red-700 mb-4">
                  Please call 911 or go to your nearest emergency room right away.
                </p>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Phone className="w-4 h-4 mr-2" />
                  Call 911
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Heart className="w-10 h-10 text-purple-600" />
            Emergency Toolkit
          </h1>
          <p className="text-gray-600">You're not alone. Help is available.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-white/80">
            <TabsTrigger value="crisis">Crisis Lines</TabsTrigger>
            <TabsTrigger value="breathing">Breathing</TabsTrigger>
            <TabsTrigger value="grounding">Grounding</TabsTrigger>
          </TabsList>

          <TabsContent value="crisis" className="space-y-4">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-purple-600" />
                  Crisis Support Lines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {crisisLines.map((line) => {
                  const Icon = line.icon;
                  return (
                    <div
                      key={line.name}
                      className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-purple-700" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{line.name}</h3>
                          <p className="text-2xl font-bold text-purple-600 mb-1">{line.number}</p>
                          <p className="text-gray-600 text-sm">{line.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <h3 className="font-semibold text-gray-800 mb-3">International Resources</h3>
                  <Button variant="outline" className="w-full" asChild>
                    <a
                      href="https://findahelpline.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Find Helplines Worldwide
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breathing">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-purple-600" />
                  Breathing Exercise
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  Follow the circle. Breathe slowly and deeply.
                </p>
              </CardHeader>
              <CardContent>
                <BreathingExercise duration={4} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grounding" className="space-y-4">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-600" />
                  Grounding Techniques
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  These exercises help bring you back to the present moment
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {groundingTechniques.map((technique, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100"
                  >
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold">
                        {idx + 1}
                      </span>
                      {technique.title}
                    </h3>
                    <p className="text-gray-700 ml-10">{technique.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Calming Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {calmingActivities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={activity.title}
                        className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 flex items-center gap-3"
                      >
                        <Icon className="w-6 h-6 text-blue-600" />
                        <span className="font-medium text-gray-800">{activity.title}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="border-none shadow-lg bg-gradient-to-br from-purple-100 to-pink-100">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Remember: This will pass
            </h3>
            <p className="text-gray-700 max-w-2xl mx-auto">
              You're taking an important step by being here. These feelings are temporary,
              and reaching out for help is a sign of strength, not weakness.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}