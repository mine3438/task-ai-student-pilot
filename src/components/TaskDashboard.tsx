
import { Task } from "@/types/Task";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AIInsights } from "@/components/AIInsights";

interface TaskDashboardProps {
  tasks: Task[];
  onAddTask: () => void;
}

export const TaskDashboard = ({ tasks, onAddTask }: TaskDashboardProps) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const overdueTasks = tasks.filter(task => 
    !task.completed && new Date(task.deadline) < new Date()
  ).length;
  const todayTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.deadline);
    return taskDate.toDateString() === today.toDateString() && !task.completed;
  }).length;

  const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const recentTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleAddTaskWrapper = (task?: Omit<Task, 'id' | 'createdAt'>) => {
    if (task) {
      // This would be handled by the parent component
      console.log('Adding AI suggested task:', task);
    }
    onAddTask();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
          <p className="text-gray-600 mt-1">Here's what's happening with your studies today.</p>
        </div>
        <Button onClick={onAddTask} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Tasks</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{tasks.length}</div>
            <p className="text-xs text-blue-600 mt-1">Active tasks in system</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{completedTasks}</div>
            <p className="text-xs text-green-600 mt-1">Tasks finished</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{overdueTasks}</div>
            <p className="text-xs text-red-600 mt-1">Need attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Due Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{todayTasks}</div>
            <p className="text-xs text-purple-600 mt-1">Tasks due today</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights and Progress/Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Progress and Recent Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
                <CardDescription>Your completion rate this week</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Completion Rate</span>
                    <span>{completionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-600 font-medium">{completedTasks}</span>
                    <span className="text-gray-500 ml-1">Completed</span>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">{pendingTasks}</span>
                    <span className="text-gray-500 ml-1">Pending</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Your next deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTasks.length === 0 ? (
                    <p className="text-gray-500 text-sm">No upcoming tasks</p>
                  ) : (
                    recentTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-gray-500">
                            Due: {new Date(task.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* AI Insights */}
        <div>
          <AIInsights tasks={tasks} onAddTask={handleAddTaskWrapper} />
        </div>
      </div>
    </div>
  );
};
