import { Task } from "@/types/Task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Search } from "lucide-react";
import { format } from "date-fns";

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterCategory: string;
  onCategoryChange: (category: string) => void;
  filterPriority: string;
  onPriorityChange: (priority: string) => void;
  filterStatus: string;
  onStatusChange: (status: string) => void;
}

export const TaskList = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
  searchTerm,
  onSearchChange,
  filterCategory,
  onCategoryChange,
  filterPriority,
  onPriorityChange,
  filterStatus,
  onStatusChange
}: TaskListProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Assignment': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Exam': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Study': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Personal': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOverdue = (deadlineString: string, completed: boolean) => {
    return new Date(deadlineString) < new Date() && !completed;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterCategory} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Assignment">Assignment</SelectItem>
                <SelectItem value="Exam">Exam</SelectItem>
                <SelectItem value="Study">Study</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={onPriorityChange}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardContent className="flex items-center justify-center p-8">
              <p className="text-gray-500">No tasks found. Create your first task!</p>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card 
              key={task.id} 
              className={`bg-white/70 backdrop-blur-sm transition-all duration-200 hover:shadow-lg ${
                task.completed ? 'opacity-75' : ''
              } ${isOverdue(task.deadline, task.completed) ? 'border-red-300 bg-red-50/50' : ''}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(checked) => 
                        onUpdateTask(task.id, { completed: !!checked })
                      }
                      className="mt-1"
                    />
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </h3>
                        {isOverdue(task.deadline, task.completed) && (
                          <Badge variant="destructive" className="text-xs">Overdue</Badge>
                        )}
                      </div>
                      
                      <p className={`text-gray-600 text-sm ${task.completed ? 'line-through' : ''}`}>
                        {task.description}
                      </p>
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-500">Due:</span>
                        <span className={`font-medium ${isOverdue(task.deadline, task.completed) ? 'text-red-600' : ''}`}>
                          {format(new Date(task.deadline), "MMM dd, yyyy")}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getCategoryColor(task.category)}>
                          {task.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-500 hover:text-red-600"
                      onClick={() => onDeleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
