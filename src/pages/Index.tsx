
import { useState } from "react";
import { TaskDashboard } from "@/components/TaskDashboard";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { TaskCalendar } from "@/components/TaskCalendar";
import { TaskAnalytics } from "@/components/TaskAnalytics";
import { Settings } from "@/components/Settings";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useTasks } from "@/hooks/useTasks";

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'tasks' | 'calendar' | 'analytics' | 'settings'>('dashboard');
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || task.category === filterCategory;
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'All' || 
                         (filterStatus === 'Completed' && task.completed) ||
                         (filterStatus === 'Pending' && !task.completed);
    
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const renderCurrentView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading tasks...</div>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <TaskDashboard tasks={tasks} onAddTask={() => setCurrentView('tasks')} />;
      case 'tasks':
        return (
          <div className="space-y-6">
            <TaskForm onSubmit={addTask} />
            <TaskList 
              tasks={filteredTasks}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterCategory={filterCategory}
              onCategoryChange={setFilterCategory}
              filterPriority={filterPriority}
              onPriorityChange={setFilterPriority}
              filterStatus={filterStatus}
              onStatusChange={setFilterStatus}
            />
          </div>
        );
      case 'calendar':
        return <TaskCalendar tasks={tasks} onAddTask={addTask} />;
      case 'analytics':
        return <TaskAnalytics tasks={tasks} />;
      case 'settings':
        return <Settings />;
      default:
        return <TaskDashboard tasks={tasks} onAddTask={() => setCurrentView('tasks')} />;
    }
  };

  return (
    <ProtectedRoute>
      <div 
        className="min-h-screen relative"
        style={{
          backgroundImage: `url('/lovable-uploads/69b7411a-07f4-4583-9f98-f770319ecf48.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
        <div className="relative z-10 flex">
          <Sidebar currentView={currentView} onViewChange={setCurrentView} />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6">
              {renderCurrentView()}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Index;
