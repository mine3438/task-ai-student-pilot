
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import type { Task } from '@/types/Task';

interface UserHabit {
  id: string;
  habit_type: string;
  habit_data: any;
  confidence_score: number;
  created_at: string;
  updated_at: string;
}

interface TaskInteraction {
  task_id?: string;
  interaction_type: 'accepted_suggestion' | 'rejected_suggestion' | 'completed' | 'delayed' | 'skipped';
  suggestion_source?: 'ai_suggestion' | 'manual_creation';
  interaction_data?: any;
}

interface UserPreference {
  preference_type: string;
  preference_value: any;
  weight: number;
}

export const useHabitLearning = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const trackTaskInteraction = async (interaction: TaskInteraction) => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase.rpc('insert_task_interaction', {
        p_user_id: user.id,
        p_task_id: interaction.task_id || null,
        p_interaction_type: interaction.interaction_type,
        p_suggestion_source: interaction.suggestion_source || null,
        p_interaction_data: interaction.interaction_data || {}
      });

      if (error) {
        console.error('Error tracking interaction:', error);
        toast({
          title: "Warning",
          description: "Failed to track interaction for learning",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error tracking interaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackTaskCompletion = async (task: Task, actualCompletionTime?: number) => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Track the completion interaction
      await trackTaskInteraction({
        task_id: task.id,
        interaction_type: 'completed',
        interaction_data: {
          priority: task.priority,
          category: task.category,
          planned_deadline: task.deadline,
          actual_completion_time: actualCompletionTime,
          completed_on_time: new Date() <= new Date(task.deadline)
        }
      });

      // Learn from completion patterns
      await updateHabitFromCompletion(task, actualCompletionTime);
      
      toast({
        title: "Learning Updated",
        description: "Your completion patterns have been recorded for AI improvement",
      });
    } catch (error) {
      console.error('Error tracking completion:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateHabitFromCompletion = async (task: Task, actualTime?: number) => {
    if (!user) return;

    try {
      const currentHour = new Date().getHours();
      
      // Update completion time habit
      const { error: timeError } = await supabase.rpc('update_completion_time_habit', {
        p_user_id: user.id,
        p_hour: currentHour
      });

      if (timeError) {
        console.error('Error updating time habit:', timeError);
      }

      // Update category preference habit
      const { error: categoryError } = await supabase.rpc('update_category_preference_habit', {
        p_user_id: user.id,
        p_category: task.category
      });

      if (categoryError) {
        console.error('Error updating category habit:', categoryError);
      }

    } catch (error) {
      console.error('Error updating habits:', error);
    }
  };

  const trackSuggestionFeedback = async (suggestionId: string, accepted: boolean, suggestionData?: any) => {
    if (!user) return;

    try {
      setLoading(true);
      
      await trackTaskInteraction({
        interaction_type: accepted ? 'accepted_suggestion' : 'rejected_suggestion',
        suggestion_source: 'ai_suggestion',
        interaction_data: {
          suggestion_id: suggestionId,
          suggestion_data: suggestionData
        }
      });

      // Update suggestion accuracy
      const { error } = await supabase.rpc('update_suggestion_accuracy', {
        p_user_id: user.id,
        p_accepted: accepted
      });

      if (error) {
        console.error('Error updating suggestion accuracy:', error);
      } else {
        toast({
          title: "Feedback Recorded",
          description: `Your ${accepted ? 'positive' : 'negative'} feedback helps improve AI suggestions`,
        });
      }
    } catch (error) {
      console.error('Error updating suggestion accuracy:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserHabits = async (): Promise<UserHabit[]> => {
    if (!user) return [];

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_user_habits', {
        p_user_id: user.id
      });

      if (error) {
        console.error('Error fetching habits:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching habits:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getUserPreferences = async (): Promise<UserPreference[]> => {
    if (!user) return [];

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_user_preferences', {
        p_user_id: user.id
      });

      if (error) {
        console.error('Error fetching preferences:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching preferences:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const trackTaskDelay = async (task: Task, delayReason?: string) => {
    if (!user) return;

    await trackTaskInteraction({
      task_id: task.id,
      interaction_type: 'delayed',
      interaction_data: {
        original_deadline: task.deadline,
        delay_reason: delayReason,
        delay_time: new Date().toISOString()
      }
    });
  };

  const trackTaskSkip = async (task: Task, skipReason?: string) => {
    if (!user) return;

    await trackTaskInteraction({
      task_id: task.id,
      interaction_type: 'skipped',
      interaction_data: {
        skip_reason: skipReason,
        skip_time: new Date().toISOString()
      }
    });
  };

  const getLearningInsights = async () => {
    if (!user) return null;

    try {
      setLoading(true);
      
      // Get recent interactions for analysis
      const { data: interactions, error } = await supabase
        .from('task_interactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching interactions:', error);
        return null;
      }

      // Analyze patterns
      const completions = interactions?.filter(i => i.interaction_type === 'completed') || [];
      const delays = interactions?.filter(i => i.interaction_type === 'delayed') || [];
      const suggestions = interactions?.filter(i => i.suggestion_source === 'ai_suggestion') || [];
      
      const completionRate = completions.length / Math.max(1, completions.length + delays.length);
      const suggestionAccuracy = suggestions.length > 0 
        ? suggestions.filter(s => s.interaction_type === 'accepted_suggestion').length / suggestions.length 
        : 0;

      return {
        completionRate,
        suggestionAccuracy,
        totalInteractions: interactions?.length || 0,
        recentActivity: interactions?.slice(0, 10) || []
      };
    } catch (error) {
      console.error('Error getting learning insights:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    trackTaskInteraction,
    trackTaskCompletion,
    trackSuggestionFeedback,
    trackTaskDelay,
    trackTaskSkip,
    getUserHabits,
    getUserPreferences,
    getLearningInsights
  };
};
