
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
      const { error } = await supabase
        .from('task_interactions')
        .insert([{
          user_id: user.id,
          ...interaction
        }]);

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
      
      // Update optimal completion time habit
      const { data: existingTimeHabit } = await supabase
        .from('user_habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('habit_type', 'optimal_completion_time')
        .single();

      if (existingTimeHabit) {
        const currentData = existingTimeHabit.habit_data || { hour_preferences: {} };
        const hourPrefs = currentData.hour_preferences || {};
        hourPrefs[currentHour] = (hourPrefs[currentHour] || 0) + 1;
        
        await supabase
          .from('user_habits')
          .update({
            habit_data: { ...currentData, hour_preferences: hourPrefs },
            confidence_score: Math.min(existingTimeHabit.confidence_score + 0.1, 1.0)
          })
          .eq('id', existingTimeHabit.id);
      } else {
        await supabase
          .from('user_habits')
          .insert([{
            user_id: user.id,
            habit_type: 'optimal_completion_time',
            habit_data: { hour_preferences: { [currentHour]: 1 } },
            confidence_score: 0.1
          }]);
      }

      // Update category preference habit
      const { data: existingCategoryHabit } = await supabase
        .from('user_habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('habit_type', 'category_preference')
        .single();

      if (existingCategoryHabit) {
        const currentData = existingCategoryHabit.habit_data || { preferences: {} };
        const categoryPrefs = currentData.preferences || {};
        categoryPrefs[task.category] = (categoryPrefs[task.category] || 0) + 1;
        
        await supabase
          .from('user_habits')
          .update({
            habit_data: { ...currentData, preferences: categoryPrefs },
            confidence_score: Math.min(existingCategoryHabit.confidence_score + 0.05, 1.0)
          })
          .eq('id', existingCategoryHabit.id);
      } else {
        await supabase
          .from('user_habits')
          .insert([{
            user_id: user.id,
            habit_type: 'category_preference',
            habit_data: { preferences: { [task.category]: 1 } },
            confidence_score: 0.05
          }]);
      }

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

    // Update suggestion accuracy habits
    try {
      const { data: existingAccuracyHabit } = await supabase
        .from('user_habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('habit_type', 'suggestion_accuracy')
        .single();

      if (existingAccuracyHabit) {
        const currentData = existingAccuracyHabit.habit_data || { total: 0, accepted: 0 };
        const newTotal = currentData.total + 1;
        const newAccepted = currentData.accepted + (accepted ? 1 : 0);
        
        await supabase
          .from('user_habits')
          .update({
            habit_data: { total: newTotal, accepted: newAccepted, accuracy: newAccepted / newTotal },
            confidence_score: Math.min(existingAccuracyHabit.confidence_score + 0.02, 1.0)
          })
          .eq('id', existingAccuracyHabit.id);
      } else {
        await supabase
          .from('user_habits')
          .insert([{
            user_id: user.id,
            habit_type: 'suggestion_accuracy',
            habit_data: { total: 1, accepted: accepted ? 1 : 0, accuracy: accepted ? 1 : 0 },
            confidence_score: 0.02
          }]);
      }
    } catch (error) {
      console.error('Error updating suggestion accuracy:', error);
    }
  };

  const getUserHabits = async (): Promise<UserHabit[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('user_habits')
        .select('*')
        .eq('user_id', user.id)
        .order('confidence_score', { ascending: false });

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
      const { data, error } = await supabase
        .from('user_learning_preferences')
        .select('*')
        .eq('user_id', user.id)
        .order('weight', { ascending: false });

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
