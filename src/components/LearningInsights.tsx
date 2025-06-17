
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useHabitLearning } from '@/hooks/useHabitLearning';
import { Brain, Clock, Target, TrendingUp, BarChart3 } from 'lucide-react';

export const LearningInsights = () => {
  const { getUserHabits, getUserPreferences } = useHabitLearning();
  const [habits, setHabits] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLearningData = async () => {
      setLoading(true);
      const [habitsData, preferencesData] = await Promise.all([
        getUserHabits(),
        getUserPreferences()
      ]);
      setHabits(habitsData);
      setPreferences(preferencesData);
      setLoading(false);
    };

    loadLearningData();
  }, []);

  const getOptimalHours = () => {
    const timeHabit = habits.find(h => h.habit_type === 'optimal_completion_time');
    if (!timeHabit?.habit_data?.hour_preferences) return null;
    
    return Object.entries(timeHabit.habit_data.hour_preferences)
      .sort(([,a]: any, [,b]: any) => b - a)
      .slice(0, 3)
      .map(([hour, count]) => ({ hour: parseInt(hour), count: count as number }));
  };

  const getCategoryPreferences = () => {
    const categoryHabit = habits.find(h => h.habit_type === 'category_preference');
    if (!categoryHabit?.habit_data?.preferences) return null;
    
    return Object.entries(categoryHabit.habit_data.preferences)
      .sort(([,a]: any, [,b]: any) => b - a)
      .map(([category, count]) => ({ category, count: count as number }));
  };

  const getSuggestionAccuracy = () => {
    const accuracyHabit = habits.find(h => h.habit_type === 'suggestion_accuracy');
    return accuracyHabit?.habit_data;
  };

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Learning Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Analyzing your learning patterns...</p>
        </CardContent>
      </Card>
    );
  }

  const optimalHours = getOptimalHours();
  const categoryPrefs = getCategoryPreferences();
  const suggestionAccuracy = getSuggestionAccuracy();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Your Learning Insights
        </CardTitle>
        <CardDescription>
          AI-powered analysis of your study habits and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Optimal Hours */}
        {optimalHours && optimalHours.length > 0 && (
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-blue-600" />
              Your Most Productive Hours
            </h4>
            <div className="flex flex-wrap gap-2">
              {optimalHours.map(({ hour, count }) => (
                <Badge key={hour} variant="outline" className="bg-blue-50">
                  {formatHour(hour)} ({count} tasks)
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Category Preferences */}
        {categoryPrefs && categoryPrefs.length > 0 && (
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-green-600" />
              Your Preferred Categories
            </h4>
            <div className="flex flex-wrap gap-2">
              {categoryPrefs.slice(0, 5).map(({ category, count }) => (
                <Badge key={category} variant="outline" className="bg-green-50">
                  {category} ({count} completed)
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* AI Suggestion Accuracy */}
        {suggestionAccuracy && (
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              AI Suggestion Performance
            </h4>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700">Acceptance Rate</span>
                <span className="font-medium text-purple-900">
                  {Math.round(suggestionAccuracy.accuracy * 100)}%
                </span>
              </div>
              <div className="text-xs text-purple-600 mt-1">
                {suggestionAccuracy.accepted} accepted out of {suggestionAccuracy.total} suggestions
              </div>
            </div>
          </div>
        )}

        {/* Learning Progress */}
        <div>
          <h4 className="font-medium flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-orange-600" />
            Learning Profile Strength
          </h4>
          <div className="space-y-2">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center justify-between">
                <span className="text-sm capitalize">
                  {habit.habit_type.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 transition-all duration-300"
                      style={{ width: `${habit.confidence_score * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">
                    {Math.round(habit.confidence_score * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {habits.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Complete more tasks to build your learning profile!</p>
            <p className="text-xs mt-1">The AI will learn your preferences and optimize suggestions.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
