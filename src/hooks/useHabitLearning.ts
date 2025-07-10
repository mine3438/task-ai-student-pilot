
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useHabitLearning = () => {
  const [loading, setLoading] = useState(false);

  const getUserHabits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

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

  const getUserPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

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

  const trackTaskCompletion = async (task: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const completionHour = new Date().getHours();
      
      // Update completion time habit
      await supabase.rpc('update_completion_time_habit', {
        p_user_id: user.id,
        p_hour: completionHour
      });

      // Update category preference
      await supabase.rpc('update_category_preference_habit', {
        p_user_id: user.id,
        p_category: task.category
      });

      // Record interaction
      await supabase.rpc('insert_task_interaction', {
        p_user_id: user.id,
        p_task_id: task.id,
        p_interaction_type: 'completed',
        p_interaction_data: {
          completed_at_hour: completionHour,
          category: task.category,
          priority: task.priority,
          completed_on_time: new Date(task.deadline) >= new Date()
        }
      });

    } catch (error) {
      console.error('Error tracking task completion:', error);
    }
  };

  const trackSuggestionFeedback = async (suggestionId: string, accepted: boolean, suggestion?: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update suggestion accuracy
      await supabase.rpc('update_suggestion_accuracy', {
        p_user_id: user.id,
        p_accepted: accepted
      });

      // Record interaction
      await supabase.rpc('insert_task_interaction', {
        p_user_id: user.id,
        p_task_id: null,
        p_interaction_type: accepted ? 'suggestion_accepted' : 'suggestion_rejected',
        p_interaction_data: {
          suggestion_id: suggestionId,
          suggestion_data: suggestion,
          feedback_type: accepted ? 'positive' : 'negative'
        },
        p_suggestion_source: 'ai_insights'
      });

    } catch (error) {
      console.error('Error tracking suggestion feedback:', error);
    }
  };

  const trackTaskCreation = async (task: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.rpc('insert_task_interaction', {
        p_user_id: user.id,
        p_task_id: task.id,
        p_interaction_type: 'created',
        p_interaction_data: {
          category: task.category,
          priority: task.priority,
          created_at_hour: new Date().getHours()
        }
      });

    } catch (error) {
      console.error('Error tracking task creation:', error);
    }
  };

  return {
    loading,
    getUserHabits,
    getUserPreferences,
    trackTaskCompletion,
    trackSuggestionFeedback,
    trackTaskCreation
  };
};
