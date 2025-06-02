
import { useState } from "react";
import { TaskDashboard } from "@/components/TaskDashboard";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { TaskCalendar } from "@/components/TaskCalendar";
import { TaskAnalytics } from "@/components/TaskAnalytics";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Task } from "@/types/Task";

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'tasks' | 'calendar' | 'analytics'>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete React Assignment',
      description: 'Build a todo app with TypeScript',
      deadline: new Date('2024-06-10'),
      priority: 'High',
      category: 'Assignment',
      completed: false,
      createdAt: new Date('2024-06-01')
    },
    {
      id: '2',
      title: 'Study for Math Exam',
      description: 'Review chapters 5-8, practice problems',
      deadline: new Date('2024-06-15'),
      priority: 'High',
      category: 'Exam',
      completed: false,
      createdAt: new Date('2024-06-02')
    },
    {
      id: '3',
      title: 'Read History Chapter',
      description: 'Chapter 12: World War II',
      deadline: new Date('2024-06-08'),
      priority: 'Medium',
      category: 'Study',
      completed: true,
      createdAt: new Date('2024-05-28')
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

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
      default:
        return <TaskDashboard tasks={tasks} onAddTask={() => setCurrentView('tasks')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            {renderCurrentView()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
