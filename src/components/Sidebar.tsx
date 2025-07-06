
import { BarChart3, Calendar, Home, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentView: 'dashboard' | 'tasks' | 'calendar' | 'analytics' | 'settings';
  onViewChange: (view: 'dashboard' | 'tasks' | 'calendar' | 'analytics' | 'settings') => void;
}

export const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: Plus },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ] as const;

  return (
    <div className="w-64 bg-gray-900 border-r-2 border-red-600/20 h-screen">
      <div className="p-6">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                  currentView === item.id
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-red-400 hover:bg-red-600/10 hover:text-red-300"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="absolute bottom-6 left-6 right-6">
        <button 
          onClick={() => onViewChange('settings')}
          className={cn(
            "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
            currentView === 'settings'
              ? "bg-red-600 text-white shadow-lg"
              : "text-red-400 hover:bg-red-600/10 hover:text-red-300"
          )}
        >
          <Settings className="h-5 w-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};
