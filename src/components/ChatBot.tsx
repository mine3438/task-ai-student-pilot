
import { useState } from "react";
import { X, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatBot = ({ isOpen, onClose }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI study assistant. I can help you manage your tasks, suggest study schedules, and provide productivity tips. How can I help you today?",
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
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response (in a real app, this would call an AI API)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('schedule') || input.includes('plan')) {
      return "I can help you create an optimal study schedule! Based on your current tasks, I recommend starting with high-priority items and breaking large tasks into smaller chunks. Would you like me to analyze your current tasks and suggest a schedule?";
    } else if (input.includes('productivity') || input.includes('focus')) {
      return "Here are some productivity tips: 1) Use the Pomodoro technique (25 min focused work + 5 min break), 2) Tackle your hardest tasks when you're most alert, 3) Remove distractions from your workspace. What specific area would you like help with?";
    } else if (input.includes('deadline') || input.includes('overdue')) {
      return "I see you're concerned about deadlines! Let me help you prioritize. Focus on overdue tasks first, then work on items due within the next 3 days. Would you like me to create a priority list for you?";
    } else if (input.includes('motivation') || input.includes('stressed')) {
      return "Remember, every expert was once a beginner! Break down overwhelming tasks into smaller, manageable steps. Celebrate small wins along the way. You've got this! 💪 What specific task is causing you stress?";
    } else {
      return "That's an interesting question! I'm here to help with task management, study planning, productivity tips, and motivation. Feel free to ask me about organizing your schedule, managing deadlines, or improving your study habits.";
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
              "flex",
              message.isBot ? "justify-start" : "justify-end"
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
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
