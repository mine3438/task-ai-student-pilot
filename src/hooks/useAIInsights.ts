
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/Task';
import { toast } from '@/hooks/use-toast';

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
  personalizedInsights?: string;
}

export const useAIInsights = () => {
  const [loading, setLoading] = useState(false);

  const getTaskSuggestions = async (tasks: Task[]): Promise<TaskSuggestion[]> => {
    if (tasks.length === 0) {
      return [];
    }

    setLoading(true);
    try {
      console.log('Requesting task suggestions...');
      const { data, error } = await supabase.functions.invoke('ai-study-insights', {
        body: {
          action: 'suggest_tasks',
          tasks: tasks
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('AI suggestions response:', data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error getting task suggestions:', error);
      toast({
        title: "AI Suggestions Unavailable",
        description: "Unable to get personalized task suggestions at the moment. Please try again later.",
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
        title: "Deadline Prediction Unavailable",
        description: "Unable to predict deadline at the moment.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const optimizeSchedule = async (tasks: Task[]): Promise<StudySchedule | null> => {
    if (tasks.filter(task => !task.completed).length === 0) {
      return null;
    }

    setLoading(true);
    try {
      console.log('Requesting schedule optimization...');
      const { data, error } = await supabase.functions.invoke('ai-study-insights', {
        body: {
          action: 'optimize_schedule',
          tasks: tasks.filter(task => !task.completed)
        }
      });

      if (error) {
        console.error('Schedule optimization error:', error);
        throw error;
      }

      console.log('Schedule optimization response:', data);
      return data;
    } catch (error) {
      console.error('Error optimizing schedule:', error);
      toast({
        title: "Schedule Optimization Unavailable",
        description: "Unable to create optimized schedule at the moment. Complete more tasks to build your learning profile.",
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
