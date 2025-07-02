
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
      <header className="bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              StudyFlow
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search tasks..." 
                className="pl-10 w-64 bg-background/70"
              />
            </div>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsChatOpen(true)}
              className="relative hover:bg-accent"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
            
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border border-border">
                <DropdownMenuItem className="hover:bg-accent font-medium">
                  <User className="mr-2 h-4 w-4" />
                  <span className="font-semibold">{user?.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleSignOut} 
                  className="hover:bg-accent text-red-600 hover:text-red-700 font-semibold"
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
