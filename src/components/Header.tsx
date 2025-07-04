
import { Bell, Search, User, MessageCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ChatBot } from "./ChatBot";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <header className="bg-gray-dark/95 backdrop-blur-sm border-b-2 border-gray-600 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold tracking-tight text-red-primary">
              StudyFlow
            </h1>
            <div className="w-1 h-8 bg-red-secondary rounded-full"></div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-primary/60 h-4 w-4" />
              <Input 
                placeholder="Search tasks..." 
                className="pl-10 w-64 bg-gray-darker border-2 border-gray-600 focus:border-red-primary rounded-xl h-10 text-red-primary placeholder:text-red-primary/60"
              />
            </div>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsChatOpen(true)}
              className="relative hover:bg-red-primary/10 text-red-primary rounded-xl h-10 w-10"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-red-primary/10 text-red-primary rounded-xl h-10 w-10"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                3
              </span>
            </Button>
            
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-red-primary/10 text-red-primary rounded-xl h-10 w-10"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-gray-dark border-2 border-gray-600 rounded-xl shadow-lg"
              >
                <DropdownMenuItem className="hover:bg-red-primary/10 font-medium text-red-primary">
                  <User className="mr-2 h-4 w-4" />
                  <span className="font-semibold">{user?.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleSignOut} 
                  className="hover:bg-red-primary/10 text-red-primary hover:text-red-primary font-semibold"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="font-bold">Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};
