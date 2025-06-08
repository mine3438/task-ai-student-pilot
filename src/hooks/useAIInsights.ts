
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/Task';
import { toast } from '@/components/ui/use-toast';

interface TaskSuggestion {
  title: string;
  description: string;
  category: 'Assignment' | 'Exam' | 'Study' | 'Personal';
  priority: 'High' | 'Medium' | 'Low';
  estimatedDuration: string;
}

interface DeadlinePrediction {
  suggestedDeadline: string;
  reasoning: string;
  confidence: 'High' | 'Medium' | 'Low';
}

interface StudySchedule {
  schedule: Array<{
    day: string;
    sessions: Array<{
      time: string;
      task: string;
      type: 'Study' | 'Review' | 'Break';
      priority: 'High' | 'Medium' | 'Low';
    }>;
  }>;
  tips: string[];
  totalStudyHours: number;
}

export const useAIInsights = () => {
  const [loading, setLoading] = useState(false);

  const getTaskSuggestions = async (tasks: Task[]): Promise<TaskSuggestion[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-study-insights', {
        body: {
          action: 'suggest_tasks',
          tasks: tasks
        }
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting task suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to get AI task suggestions",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const predictDeadline = async (currentTask: Partial<Task>, tasks: Task[]): Promise<DeadlinePrediction | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-study-insights', {
        body: {
          action: 'predict_deadline',
          currentTask: currentTask,
          tasks: tasks
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error predicting deadline:', error);
      toast({
        title: "Error",
        description: "Failed to predict deadline",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const optimizeSchedule = async (tasks: Task[]): Promise<StudySchedule | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-study-insights', {
        body: {
          action: 'optimize_schedule',
          tasks: tasks.filter(task => !task.completed)
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error optimizing schedule:', error);
      toast({
        title: "Error",
        description: "Failed to optimize schedule",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getTaskSuggestions,
    predictDeadline,
    optimizeSchedule
  };
};
