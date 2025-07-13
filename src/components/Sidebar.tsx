
import { useState } from 'react';
import { 
  Home, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Settings, 
  Brain,
  Bot,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  currentView: 'dashboard' | 'tasks' | 'calendar' | 'analytics' | 'settings';
  onViewChange: (view: 'dashboard' | 'tasks' | 'calendar' | 'analytics' | 'settings') => void;
}

export const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const aiMenuItems = [
    { id: 'model-development', label: 'AI Model', icon: Brain, href: '/model-development' },
    { id: 'training', label: 'AI Training', icon: Bot, href: '/training' },
  ];

  const handleNavigation = (href: string) => {
    window.location.href = href;
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-black border-r border-red-900/20 transition-all duration-300`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && <h2 className="text-xl font-bold text-red-500">StudyFlow</h2>}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-red-400 hover:text-red-300"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as any)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} p-3 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-red-900/30 text-red-400'
                    : 'text-red-200 hover:bg-red-900/20 hover:text-red-300'
                }`}
              >
                <Icon size={20} />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </button>
            );
          })}
          
          <div className="pt-4 border-t border-red-900/20">
            {!isCollapsed && <p className="text-red-400 text-sm font-medium mb-2 px-3">AI Features</p>}
            
            {aiMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} p-3 rounded-lg transition-colors text-red-200 hover:bg-red-900/20 hover:text-red-300`}
                >
                  <Icon size={20} />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};
