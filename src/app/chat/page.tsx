"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { toast } from "sonner";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export default function ChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setIsLoading(false);
    
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: `Hello ${user.name}! 👋 I'm your AI mental health companion. I'm here to provide support, coping strategies, and a safe space to talk about how you're feeling. 

How are you doing today? What would you like to talk about?`,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  }, [user, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: `typing_${Date.now()}`,
      role: 'assistant',
      content: "Typing...",
      timestamp: new Date(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await fetch('https://oi-server.onrender.com/chat/completions', {
        method: 'POST',
        headers: {
          'customerId': 'deltav1331@gmail.com',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer xxx'
        },
        body: JSON.stringify({
          model: 'openrouter/anthropic/claude-sonnet-4',
          messages: [
            {
              role: 'system',
              content: `You are a compassionate AI mental health companion integrated into MindCare, a mental health management platform. Your role is to provide supportive, empathetic, and helpful responses to users seeking mental health support.

Key Guidelines:
- Always be warm, empathetic, and non-judgmental
- Provide practical coping strategies and techniques
- Encourage users to seek professional help when appropriate
- Never provide medical diagnoses or replace professional treatment
- Focus on evidence-based mental health support techniques
- Be mindful of crisis situations and provide appropriate resources
- Encourage self-care and healthy habits
- Validate users' feelings and experiences
- Provide hope and encouragement
- Keep responses conversational and supportive, not clinical

Crisis Detection: If a user expresses suicidal thoughts or immediate danger, provide crisis resources:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- Emergency: 911

User Context: The user's name is ${user?.name}. They are using a mental health tracking app and may be dealing with various mental health challenges. Be supportive and encouraging while maintaining appropriate boundaries.`
            },
            {
              role: 'user',
              content: userMessage.content
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "I'm sorry, I couldn't process that right now. Please try again.";

      // Remove typing indicator and add AI response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        }];
      });

    } catch (error) {
      console.error('Chat error:', error);
      
      // Remove typing indicator and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: `error_${Date.now()}`,
          role: 'assistant',
          content: "I'm experiencing some technical difficulties right now. Please try again in a moment. If you're in crisis, please contact the National Suicide Prevention Lifeline at 988.",
          timestamp: new Date()
        }];
      });

      toast.error("Sorry, I couldn't respond right now. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    "I'm feeling anxious today",
    "Help me with coping strategies",
    "I'm having trouble sleeping",
    "I feel overwhelmed",
    "I need motivation",
    "How can I manage stress?"
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MindCare
              </h1>
            </Link>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              🤖 AI Support Chat
            </Badge>
          </div>
          
          <Link href="/dashboard">
            <Button variant="outline">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-4 h-[calc(100vh-5rem)] flex flex-col">
        {/* Chat Area */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center">
              <span className="text-2xl mr-2">🤖</span>
              AI Mental Health Support
            </CardTitle>
            <CardDescription>
              Your compassionate AI companion is here to provide support, coping strategies, and a safe space to talk.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 py-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border shadow-sm'
                      }`}
                    >
                      {message.isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full" style={{animationDelay: '0.1s'}}></div>
                          <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Prompts */}
            {messages.length <= 1 && (
              <div className="px-6 py-4 border-t bg-gray-50">
                <p className="text-sm text-gray-600 mb-3">Quick start suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickPrompt(prompt)}
                      className="text-xs"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-6 border-t bg-white">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message... (Press Enter to send)"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isTyping}
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                >
                  {isTyping ? "Sending..." : "Send"}
                </Button>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                💡 I can help with coping strategies, stress management, and emotional support. For crises, contact 988.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Crisis Support Banner */}
        <Card className="mt-4 border-red-200 bg-red-50">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-red-600">🆘</span>
                <p className="text-sm text-red-700">
                  <strong>Crisis Support:</strong> If you're in immediate danger, call 911. 
                  For mental health crisis: National Lifeline 988 • Crisis Text: HOME to 741741
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
                Get Help Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}