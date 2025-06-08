import { useState, useEffect } from 'react';
import { Task } from '@/types/Task';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAIInsights } from '@/hooks/useAIInsights';
import { Brain, Clock, Calendar, Lightbulb, Plus, Loader2 } from 'lucide-react';

interface AIInsightsProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export const AIInsights = ({ tasks, onAddTask }: AIInsightsProps) => {
  const { loading, getTaskSuggestions, optimizeSchedule } = useAIInsights();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any>(null);

  const loadSuggestions = async () => {
    if (tasks.length > 0) {
      const taskSuggestions = await getTaskSuggestions(tasks);
      setSuggestions(taskSuggestions);
    }
  };

  const loadSchedule = async () => {
    if (tasks.length > 0) {
      const optimizedSchedule = await optimizeSchedule(tasks);
      setSchedule(optimizedSchedule);
    }
  };

  useEffect(() => {
    loadSuggestions();
    loadSchedule();
  }, [tasks]);

  const handleAddSuggestedTask = (suggestion: any) => {
    const newTask = {
      title: suggestion.title,
      description: suggestion.description,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 1 week from now
      priority: suggestion.priority as 'High' | 'Medium' | 'Low',
      category: suggestion.category as 'Assignment' | 'Exam' | 'Study' | 'Personal',
      completed: false
    };
    onAddTask(newTask);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <CardTitle>AI Study Insights</CardTitle>
        </div>
        <CardDescription>Intelligent suggestions powered by AI</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="suggestions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="suggestions">Task Suggestions</TabsTrigger>
            <TabsTrigger value="schedule">Study Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Recommended Tasks</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadSuggestions}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lightbulb className="h-4 w-4" />}
                Refresh
              </Button>
            </div>

            <div className="space-y-3">
              {suggestions.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  {loading ? 'Generating AI suggestions...' : 'Add some tasks to get AI-powered suggestions!'}
                </p>
              ) : (
                suggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-blue-50/50 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{suggestion.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAddSuggestedTask(suggestion)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(suggestion.priority)} variant="outline">
                        {suggestion.priority}
                      </Badge>
                      <Badge variant="outline">{suggestion.category}</Badge>
                      {suggestion.estimatedDuration && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {suggestion.estimatedDuration}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Optimized Schedule</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadSchedule}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
                Optimize
              </Button>
            </div>

            {schedule ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <div className="font-medium text-purple-900">{schedule.totalStudyHours}h</div>
                    <div className="text-xs text-purple-600">Total Study Time</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-medium text-blue-900">{schedule.schedule?.length || 0}</div>
                    <div className="text-xs text-blue-600">Study Days</div>
                  </div>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {schedule.schedule?.map((day: any, index: number) => (
                    <div key={index} className="border rounded p-3">
                      <h4 className="font-medium text-sm mb-2">{day.day}</h4>
                      <div className="space-y-1">
                        {day.sessions?.map((session: any, sessionIndex: number) => (
                          <div key={sessionIndex} className="flex items-center justify-between text-xs">
                            <span className="font-medium">{session.time}</span>
                            <span className="flex-1 mx-2 text-gray-600">{session.task}</span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getPriorityColor(session.priority)}`}
                            >
                              {session.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {schedule.tips && schedule.tips.length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 rounded border">
                    <h4 className="font-medium text-sm text-green-900 mb-2">AI Study Tips</h4>
                    <ul className="text-xs text-green-700 space-y-1">
                      {schedule.tips.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">
                {loading ? 'Optimizing your schedule...' : 'Add some tasks to get an AI-optimized study schedule!'}
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
