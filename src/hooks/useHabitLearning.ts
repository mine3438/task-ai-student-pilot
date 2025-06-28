
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
      // Use supabase.rpc or direct SQL query to insert into task_interactions
      const { error } = await supabase.rpc('insert_task_interaction', {
        p_user_id: user.id,
        p_task_id: interaction.task_id,
        p_interaction_type: interaction.interaction_type,
        p_suggestion_source: interaction.suggestion_source,
        p_interaction_data: interaction.interaction_data
      });

      if (error) {
        console.error('Error tracking interaction:', error);
      }
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  const trackTaskCompletion = async (task: Task, actualCompletionTime?: number) => {
    if (!user) return;

    try {
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
    } catch (error) {
      console.error('Error tracking completion:', error);
    }
  };

  const updateHabitFromCompletion = async (task: Task, actualTime?: number) => {
    if (!user) return;

    try {
      const currentHour = new Date().getHours();
      
      // Update optimal completion time habit using RPC
      await supabase.rpc('update_completion_time_habit', {
        p_user_id: user.id,
        p_hour: currentHour
      });

      // Update category preference habit using RPC
      await supabase.rpc('update_category_preference_habit', {
        p_user_id: user.id,
        p_category: task.category
      });

    } catch (error) {
      console.error('Error updating habits:', error);
    }
  };

  const trackSuggestionFeedback = async (suggestionId: string, accepted: boolean, suggestionData?: any) => {
    if (!user) return;

    await trackTaskInteraction({
      interaction_type: accepted ? 'accepted_suggestion' : 'rejected_suggestion',
      suggestion_source: 'ai_suggestion',
      interaction_data: {
        suggestion_id: suggestionId,
        suggestion_data: suggestionData
      }
    });

    // Update suggestion accuracy using RPC
    try {
      await supabase.rpc('update_suggestion_accuracy', {
        p_user_id: user.id,
        p_accepted: accepted
      });
    } catch (error) {
      console.error('Error updating suggestion accuracy:', error);
    }
  };

  const getUserHabits = async (): Promise<UserHabit[]> => {
    if (!user) return [];

    try {
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
    }
  };

  const getUserPreferences = async (): Promise<UserPreference[]> => {
    if (!user) return [];

    try {
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
    }
  };

  return {
    loading,
    trackTaskInteraction,
    trackTaskCompletion,
    trackSuggestionFeedback,
    getUserHabits,
    getUserPreferences
  };
};
