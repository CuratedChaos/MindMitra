
import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Loader2, Sparkles } from "lucide-react";
import AvatarDisplay from "../components/wellness/AvatarDisplay";

export default function Chat() {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  const { data: messages } = useQuery({
    queryKey: ['chatMessages'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.ChatMessage.filter({ user_email: user.email }, 'created_date');
    },
    initialData: [],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ userMessage, aiResponse }) => {
      const user = await base44.auth.me();
      await base44.entities.ChatMessage.create({
        user_email: user.email,
        message: userMessage,
        sender: 'user'
      });
      await base44.entities.ChatMessage.create({
        user_email: user.email,
        message: aiResponse,
        sender: 'assistant'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
    },
  });

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setIsTyping(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a compassionate, empathetic AI wellness companion named Serenity. 
        You provide emotional support, mindfulness guidance, and mental health resources.
        You are warm, understanding, and never judgmental. You ask thoughtful follow-up questions.
        You validate emotions and provide gentle encouragement.
        Keep responses conversational and supportive (2-4 sentences max unless asked for more detail).
        
        User message: ${userMessage}`,
      });

      await sendMessageMutation.mutateAsync({
        userMessage,
        aiResponse: response
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setIsTyping(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <AvatarDisplay style={user?.avatar_style || 'neutral'} size="medium" />
          <div>
            <h1 className="text-2xl font-bold text-white">AI Companion</h1>
            <p className="text-gray-400">I'm here to listen and support you</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <Card className="p-8 text-center bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg">
              <Sparkles className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Welcome! How are you feeling today?
              </h2>
              <p className="text-gray-400 mb-6">
                I'm here to listen without judgment. Share anything on your mind.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "I'm feeling anxious",
                  "I need someone to talk to",
                  "Help me relax",
                  "I want to improve my mood"
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    onClick={() => setMessage(suggestion)}
                    className="bg-gray-700/50 text-white border-gray-600 hover:bg-gray-600"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </Card>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white'
                    : 'bg-gray-800 border border-gray-700 shadow-md text-white'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.message}</p>
                <p className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-orange-100' : 'text-gray-500'}`}>
                  {new Date(msg.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-800 border border-gray-700 shadow-md p-4 rounded-2xl">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 p-6">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Share what's on your mind..."
            className="resize-none bg-gray-700 text-white border-gray-600"
            rows={3}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isTyping}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            size="lg"
          >
            {isTyping ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
