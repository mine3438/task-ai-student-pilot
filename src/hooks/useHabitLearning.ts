
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useHabitLearning = () => {
  const [loading, setLoading] = useState(false);

  const getUserHabits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Since we don't have user_habits table, return mock data for now
      // This would normally query a user_habits table
      return [];
    } catch (error) {
      console.error('Error fetching habits:', error);
      return [];
    }
  };

  const getUserPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Since we don't have user_learning_preferences table, return mock data for now
      // This would normally query a user_learning_preferences table
      return [];
    } catch (error) {
      console.error('Error fetching preferences:', error);
      return [];
    }
  };

  const getLearningInsights = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Get tasks data to calculate basic insights
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!tasks) return null;

      // Calculate completion rate from existing tasks
      const completedTasks = tasks.filter(t => t.completed).length;
      const totalTasks = tasks.length;
      const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 0;

      // Mock suggestion accuracy since we don't have interaction tracking yet
      const suggestionAccuracy = 0.75;

      return {
        completionRate,
        suggestionAccuracy,
        totalInteractions: tasks.length,
        recentActivity: tasks.slice(0, 10).map(task => ({
          id: task.id,
          interaction_type: task.completed ? 'completed' : 'created',
          created_at: task.created_at
        }))
      };
    } catch (error) {
      console.error('Error fetching learning insights:', error);
      return null;
    }
  };

  const trackTaskCompletion = async (task: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, just log the completion
      // In a full implementation, this would update habit tracking tables
      console.log('Task completed:', task.id, 'at hour:', new Date().getHours());
    } catch (error) {
      console.error('Error tracking task completion:', error);
    }
  };

  const trackTaskDelay = async (task: any, reason: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, just log the delay
      console.log('Task delayed:', task.id, 'reason:', reason);
    } catch (error) {
      console.error('Error tracking task delay:', error);
    }
  };

  const trackTaskSkip = async (task: any, reason: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, just log the skip
      console.log('Task skipped:', task.id, 'reason:', reason);
    } catch (error) {
      console.error('Error tracking task skip:', error);
    }
  };

  const trackSuggestionFeedback = async (suggestionId: string, accepted: boolean, suggestion?: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, just log the feedback
      console.log('Suggestion feedback:', suggestionId, 'accepted:', accepted);
    } catch (error) {
      console.error('Error tracking suggestion feedback:', error);
    }
  };

  const trackTaskCreation = async (task: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, just log the creation
      console.log('Task created:', task.id, 'category:', task.category);
    } catch (error) {
      console.error('Error tracking task creation:', error);
    }
  };

  const trackTaskInteraction = async (data: {
    task_id: string;
    interaction_type: string;
    suggestion_source: string;
    interaction_data: any;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, just log the interaction
      console.log('Task interaction:', data);
    } catch (error) {
      console.error('Error tracking task interaction:', error);
    }
  };

  return {
    loading,
    getUserHabits,
    getUserPreferences,
    getLearningInsights,
    trackTaskCompletion,
    trackTaskDelay,
    trackTaskSkip,
    trackSuggestionFeedback,
    trackTaskCreation,
    trackTaskInteraction
  };
};
