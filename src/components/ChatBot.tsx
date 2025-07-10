
import { useState } from "react";
import { X, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  provider?: string;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatBot = ({ isOpen, onClose }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI study assistant powered by advanced AI. I can help you manage your tasks, create personalized study schedules, provide productivity tips, and support your academic goals. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      }));

      console.log('Sending message to AI:', currentInput);

      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          message: currentInput,
          conversationHistory: conversationHistory
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }

      if (!data || !data.response) {
        throw new Error('Invalid response from AI service');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isBot: true,
        timestamp: new Date(),
        provider: data.provider
      };

      setMessages(prev => [...prev, botMessage]);

      // Show which AI provider was used
      if (data.provider) {
        console.log(`Response from: ${data.provider}`);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      let errorMessage = "I'm having trouble connecting right now. Please try again in a moment.";
      
      if (error?.message?.includes('rate limit') || error?.message?.includes('429')) {
        errorMessage = "AI service is currently busy. Please try again in a moment.";
      } else if (error?.message?.includes('unavailable') || error?.message?.includes('503')) {
        errorMessage = "AI services are temporarily unavailable. Please try again later.";
      } else if (error?.message?.includes('API key') || error?.message?.includes('configuration')) {
        errorMessage = "AI service configuration issue. Please contact support if this persists.";
      }
      
      toast({
        title: "AI Response Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Add a helpful fallback message
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `${errorMessage} In the meantime, here's a quick study tip: Breaking down large tasks into smaller, manageable steps is always a great strategy for productivity!`,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className={cn(
      "fixed inset-y-0 right-0 z-50 w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6" />
          <h3 className="font-semibold">AI Study Assistant</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100vh-140px)]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex flex-col",
              message.isBot ? "items-start" : "items-end"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                message.isBot
                  ? "bg-gray-100 text-gray-800"
                  : "bg-blue-500 text-white"
              )}
            >
              {message.text}
            </div>
            {message.provider && (
              <div className="text-xs text-gray-500 mt-1 px-1">
                via {message.provider}
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-600">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your studies..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button onClick={handleSendMessage} size="icon" disabled={isTyping || !inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
