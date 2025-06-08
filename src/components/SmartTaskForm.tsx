
import { useState } from "react";
import { Task } from "@/types/Task";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Brain, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAIInsights } from "@/hooks/useAIInsights";
import { Badge } from "@/components/ui/badge";

interface SmartTaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  tasks: Task[];
}

export const SmartTaskForm = ({ onSubmit, tasks }: SmartTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<Date>();
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [category, setCategory] = useState<'Assignment' | 'Exam' | 'Study' | 'Personal'>('Study');
  const [aiPrediction, setAiPrediction] = useState<any>(null);
  
  const { loading, predictDeadline } = useAIInsights();

  const handlePredictDeadline = async () => {
    if (!title || !category) return;
    
    const currentTask = {
      title,
      description,
      category,
      priority
    };
    
    const prediction = await predictDeadline(currentTask, tasks);
    if (prediction) {
      setAiPrediction(prediction);
      if (prediction.suggestedDeadline) {
        setDeadline(new Date(prediction.suggestedDeadline));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !deadline) return;

    onSubmit({
      title,
      description,
      deadline,
      priority,
      category,
      completed: false
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDeadline(undefined);
    setPriority('Medium');
    setCategory('Study');
    setAiPrediction(null);
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>Smart Task Creator</span>
        </CardTitle>
        <CardDescription>Create tasks with AI-powered deadline suggestions</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={(value: 'Assignment' | 'Exam' | 'Study' | 'Personal') => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Assignment">Assignment</SelectItem>
                  <SelectItem value="Exam">Exam</SelectItem>
                  <SelectItem value="Study">Study</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">Priority</label>
              <Select value={priority} onValueChange={(value: 'High' | 'Medium' | 'Low') => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="deadline" className="text-sm font-medium">Deadline</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePredictDeadline}
                  disabled={!title || !category || loading}
                  className="text-xs"
                >
                  {loading ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Brain className="h-3 w-3 mr-1" />
                  )}
                  AI Predict
                </Button>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {aiPrediction && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-purple-900 text-sm">AI Deadline Prediction</h4>
                <Badge className={getConfidenceColor(aiPrediction.confidence)} variant="outline">
                  {aiPrediction.confidence} Confidence
                </Badge>
              </div>
              <p className="text-sm text-purple-700">{aiPrediction.reasoning}</p>
            </div>
          )}

          <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            Create Smart Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
