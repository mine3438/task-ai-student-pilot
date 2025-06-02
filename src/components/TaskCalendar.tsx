
import { useState } from "react";
import { Task } from "@/types/Task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface TaskCalendarProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export const TaskCalendar = ({ tasks, onAddTask }: TaskCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(new Date(task.deadline), date));
  };

  const tasksForSelectedDate = getTasksForDate(selectedDate);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Task Calendar</h2>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
          <Plus className="mr-2 h-4 w-4" />
          Quick Add
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {format(currentMonth, "MMMM yyyy")}
              </CardTitle>
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="w-full pointer-events-auto"
              components={{
                Day: ({ date, ...props }) => {
                  const dayTasks = getTasksForDate(date);
                  const hasHighPriority = dayTasks.some(task => task.priority === 'High');
                  const hasOverdue = dayTasks.some(task => 
                    !task.completed && new Date(task.deadline) < new Date()
                  );
                  
                  return (
                    <div className="relative">
                      <button
                        {...props}
                        className={`
                          w-full h-10 text-sm rounded-md hover:bg-gray-100 flex items-center justify-center
                          ${isSameDay(date, selectedDate) ? 'bg-blue-500 text-white' : ''}
                          ${hasOverdue ? 'bg-red-100 text-red-800' : ''}
                          ${hasHighPriority && !hasOverdue ? 'bg-orange-100 text-orange-800' : ''}
                        `}
                      >
                        {format(date, 'd')}
                      </button>
                      {dayTasks.length > 0 && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  );
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Tasks for Selected Date */}
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">
              {format(selectedDate, "MMM dd, yyyy")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasksForSelectedDate.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No tasks for this date
                </p>
              ) : (
                tasksForSelectedDate.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg border ${
                      task.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <h4 className={`font-medium text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </h4>
                    <p className={`text-xs text-gray-600 mt-1 ${task.completed ? 'line-through' : ''}`}>
                      {task.description}
                    </p>
                    <div className="flex items-center space-x-1 mt-2">
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                      <Badge className={`text-xs ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
