import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Volume2, Loader2, Sparkles, Mic, MicOff, Music, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AvatarDisplay from './AvatarDisplay';

export default function AIGreeting({ user }) {
  const [greeting, setGreeting] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userMessage, setUserMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentMusic, setCurrentMusic] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    generateGreeting();
    initializeSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const musicPlaylists = {
    calm: {
      title: "Calming Relaxation",
      youtubeUrl: "https://www.youtube.com/embed/lTRiuFIWV54?autoplay=1",
      description: "Peaceful melodies for stress relief"
    },
    sleep: {
      title: "Sleep Deeply",
      youtubeUrl: "https://www.youtube.com/embed/t0kfn-U6JHQ?autoplay=1",
      description: "Gentle music for restful sleep"
    },
    focus: {
      title: "Deep Focus",
      youtubeUrl: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1",
      description: "Lo-fi beats for concentration"
    },
    energize: {
      title: "Morning Energy",
      youtubeUrl: "https://www.youtube.com/embed/ZbZSe6N_BXs?autoplay=1",
      description: "Uplifting music to boost your mood"
    },
    meditation: {
      title: "Meditation Music",
      youtubeUrl: "https://www.youtube.com/embed/cyq_D6TkyUA?autoplay=1",
      description: "Zen music for mindfulness"
    },
    nature: {
      title: "Nature Sounds",
      youtubeUrl: "https://www.youtube.com/embed/eKFTSSKCzWA?autoplay=1",
      description: "Rain, ocean waves, and forest ambience"
    }
  };

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(interimTranscript || finalTranscript);

        if (finalTranscript) {
          setUserMessage(finalTranscript.trim());
          setIsListening(false);
          setTimeout(() => {
            handleSendMessage(finalTranscript.trim());
          }, 500);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setTranscript('');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  const generateGreeting = async () => {
    setIsLoading(true);
    try {
      const hour = new Date().getHours();
      const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Serenity, a warm and compassionate AI wellness companion. 
        Greet ${user?.full_name?.split(' ')[0] || 'friend'} with a personalized, caring ${timeOfDay} greeting.
        Their wellness score is ${user?.wellness_score || 50}/100 and they have a ${user?.streak_days || 0} day streak.
        Be encouraging, warm, and ask how they're feeling today.
        Keep it to 2-3 sentences max. Be conversational and friendly.`
      });

      setGreeting(response);
      setConversation([{ sender: 'ai', message: response }]);
      speakText(response);
    } catch (error) {
      console.error("Error generating greeting:", error);
      const fallbackGreeting = `Hello ${user?.full_name?.split(' ')[0] || 'friend'}! 👋 Welcome back to your wellness journey. How are you feeling today?`;
      setGreeting(fallbackGreeting);
      setConversation([{ sender: 'ai', message: fallbackGreeting }]);
      speakText(fallbackGreeting);
    }
    setIsLoading(false);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[👋😊🌟💪🌱💙🔥🏆✨💜❤️😌🙏🎵🎶]/g, '');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0; // Natural speed
      utterance.pitch = 1.0; // Natural pitch
      utterance.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      
      // Prioritize "Natural" voices for the most human-like experience
      const preferredVoice = voices.find(voice => 
        (voice.name.includes('Natural') && voice.lang.includes('en')) || // Edge/Windows Natural voices (Best)
        (voice.name.includes('Google US English') && !voice.name.includes('Male')) || // Google's high quality voices
        voice.name.includes('Samantha') || // Mac default
        (voice.name.includes('Female') && voice.lang.includes('en')) // Fallback
      );

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const playMusic = (musicType) => {
    const music = musicPlaylists[musicType] || musicPlaylists.calm;
    setCurrentMusic(music);
  };

  const handleSendMessage = async (messageText = userMessage) => {
    if (!messageText?.trim() || isSending) return;

    const message = messageText.trim();
    setUserMessage('');
    setTranscript('');
    setConversation((prev) => [...prev, { sender: 'user', message }]);
    setIsSending(true);

    try {
      // First, check if user wants music
      const musicIntent = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze if the user wants to listen to music or sounds.
        User said: "${message}"
        
        If they want music, determine what type based on their message:
        - "calm", "relax", "chill", "stress" → calm
        - "sleep", "tired", "rest" → sleep
        - "focus", "study", "work", "concentrate" → focus
        - "energy", "energize", "upbeat", "workout" → energize
        - "meditate", "meditation", "mindfulness" → meditation
        - "nature", "rain", "ocean", "forest" → nature
        
        Return JSON with: wants_music (boolean), music_type (string or null), confidence (low/medium/high)`,
        response_json_schema: {
          type: "object",
          properties: {
            wants_music: { type: "boolean" },
            music_type: { type: "string" },
            confidence: { type: "string" }
          }
        }
      });

      let aiResponse;

      if (musicIntent.wants_music && musicIntent.confidence !== 'low') {
        // Play the music
        playMusic(musicIntent.music_type);

        aiResponse = await base44.integrations.Core.InvokeLLM({
          prompt: `You are Serenity. The user asked for music and you're now playing ${musicIntent.music_type} music for them.
          Respond warmly, confirming you're playing the music and briefly explain how it will help them.
          Keep it to 1-2 sentences. Be encouraging and supportive.`
        });
      } else {
        // Regular conversation
        aiResponse = await base44.integrations.Core.InvokeLLM({
          prompt: `You are Serenity, a compassionate AI wellness companion having a voice conversation.
          The user ${user?.full_name?.split(' ')[0] || 'friend'} just said: "${message}"
          
          Respond with warmth, empathy, and encouragement. Provide helpful suggestions if appropriate.
          You can suggest playing calming music, meditation sounds, or other wellness activities available in the app.
          Keep it natural and conversational (2-3 sentences) as this will be spoken out loud.
          If they express distress, gently remind them of the Emergency Kit available in the app.
          Use a warm, friendly tone as if talking to a friend who needs support.`
        });
      }

      setConversation((prev) => [...prev, { sender: 'ai', message: aiResponse }]);
      speakText(aiResponse);

    } catch (error) {
      console.error("Error sending message:", error);
      const fallbackResponse = "I'm here for you. Would you like to try one of the wellness exercises or talk more about how you're feeling?";
      setConversation((prev) => [...prev, { sender: 'ai', message: fallbackResponse }]);
      speakText(fallbackResponse);
    }
    setIsSending(false);
  };

  const quickResponses = [
  "I'm feeling anxious",
  "Play calming music",
  "Help me focus",
  "I'm doing great!"];


  const supportsSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  return (
    <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-2" />
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          {/* Music Player */}
          {currentMusic &&
          <div className="relative bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200">
              <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMusic(null)}
              className="absolute top-2 right-2 z-10">

                <X className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{currentMusic.title}</h4>
                  <p className="text-sm text-gray-600">{currentMusic.description}</p>
                </div>
              </div>
              <div className="aspect-video rounded-xl overflow-hidden">
                <iframe
                width="100%"
                height="100%"
                src={currentMusic.youtubeUrl}
                title={currentMusic.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen />

              </div>
            </div>
          }

          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center justify-center md:w-1/3">
              <div className="relative">
                <AvatarDisplay
                  style={user?.avatar_style || 'neutral'}
                  size="large" />

                {(isSpeaking || isListening) &&
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                    {isSpeaking ?
                  <Volume2 className="w-4 h-4 text-white" /> :

                  <Mic className="w-4 h-4 text-white" />
                  }
                  </div>
                }
              </div>
              
              <div className="text-red-500 mt-4 flex gap-2">
                {supportsSpeechRecognition &&
                <Button
                  variant={isListening ? "default" : "outline"}
                  size="sm"
                  onClick={isListening ? stopListening : startListening}
                  disabled={isSending || isSpeaking}
                  className={isListening ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 animate-pulse" : ""}>

                    {isListening ?
                  <>
                        <MicOff className="w-4 h-4 mr-2" />
                        Stop
                      </> :

                  <>
                        <Mic className="w-4 h-4 mr-2" />
                        Speak
                      </>
                  }
                  </Button>
                }
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speakText(conversation[conversation.length - 1]?.message || greeting)}
                  disabled={isSpeaking || isLoading || isListening}>

                  <Volume2 className={`w-4 h-4 mr-2 ${isSpeaking ? 'animate-pulse' : ''}`} />
                  {isSpeaking ? 'Speaking' : 'Repeat'}
                </Button>
              </div>
              
              {isListening &&
              <div className="mt-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    <span className="text-sm font-medium">Listening...</span>
                  </div>
                  {transcript &&
                <p className="text-xs text-gray-600 mt-2 italic">"{transcript}"</p>
                }
                </div>
              }
            </div>

            {/* Conversation Section */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-800">Your AI Companion</h3>
                </div>
                {supportsSpeechRecognition &&
                <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Mic className="w-3 h-3" />
                    Voice enabled
                  </span>
                }
              </div>

              {/* Messages */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {isLoading ?
                <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Preparing your greeting...</span>
                  </div> :

                conversation.map((msg, idx) =>
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>

                      <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.sender === 'user' ?
                    'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                    'bg-gradient-to-r from-purple-50 to-pink-50 text-gray-800 border border-purple-100'}`
                    }>

                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                )
                }
                {isSending &&
                <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-2xl border border-purple-100">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                }
              </div>

              {/* Quick Responses */}
              {conversation.length === 1 && !isListening &&
              <div className="flex flex-wrap gap-2">
                  {quickResponses.map((response) =>
                <Button
                  key={response}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUserMessage(response);
                    setTimeout(() => handleSendMessage(response), 100);
                  }} className="bg-slate-300 px-3 text-xs font-medium rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input shadow-sm hover:text-accent-foreground h-8 hover:bg-purple-50">


                      {response}
                    </Button>
                )}
                </div>
              }

              {/* Input */}
              <div className="flex gap-2 mt-4">
                <Textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={isListening ? "Listening to your voice..." : "Type or speak to chat..."}
                  className="resize-none bg-white"
                  rows={2}
                  disabled={isListening} />

                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!userMessage.trim() || isSending || isListening}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">

                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>);

}