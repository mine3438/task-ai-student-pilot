
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHabitLearning } from '@/hooks/useHabitLearning';
import { Brain, TrendingUp, Target, Clock, BarChart3, Activity } from 'lucide-react';

export const TrainingDashboard = () => {
  const { getUserHabits, getUserPreferences, getLearningInsights, loading } = useHabitLearning();
  const [habits, setHabits] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    const loadTrainingData = async () => {
      const [habitsData, preferencesData, insightsData] = await Promise.all([
        getUserHabits(),
        getUserPreferences(),
        getLearningInsights()
      ]);
      
      setHabits(habitsData);
      setPreferences(preferencesData);
      setInsights(insightsData);
    };

    loadTrainingData();
  }, []);

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    if (score >= 0.4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 0.8) return 'High';
    if (score >= 0.6) return 'Medium';
    if (score >= 0.4) return 'Low';
    return 'Very Low';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 animate-pulse" />
            AI Training Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading training data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Training Dashboard
          </CardTitle>
          <CardDescription>
            Monitor how well the AI is learning from your behavior patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="habits">Habits</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-600" />
                      Completion Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {insights ? Math.round(insights.completionRate * 100) : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">Tasks completed on time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      AI Accuracy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {insights ? Math.round(insights.suggestionAccuracy * 100) : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">Suggestions accepted</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Activity className="h-4 w-4 text-purple-600" />
                      Training Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      {insights ? insights.totalInteractions : 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Total interactions</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Learning Progress</CardTitle>
                  <CardDescription>Overall AI training confidence across different areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {habits.map((habit) => (
                      <div key={habit.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">
                            {habit.habit_type.replace(/_/g, ' ')}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-white ${getConfidenceColor(habit.confidence_score)}`}>
                              {getConfidenceLabel(habit.confidence_score)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {Math.round(habit.confidence_score * 100)}%
                            </span>
                          </div>
                        </div>
                        <Progress value={habit.confidence_score * 100} className="h-2" />
                      </div>
                    ))}
                    
                    {habits.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        Complete more tasks to start building your AI learning profile
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="habits" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {habits.map((habit) => (
                  <Card key={habit.id}>
                    <CardHeader>
                      <CardTitle className="text-lg capitalize flex items-center justify-between">
                        {habit.habit_type.replace(/_/g, ' ')}
                        <Badge variant="outline" className={`text-white ${getConfidenceColor(habit.confidence_score)}`}>
                          {Math.round(habit.confidence_score * 100)}% Confidence
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {habit.habit_type === 'optimal_completion_time' && habit.habit_data?.hour_preferences && (
                          <div>
                            <h4 className="font-medium mb-2">Peak Hours:</h4>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(habit.habit_data.hour_preferences)
                                .sort(([,a]: any, [,b]: any) => b - a)
                                .slice(0, 5)
                                .map(([hour, count]) => (
                                  <Badge key={hour} variant="outline">
                                    {hour}:00 ({count} tasks)
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        )}

                        {habit.habit_type === 'category_preference' && habit.habit_data?.preferences && (
                          <div>
                            <h4 className="font-medium mb-2">Preferred Categories:</h4>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(habit.habit_data.preferences)
                                .sort(([,a]: any, [,b]: any) => b - a)
                                .map(([category, count]) => (
                                  <Badge key={category} variant="outline">
                                    {category} ({count} completed)
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        )}

                        {habit.habit_type === 'suggestion_accuracy' && habit.habit_data && (
                          <div>
                            <h4 className="font-medium mb-2">AI Suggestion Performance:</h4>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div className="text-center p-2 bg-green-50 rounded">
                                <div className="font-bold text-green-700">{habit.habit_data.accepted}</div>
                                <div className="text-green-600">Accepted</div>
                              </div>
                              <div className="text-center p-2 bg-red-50 rounded">
                                <div className="font-bold text-red-700">{habit.habit_data.total - habit.habit_data.accepted}</div>
                                <div className="text-red-600">Rejected</div>
                              </div>
                              <div className="text-center p-2 bg-blue-50 rounded">
                                <div className="font-bold text-blue-700">{Math.round(habit.habit_data.accuracy * 100)}%</div>
                                <div className="text-blue-600">Accuracy</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {preferences.map((pref, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg capitalize">
                        {pref.preference_type.replace(/_/g, ' ')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Weight:</span>
                          <span className="font-medium">{Math.round(pref.weight * 100)}%</span>
                        </div>
                        <Progress value={pref.weight * 100} className="h-2" />
                        <div className="text-sm text-muted-foreground">
                          {JSON.stringify(pref.preference_value, null, 2)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {preferences.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">No learning preferences established yet</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Complete more tasks and interact with AI suggestions to build preferences
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              {insights && insights.recentActivity.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Learning Activity</CardTitle>
                    <CardDescription>Your latest interactions helping train the AI</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {insights.recentActivity.map((activity: any, index: number) => (
                        <div key={activity.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium capitalize">
                              {activity.interaction_type.replace(/_/g, ' ')}
                            </span>
                            {activity.suggestion_source && (
                              <Badge variant="outline" className="ml-2">
                                {activity.suggestion_source}
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">No recent activity to display</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start using the app to see your learning insights here
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
